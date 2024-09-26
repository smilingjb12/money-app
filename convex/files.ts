import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
// Remove unused import
// import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation({
  // Remove empty args object
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: {
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId);
  },
});
