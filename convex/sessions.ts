import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getBySessionId = internalQuery({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    return session;
  },
});

export const createSession = internalMutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sessions", {
      sessionId: args.sessionId,
      credits: Number(process.env.DEFAULT_CREDITS!),
    });
  },
});
