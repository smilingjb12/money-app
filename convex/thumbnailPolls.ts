import { SessionId } from "convex-helpers/server/sessions";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query } from "./_generated/server";
import { mutationWithSession } from "./lib/session";

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

export const createThumbnailPoll = mutationWithSession({
  args: {
    title: v.string(),
    aImageId: v.string(),
    bImageId: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"thumbnailPolls">> => {
    console.log("Creating poll with args:", args);
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

    const pollId = await ctx.db.insert("thumbnailPolls", {
      title: args.title,
      userId: user!.userId,
      aImageId: args.aImageId,
      bImageId: args.bImageId,
      aVotes: 0,
      bVotes: 0,
      votedUserIds: [],
    });
    return pollId;
  },
});

export const getThumbnailPoll = query({
  args: {
    thumbnailPollId: v.id("thumbnailPolls"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.thumbnailPollId);
  },
});

export const getRecentThumbnailPolls = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("thumbnailPolls")
      .order("desc")
      .paginate(args.paginationOpts);
    const result = await Promise.all(
      page.page.map(async (poll) => ({
        ...poll,
        aImageUrl: await ctx.storage.getUrl(poll.aImageId as Id<"_storage">),
        bImageUrl: await ctx.storage.getUrl(poll.bImageId as Id<"_storage">),
      }))
    );
    page.page = result;
    return page;
  },
});

export const voteOnThumbnailPoll = mutation({
  args: {
    thumbnailPollId: v.id("thumbnailPolls"),
    imageId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    const poll = await ctx.db.get(args.thumbnailPollId);
    if (!poll) {
      throw new ConvexError("Poll not found");
    }
    if (poll.votedUserIds.includes(user.subject)) {
      throw new ConvexError("You have already voted for this poll");
    }
    if (![poll.aImageId, poll.bImageId].includes(args.imageId)) {
      throw new ConvexError("Given imageId doesn't exist");
    }

    if (poll.aImageId === args.imageId) {
      await ctx.db.patch(args.thumbnailPollId, {
        aVotes: poll.aVotes + 1,
        votedUserIds: [...poll.votedUserIds, user.subject],
      });
    } else {
      await ctx.db.patch(args.thumbnailPollId, {
        bVotes: poll.bVotes + 1,
        votedUserIds: [...poll.votedUserIds, user.subject],
      });
    }

    return poll;
  },
});
