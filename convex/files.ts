import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { ensureHasPositiveCredits, requireAuthentication } from "./lib/helpers";
import { FileService } from "./services/file.service";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    await requireAuthentication(ctx);
    await ensureHasPositiveCredits(ctx);
    return await FileService.generateUploadUrl(ctx);
  },
});

export const getFileUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await FileService.getFileUrl(ctx, args);
  },
});

export const cleanupFileStorage = internalMutation({
  args: {},
  handler: async (ctx): Promise<void> => {
    await FileService.cleanupFileStorage(ctx);
  },
});
