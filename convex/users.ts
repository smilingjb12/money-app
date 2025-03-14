import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { requireAuthentication } from "./lib/helpers";
import { UserService } from "./services/user.service";

export const getAvailableCredits = query({
  args: {},
  handler: async (ctx): Promise<number> => {
    await requireAuthentication(ctx);
    return await UserService.getAvailableCredits(ctx);
  },
});

export const deleteUser = internalMutation({
  args: {
    externalUserId: v.string(),
  },
  handler: async (ctx, args) => {
    return await UserService.deleteUser(ctx, args);
  },
});

export const createOrUpdateUser = internalMutation({
  args: {
    externalUserId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await UserService.createOrUpdateUser(ctx, args);
  },
});

export const getByExternalUserId = internalQuery({
  args: {
    externalUserId: v.string(),
  },
  handler: async (ctx, args) => {
    return await UserService.getUserByExternalUserId(ctx, args);
  },
});

export const addCredits = internalMutation({
  args: {
    externalUserId: v.string(),
    stripeCheckoutSessionId: v.string(),
    stripeItemId: v.string(),
    creditsToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    return await UserService.addCredits(ctx, args);
  },
});
