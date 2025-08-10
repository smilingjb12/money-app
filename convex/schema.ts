import { authTables } from "@convex-dev/auth/server";
import { rateLimitTables } from "convex-helpers/server/rateLimit";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  ...rateLimitTables,
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    credits: v.optional(v.number()),
  }).index("email", ["email"]),
  images: defineTable({
    title: v.string(),
    uploaderUserId: v.id("users"),
    fileId: v.string(),
  }).index("uploader_user_id", ["uploaderUserId"]),
  userPurchases: defineTable({
    userId: v.id("users"),
    stripeItemId: v.string(),
    stripeCheckoutSessionId: v.string(),
  }),
});
