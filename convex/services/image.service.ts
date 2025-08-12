import { MutationCtx } from "../_generated/server";

import { ConvexError } from "convex/values";
import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { ensureUploadSizeIsNotExceeded, requireAuthentication } from "../lib/helpers";
import { rateLimitActivity } from "../lib/rateLimits";
import { UserService } from "./user.service";

export const ImageService = {
  async getImage(ctx: QueryCtx, imageId: Id<"images">) {
    return await ctx.db.get(imageId);
  },

  async getCollectionImages(
    ctx: QueryCtx,
    args: {
      paginationOpts: {
        id?: number | undefined;
        endCursor?: string | null | undefined;
        maximumRowsRead?: number | undefined;
        maximumBytesRead?: number | undefined;
        numItems: number;
        cursor: string | null;
      };
    }
  ) {
    const userId = await requireAuthentication(ctx);
    const results = await ctx.db
      .query("images")
      .withIndex("uploader_user_id", (q) =>
        q.eq("uploaderUserId", userId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const pageResult = {
      ...results,
      page: await Promise.all(
        results.page.map(async (image) => ({
          ...image,
          imageUrl: await ctx.storage.getUrl(image.fileId as Id<"_storage">),
        }))
      ),
    };
    return pageResult;
  },

  async uploadImage(ctx: MutationCtx, args: { fileId: string; title: string }) {
    console.log("Creating poll with args:", args);
    const userId = await requireAuthentication(ctx);
    
    await rateLimitActivity(ctx, userId);
    await ensureUploadSizeIsNotExceeded(ctx, args.fileId);
    
    const currentCredits = await UserService.getAvailableCredits(ctx);
    if (currentCredits - 1 < 0) {
      throw new ConvexError("Not enough credits to create new test");
    }
    await UserService.decrementCredits(ctx);

    const imageId = await ctx.db.insert("images", {
      title: args.title,
      uploaderUserId: userId,
      fileId: args.fileId,
    });
    return imageId;
  },
};
