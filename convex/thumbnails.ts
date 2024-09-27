import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Define the interface for the thumbnail with URL properties
interface ThumbnailWithUrls extends Doc<"thumbnails"> {
  aImageUrl: string;
  bImageUrl: string;
}

export const createThumbnail = mutation({
  args: {
    title: v.string(),
    aImageId: v.string(),
    bImageId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }
    return await ctx.db.insert("thumbnails", {
      title: args.title,
      userId: user.subject,
      aImageId: args.aImageId,
      bImageId: args.bImageId,
      aVotes: 0,
      bVotes: 0,
      votedUserIds: [],
    });
  },
});

export const getThumbnail = query({
  args: {
    thumbnailId: v.id("thumbnails"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return null;
    }
    return await ctx.db.get(args.thumbnailId);
  },
});

export const getThumbnailsForUser = query({
  args: {},
  handler: async (ctx) => {
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
      throw new Error("Unauthorized");
    }
    const thumbnail = await ctx.db.get(args.thumbnailId);
    if (!thumbnail) {
      throw new Error("Thumbnail not found");
    }
    if (thumbnail.votedUserIds.includes(user.subject)) {
      throw new Error("User has already voted");
    }
    if (![thumbnail.aImageId, thumbnail.bImageId].includes(args.imageId)) {
      throw new Error("Given imageId doesn't exist");
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
