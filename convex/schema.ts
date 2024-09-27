import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  thumbnails: defineTable({
    title: v.string(),
    userId: v.string(),
    aImageId: v.string(),
    bImageId: v.string(),
    aVotes: v.number(),
    bVotes: v.number(),
    votedUserIds: v.array(v.string()),
  }),
});
