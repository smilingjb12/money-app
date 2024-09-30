import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query } from "./_generated/server";
import { mutationWithSession } from "./lib/session";
import { internal } from "./_generated/api";
import { SessionId } from "convex-helpers/server/sessions";

type ThumbnailWithImageUrls = Doc<"thumbnails"> & {
  aImageUrl: string | null;
  bImageUrl: string | null;
};

async function createAnonymousUser(
  ctx: MutationCtx & { sessionId: SessionId }
): Promise<Id<"users">> {
  return await ctx.runMutation(internal.users.createUser, {
    userId: ctx.sessionId,
    email: "anonymous",
    isAnonymous: true,
    credits: Number(process.env.DEFAULT_CREDITS!),
  });
}

export const createThumbnail = mutationWithSession({
  args: {
    title: v.string(),
    aImageId: v.string(),
    bImageId: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"thumbnails">> => {
    console.log("Creating thumbnail with args:", args);
    const userIdentity = await ctx.auth.getUserIdentity();
    if (!userIdentity) {
      console.log("No user identity found, creating anonymous user");
      const anonUser = await createAnonymousUser(ctx);
      console.log("anonUser:", anonUser);
    }
    const userId = userIdentity?.subject ?? ctx.sessionId;
    const user = await ctx.runQuery(internal.users.getByUserId, {
      userId: userId,
    });
    console.log("Current user:", user);
    if (user!.credits - 1 < 0) {
      throw new ConvexError("Not enough credits to create new test");
    }
    await ctx.runMutation(internal.users.decrementCredits, {
      userId: user!.userId,
    });

    const thumbnailId = await ctx.db.insert("thumbnails", {
      title: args.title,
      userId: user!.userId,
      aImageId: args.aImageId,
      bImageId: args.bImageId,
      aVotes: 0,
      bVotes: 0,
      votedUserIds: [],
    });
    return thumbnailId;
  },
});

export const getThumbnail = query({
  args: {
    thumbnailId: v.id("thumbnails"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.thumbnailId);
  },
});

export const getRecentThumbnails = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("thumbnails")
      .order("desc")
      .paginate(args.paginationOpts);
    const result = await Promise.all(
      page.page.map(async (thumbnail) => ({
        ...thumbnail,
        aImageUrl: await ctx.storage.getUrl(
          thumbnail.aImageId as Id<"_storage">
        ),
        bImageUrl: await ctx.storage.getUrl(
          thumbnail.bImageId as Id<"_storage">
        ),
      }))
    );
    page.page = result;
    return page;
  },
});

export const getThumbnailsForUser = query({
  args: {},
  handler: async (ctx): Promise<Array<ThumbnailWithImageUrls> | undefined> => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return [];
    }

    const thumbnails = await ctx.db
      .query("thumbnails")
      .filter((q) => q.eq(q.field("userId"), user.subject))
      .collect();

    return Promise.all(
      thumbnails.map(async (thumbnail) => ({
        ...thumbnail,
        aImageUrl: await ctx.storage.getUrl(
          thumbnail.aImageId as Id<"_storage">
        ),
        bImageUrl: await ctx.storage.getUrl(
          thumbnail.bImageId as Id<"_storage">
        ),
      }))
    );
  },
});

export const voteOnThumbnail = mutation({
  args: {
    thumbnailId: v.id("thumbnails"),
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    const thumbnail = await ctx.db.get(args.thumbnailId);
    if (!thumbnail) {
      throw new ConvexError("Thumbnail not found");
    }
    if (thumbnail.votedUserIds.includes(user.subject)) {
      throw new ConvexError("User has already voted for this poll");
    }
    if (![thumbnail.aImageId, thumbnail.bImageId].includes(args.imageId)) {
      throw new ConvexError("Given imageId doesn't exist");
    }

    if (thumbnail.aImageId === args.imageId) {
      await ctx.db.patch(args.thumbnailId, {
        aVotes: thumbnail.aVotes + 1,
        votedUserIds: [...thumbnail.votedUserIds, user.subject],
      });
    } else {
      await ctx.db.patch(args.thumbnailId, {
        bVotes: thumbnail.bVotes + 1,
        votedUserIds: [...thumbnail.votedUserIds, user.subject],
      });
    }

    return thumbnail;
  },
});
