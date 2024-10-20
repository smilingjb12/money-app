import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import {
  getCollectionImagesHandler,
  getImageHandler,
  uploadImageHandler,
} from "./handlers/images";

export const uploadImage = mutation({
  args: {
    title: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"images">> => {
    return await uploadImageHandler(ctx, args);
  },
});

export const getImage = query({
  args: {
    imageId: v.id("images"),
  },
  handler: async (ctx, args) => {
    return await getImageHandler(ctx, args.imageId);
  },
});

export const getCollectionImages = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await getCollectionImagesHandler(ctx, args);
  },
});
