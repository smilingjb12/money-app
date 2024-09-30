import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
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

// TODO: use sha256 to reassign thumbnail file ids
// export const deduplicateFiles = internalMutation({
// });

export const removeTemporaryFiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const thumbnails = await ctx.db.query("thumbnails").collect();
    const usedImageIds = new Set(
      thumbnails.flatMap((thumbnail) => [
        thumbnail.aImageId,
        thumbnail.bImageId,
      ])
    );

    const allFiles = await ctx.db.system.query("_storage").collect();
    const unusedFiles = allFiles.filter((file) => !usedImageIds.has(file._id));

    for (const file of unusedFiles) {
      await ctx.storage.delete(file._id);
    }

    return `Deleted ${unusedFiles.length} unused files.`;
  },
});
