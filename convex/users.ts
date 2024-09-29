import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, internalQuery } from "./_generated/server";
import { queryWithSession } from "./lib/session";

export const createUser = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      credits: Number(process.env.DEFAULT_CREDITS!),
    });
  },
});

export const getAvailableCredits = queryWithSession({
  args: {},
  handler: async (ctx) => {
    const userIdentity = await ctx.auth.getUserIdentity();
    console.log("userIdentity", userIdentity);
    let credits: number = 0;
    if (userIdentity) {
      const user = await ctx.runQuery(internal.users.getById, {
        userId: userIdentity.subject,
      });
      credits = user ? user.credits : Number(process.env.DEFAULT_CREDITS);
    } else {
      const session = await ctx.runQuery(internal["sessions"].getBySessionId, {
        sessionId: ctx.sessionId,
      });
      console.log("session", session);
      credits = session
        ? session.credits!
        : Number(process.env.DEFAULT_CREDITS);
    }

    console.log("Returning credits:", credits);
    return credits;
  },
});

export const getById = internalQuery({
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

export const setStripeId = internalMutation({
  args: {
    userId: v.string(),
    stripeId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) {
      throw new ConvexError("No user found with userId = " + args.userId);
    }

    await ctx.db.patch(user._id, {
      stripeId: args.stripeId,
    });
  },
});
