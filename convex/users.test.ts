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
  await asSystem.mutation(internal.users.createSignedInUser, {
    userId,
    email,
  });

  // Verify the user was created correctly
  const user = await asSystem.run(async (ctx: QueryCtx) => {
    return await ctx.db
      .query("users")
      .withIndex("user_id", (q) => q.eq("userId", userId))
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
      userId,
      email,
      credits: 10,
      isAnonymous: false,
    });
  });

  // Get the user by userId
  const user = await asSystem.query(internal.users.getByUserId, {
    userId,
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
      userId,
      email,
      credits: 25,
      isAnonymous: false,
    });
  });

  // Get available credits
  const credits = await asUser.query(api.users.getAvailableCredits, {});

  expect(credits).toBe(25);
});

test("should get current user", async () => {
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
  const dbId = await asUser.run(async (ctx: MutationCtx) => {
    return await ctx.db.insert("users", {
      userId,
      email,
      credits: 10,
      isAnonymous: false,
    });
  });

  // Get current user
  const user = await asUser.query(api.users.getCurrentUser, {});

  expect(user).toMatchObject({
    _id: dbId,
    userId,
    email,
    credits: 10,
    isAnonymous: false,
  });
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
      userId,
      email,
      credits: 10,
      isAnonymous: false,
    });
  });

  // Add credits to the user
  await asSystem.mutation(internal.users.addCredits, {
    userId,
    stripeCheckoutSessionId: "cs_test_123",
    stripeItemId: "si_test_123",
    creditsToAdd: 5,
  });

  // Verify credits were added
  const updatedUser = await asSystem.run(async (ctx: QueryCtx) => {
    return await ctx.db
      .query("users")
      .withIndex("user_id", (q) => q.eq("userId", userId))
      .first();
  });

  // Add null check to satisfy TypeScript
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
  // Use system identity for internal mutations
  const asSystem = t.withIdentity({ name: "System" });

  const nonExistentUserId = "non-existent-user";

  // Attempt to add credits to a non-existent user
  await expect(
    asSystem.mutation(internal.users.addCredits, {
      userId: nonExistentUserId,
      stripeCheckoutSessionId: "cs_test_123",
      stripeItemId: "si_test_123",
      creditsToAdd: 5,
    })
  ).rejects.toThrow(ConvexError);
});
