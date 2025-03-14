import { convexTest } from "convex-test";
import { ConvexError } from "convex/values";
import { expect, test, vi } from "vitest";
import { api, internal } from "./_generated/api";
import { MutationCtx, QueryCtx } from "./_generated/server";
import schema from "./schema";

// Mock the convexEnv for testing
vi.mock("./lib/convexEnv", () => ({
  convexEnv: {
    DEFAULT_CREDITS: "10",
  },
}));

test("should create a signed in user", async () => {
  const t = convexTest(schema);
  // Use system identity for internal mutations
  const asSystem = t.withIdentity({ name: "System" });

  const userId = "test-user-id";
  const email = "test@example.com";

  // Create a new user
  await asSystem.mutation(internal.users.createOrUpdateUser, {
    externalUserId: userId,
    email,
  });

  // Verify the user was created correctly
  const user = await asSystem.run(async (ctx: QueryCtx) => {
    return await ctx.db
      .query("users")
      .withIndex("external_user_id", (q) => q.eq("externalUserId", userId))
      .first();
  });

  expect(user).toMatchObject({
    userId,
    email,
    credits: 10, // Default credits from convexEnv
    isAnonymous: false,
  });
});

test("should get user by userId", async () => {
  const t = convexTest(schema);
  // Use system identity for internal queries
  const asSystem = t.withIdentity({ name: "System" });

  const userId = "test-user-id";
  const email = "test@example.com";

  // Create a user first
  await asSystem.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("users", {
      externalUserId: userId,
      email,
      credits: 10,
    });
  });

  // Get the user by userId
  const user = await asSystem.query(internal.users.getByExternalUserId, {
    externalUserId: userId,
  });

  expect(user).toMatchObject({
    userId,
    email,
    credits: 10,
    isAnonymous: false,
  });
});

test("should get available credits for a user", async () => {
  const t = convexTest(schema);

  // Create a user with a specific identity
  const userId = "test-user-id";
  const email = "test@example.com";
  // Use the correct identity format that matches what auth.getUserIdentity() returns
  const asUser = t.withIdentity({
    subject: userId,
    tokenIdentifier: "test",
    issuer: "https://example.com",
  });

  // Insert the user into the database
  await asUser.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("users", {
      externalUserId: userId,
      email,
      credits: 25,
    });
  });

  // Get available credits
  const credits = await asUser.query(api.users.getAvailableCredits, {});

  expect(credits).toBe(25);
});

test("should add credits to a user", async () => {
  const t = convexTest(schema);
  // Use system identity for internal mutations
  const asSystem = t.withIdentity({ name: "System" });

  const userId = "test-user-id";
  const email = "test@example.com";

  // Create a user first
  await asSystem.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("users", {
      externalUserId: userId,
      email,
      credits: 10,
    });
  });

  // Add credits to the user
  await asSystem.mutation(internal.users.addCredits, {
    externalUserId: userId,
    stripeCheckoutSessionId: "cs_test_123",
    stripeItemId: "si_test_123",
    creditsToAdd: 5,
  });

  // Verify credits were added
  const updatedUser = await asSystem.run(async (ctx: QueryCtx) => {
    return await ctx.db
      .query("users")
      .withIndex("external_user_id", (q) => q.eq("externalUserId", userId))
      .first();
  });

  // Add null check to satisfy TypeScript
  expect(updatedUser?.credits).toBe(15);

  // Verify purchase record was created
  const purchase = await asSystem.run(async (ctx: QueryCtx) => {
    return await ctx.db
      .query("userPurchases")
      .filter((q) => q.eq(q.field("externalUserId"), userId))
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
  // Use system identity for internal mutations
  const asSystem = t.withIdentity({ name: "System" });

  const nonExistentUserId = "non-existent-user";

  // Attempt to add credits to a non-existent user
  await expect(
    asSystem.mutation(internal.users.addCredits, {
      externalUserId: nonExistentUserId,
      stripeCheckoutSessionId: "cs_test_123",
      stripeItemId: "si_test_123",
      creditsToAdd: 5,
    })
  ).rejects.toThrow(ConvexError);
});
