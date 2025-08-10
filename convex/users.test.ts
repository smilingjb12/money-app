import { convexTest } from "convex-test";
import { ConvexError } from "convex/values";
import { expect, test, vi } from "vitest";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { MutationCtx, QueryCtx } from "./_generated/server";
import schema from "./schema";

// Mock the convexEnv for testing
vi.mock("./lib/convexEnv", () => ({
  convexEnv: {
    DEFAULT_CREDITS: "10",
  },
}));

test("should get current user", async () => {
  const t = convexTest(schema);
  
  const email = "test@example.com";

  // Create a user in the database first to get a real user ID
  const userId = await t.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("users", {
      email,
    });
  });

  // Create a user with auth context using the real user ID
  const asUser = t.withIdentity({ subject: userId });

  // Get current user
  const user = await asUser.query(api.users.getCurrentUser, {});

  expect(user).toMatchObject({
    email,
  });
});

test("should get available credits for authenticated user", async () => {
  const t = convexTest(schema);

  const email = "test@example.com";
  
  // Create a user in the database first to get a real user ID
  const userId = await t.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("users", {
      email,
      credits: 25,
    });
  });

  const asUser = t.withIdentity({ subject: userId });

  // Get available credits
  const credits = await asUser.query(api.users.getAvailableCredits, {});

  expect(credits).toBe(25);
});

test("should return default credits for unauthenticated user", async () => {
  const t = convexTest(schema);

  // Get available credits without any authentication
  const credits = await t.query(api.users.getAvailableCredits, {});

  expect(credits).toBe(10); // DEFAULT_CREDITS
});

test("should add credits to a user", async () => {
  const t = convexTest(schema);
  const asSystem = t.withIdentity({ name: "System" });

  const email = "test@example.com";

  // Create a user first and get the real user ID
  const userId = await asSystem.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("users", {
      email,
      credits: 10,
    });
  });

  // Add credits to the user
  await asSystem.mutation(internal.users._addCredits, {
    userId: userId.toString(),
    stripeCheckoutSessionId: "cs_test_123",
    stripeItemId: "si_test_123",
    creditsToAdd: 5,
  });

  // Verify credits were added
  const updatedUser = await asSystem.run(async (ctx: QueryCtx) => {
    return await ctx.db.get(userId);
  });

  expect(updatedUser?.credits).toBe(15);

  // Verify purchase record was created
  const purchase = await asSystem.run(async (ctx: QueryCtx) => {
    return await ctx.db
      .query("userPurchases")
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
  });

  expect(purchase).toMatchObject({
    userId,
    stripeCheckoutSessionId: "cs_test_123",
    stripeItemId: "si_test_123",
  });
});

test("should throw error when adding credits to non-existent user", async () => {
  const t = convexTest(schema);
  const asSystem = t.withIdentity({ name: "System" });

  // Use a fake but properly formatted user ID
  const nonExistentUserId = "k17xxxxxxxxxxxxxxxxxxxxxxxx" as Id<"users">;

  // Attempt to add credits to a non-existent user
  await expect(
    asSystem.mutation(internal.users._addCredits, {
      userId: nonExistentUserId,
      stripeCheckoutSessionId: "cs_test_123",
      stripeItemId: "si_test_123",
      creditsToAdd: 5,
    })
  ).rejects.toThrow(ConvexError);
});
