import { SessionIdArg } from "convex-helpers/server/sessions";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, query } from "./_generated/server";
import { mutationWithSession } from "./lib/session";

export const generateUploadUrl = mutationWithSession({
  args: SessionIdArg,
  handler: async (ctx) => {
    // todo: limit uploads for anonymous users
    // const currentUser = await ctx.runQuery(api.users.getCurrentUser, {
    //   sessionId: ctx.sessionId,
    // });
    // console.log("currentUser:", currentUser);
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

export const cleanupFileStorage = internalMutation({
  args: {},
  handler: async (ctx): Promise<string> => {
    await ctx.runMutation(internal.files.deduplicateFilesByHash, {});
    return await ctx.runMutation(internal.files.removeTemporaryFiles, {});
  },
});

export const deduplicateFilesByHash = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allFiles = await ctx.db.system.query("_storage").collect();
    const uniqueFileHashes: Array<{ sha256: string; fileId: string }> = [];
    for (const file of allFiles) {
      if (uniqueFileHashes.some((h) => h.sha256 === file.sha256)) {
        continue;
      }
      uniqueFileHashes.push({ sha256: file.sha256, fileId: file._id });
    }
    console.log("unique hashes count:", uniqueFileHashes.length);
    console.log("all files count:", allFiles.length);

    const polls = await ctx.db.query("thumbnailPolls").collect();
    for (const poll of polls) {
      const fileA = allFiles.find((f) => f._id === poll.aImageId);
      const fileB = allFiles.find((f) => f._id === poll.bImageId);
      const aImageId = uniqueFileHashes.find(
        (i) => i.sha256 === fileA!.sha256
      )!.fileId;
      const bImageId = uniqueFileHashes.find(
        (i) => i.sha256 === fileB!.sha256
      )!.fileId;
      await ctx.db.patch(poll._id, { aImageId, bImageId });
    }
  },
});

export const removeTemporaryFiles = internalMutation({
  args: {},
  handler: async (ctx) => {
    const polls = await ctx.db.query("thumbnailPolls").collect();
    const usedImageIds = new Set(
      polls.flatMap((poll) => [poll.aImageId, poll.bImageId])
    );

    const allFiles = await ctx.db.system.query("_storage").collect();
    const unusedFiles = allFiles.filter((file) => !usedImageIds.has(file._id));

    for (const file of unusedFiles) {
      await ctx.storage.delete(file._id);
    }

    return `Deleted ${unusedFiles.length} unused files.`;
  },
});
