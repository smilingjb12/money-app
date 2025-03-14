import { rateLimitTables } from "convex-helpers/server/rateLimit";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...rateLimitTables,
  images: defineTable({
    title: v.string(),
    uploaderUserId: v.string(),
    fileId: v.string(),
  }).index("uploader_user_id", ["uploaderUserId"]),
  userPurchases: defineTable({
    externalUserId: v.string(),
    stripeItemId: v.string(),
    stripeCheckoutSessionId: v.string(),
  }),
  users: defineTable({
    externalUserId: v.string(),
    email: v.string(),
    credits: v.number(),
  }).index("external_user_id", ["externalUserId"]),
});
