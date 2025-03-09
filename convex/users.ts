import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { UserService } from "./services/user.service";

export const getAvailableCredits = query({
  args: {},
  handler: async (ctx): Promise<number> => {
    return await UserService.getAvailableCredits(ctx);
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    return await UserService.getCurrentUser(ctx);
  },
});

export const createSignedInUser = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await UserService.createSignedInUser(ctx, args);
  },
});

export const getByUserId = internalQuery({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await UserService.getUserById(ctx, args);
  },
});

export const addCredits = internalMutation({
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
