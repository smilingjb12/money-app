import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery } from "./_generated/server";
import { getDefaultFreeCredits } from "./lib/credits";
import { mutationWithSession, queryWithSession } from "./lib/session";

export const createAnonymousUserOnStartup = mutationWithSession({
  args: {},
  handler: async (ctx) => {
    const currentUser = await ctx.runQuery(api.users.getCurrentUser, {
      sessionId: ctx.sessionId,
    });
    if (currentUser) {
      return;
    }
    console.log("Creating new anonymous user:", ctx.sessionId);
    return await ctx.db.insert("users", {
      userId: ctx.sessionId,
      email: "Anonymous",
      credits: getDefaultFreeCredits(),
      isAnonymous: true,
      stripeCompletedCheckoutSessionIds: [],
    });
  },
});

export const createSignedInUser = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
    isAnonymous: v.boolean(),
    credits: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      credits: args.credits,
      isAnonymous: args.isAnonymous,
      stripeCompletedCheckoutSessionIds: [],
    });
  },
});

export const decrementCredits = internalMutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getByUserId, {
      userId: args.userId,
    });
    await ctx.db.patch(user!._id, {
      credits: user!.credits - 1,
    });
  },
});

export const getAvailableCredits = queryWithSession({
  args: {},
  handler: async (ctx): Promise<number> => {
    const userIdentity = await ctx.auth.getUserIdentity();
    const userId = userIdentity?.subject ?? ctx.sessionId;
    const user = await ctx.runQuery(internal.users.getByUserId, {
      userId: userId,
    });
    return user ? user.credits : getDefaultFreeCredits();
  },
});

export const getCurrentUser = queryWithSession({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      return await ctx.runQuery(internal.users.getByUserId, {
        userId: ctx.sessionId,
      });
    }
    return await ctx.runQuery(internal.users.getByUserId, {
      userId: userIdentity!.subject,
    });
  },
});

export const getByUserId = internalQuery({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    return user;
  },
});

export const addCredits = internalMutation({
  args: {
    userId: v.string(),
    stripeCheckoutSessionId: v.string(),
    creditsToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    console.log("Adding", args.creditsToAdd, "credits to user:", args.userId);
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("No user found with userId = " + args.userId);
    }

    await ctx.db.patch(user._id, {
      credits: user.credits + args.creditsToAdd,
      stripeCompletedCheckoutSessionIds: [
        ...user.stripeCompletedCheckoutSessionIds,
        args.stripeCheckoutSessionId,
      ],
    });
  },
});
