import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internalMutation, query } from "./_generated/server";
import { UserService } from "./services/user.service";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

export const getAvailableCredits = query({
  args: {},
  handler: async (ctx): Promise<number> => {
    return await UserService.getAvailableCredits(ctx);
  },
});

export const _addCredits = internalMutation({
  args: {
    userId: v.string(),
    stripeCheckoutSessionId: v.string(),
    stripeItemId: v.string(),
    creditsToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    return await UserService.addCredits(ctx, args);
  },
});
