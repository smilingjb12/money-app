import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

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
    });
  },
});

export const getThumbnailsForUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return [];
    }
    return await ctx.db
      .query("thumbnails")
      .filter((q) => q.eq(q.field("userId"), user.subject))
      .collect();
  },
});
