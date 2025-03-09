import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireAuthentication } from "./lib/helpers";
import { ImageService } from "./services/image.service";

export const uploadImage = mutation({
  args: {
    title: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"images">> => {
    await requireAuthentication(ctx);
    return await ImageService.uploadImage(ctx, args);
  },
});

export const getImage = query({
  args: {
    imageId: v.id("images"),
  },
  handler: async (ctx, args) => {
    return await ImageService.getImage(ctx, args.imageId);
  },
});

export const getCollectionImages = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAuthentication(ctx);
    return await ImageService.getCollectionImages(ctx, args);
  },
});
