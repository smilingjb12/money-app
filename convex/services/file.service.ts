import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";

export const FileService = {
  async getFileUrl(ctx: QueryCtx, args: { fileId: Id<"_storage"> }) {
    return await ctx.storage.getUrl(args.fileId);
  },

  async generateUploadUrl(ctx: MutationCtx) {
    return await ctx.storage.generateUploadUrl();
  },

  async cleanupFileStorage(ctx: MutationCtx) {
    await deduplicateFilesByHashHandler(ctx);
    await removeTemporaryFilesHandler(ctx);
  },
};

async function deduplicateFilesByHashHandler(ctx: MutationCtx) {
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

  const images = await ctx.db.query("images").collect();
  for (const image of images) {
    const file = allFiles.find((f) => f._id === image.fileId);
    const fileId = uniqueFileHashes.find(
      (i) => i.sha256 === file!.sha256
    )!.fileId;
    await ctx.db.patch(image._id, { fileId: fileId });
  }
}

async function removeTemporaryFilesHandler(ctx: MutationCtx) {
  const images = await ctx.db.query("images").collect();
  const usedFileIds = [
    ...new Set(images.map((image) => image.fileId as Id<"_storage">)),
  ];

  const allFiles = await ctx.db.system.query("_storage").collect();
  const unusedFiles = allFiles.filter(
    (file) => !usedFileIds.includes(file._id)
  );

  for (const file of unusedFiles) {
    await ctx.storage.delete(file._id);
  }
  console.log("Deleted", unusedFiles.length, "unused files.");
}
