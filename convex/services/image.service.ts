import { MutationCtx } from "../_generated/server";

import { ConvexError } from "convex/values";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { ensureUploadSizeIsNotExceeded } from "../lib/helpers";
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
    const userIdentity = await ctx.auth.getUserIdentity();
    const results = await ctx.db
      .query("images")
      .withIndex("uploader_user_id", (q) =>
        q.eq("uploaderUserId", userIdentity!.subject)
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
    const userIdentity = await ctx.auth.getUserIdentity();
    await rateLimitActivity(ctx, userIdentity!.subject);
    await ensureUploadSizeIsNotExceeded(ctx, args.fileId);
    const userId = userIdentity!.subject;
    const user = await ctx.runQuery(internal.users.getByUserId, {
      userId: userId,
    });
    if (user!.credits - 1 < 0) {
      throw new ConvexError("Not enough credits to create new test");
    }
    await UserService.decrementCredits(ctx, { userId: user!.userId });

    const imageId = await ctx.db.insert("images", {
      title: args.title,
      uploaderUserId: user!.userId,
      fileId: args.fileId,
    });
    return imageId;
  },
};
