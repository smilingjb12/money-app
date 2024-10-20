import { ConvexError } from "convex/values";
import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import {
  ensureUploadSizeIsNotExceeded,
  requireAuthentication,
} from "../lib/helpers";
import { rateLimitActivity } from "../lib/rateLimits";
import { PaginationResult } from "convex/server";

export const getImageHandler = async (ctx: QueryCtx, imageId: Id<"images">) => {
  return await ctx.db.get(imageId);
};

export const getCollectionImagesHandler = async (
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
): Promise<
  PaginationResult<{
    _id: Id<"images">;
    _creationTime: number;
    title: string;
    uploaderUserId: string;
    fileId: string;
    imageUrl: string;
  }>
> => {
  await requireAuthentication(ctx);
  const userIdentity = await ctx.auth.getUserIdentity();
  const page = await ctx.db
    .query("images")
    .withIndex("uploader_user_id", (q) =>
      q.eq("uploaderUserId", userIdentity!.subject)
    )
    .order("desc")
    .paginate(args.paginationOpts);
  const result = await Promise.all(
    page.page.map(async (poll) => ({
      ...poll,
      imageUrl: await ctx.storage.getUrl(poll.fileId as Id<"_storage">),
    }))
  );
  page.page = result;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return page as any;
};

export const uploadImageHandler = async (
  ctx: MutationCtx,
  args: { fileId: string; title: string }
) => {
  console.log("Creating poll with args:", args);
  const userIdentity = await requireAuthentication(ctx);
  await rateLimitActivity(ctx, userIdentity.subject);
  await ensureUploadSizeIsNotExceeded(ctx, args.fileId);
  const userId = userIdentity!.subject;
  const user = await ctx.runQuery(internal.users.getByUserId, {
    userId: userId,
  });
  if (user!.credits - 1 < 0) {
    throw new ConvexError("Not enough credits to create new test");
  }
  await ctx.runMutation(internal.users.decrementCredits, {
    userId: user!.userId,
  });

  const imageId = await ctx.db.insert("images", {
    title: args.title,
    uploaderUserId: user!.userId,
    fileId: args.fileId,
  });
  return imageId;
};
