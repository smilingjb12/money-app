import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { rateLimitTables } from "convex-helpers/server/rateLimit";

export default defineSchema({
  ...rateLimitTables,
  images: defineTable({
    title: v.string(),
    uploaderUserId: v.string(),
    fileId: v.string(),
  }).index("uploader_user_id", ["uploaderUserId"]),
  userPurchases: defineTable({
    userId: v.string(),
    stripeItemId: v.string(),
    stripeCheckoutSessionId: v.string(),
  }),
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    credits: v.number(),
    isAnonymous: v.boolean(),
  }).index("user_id", ["userId"]),
});
