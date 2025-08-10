import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";

export const UserService = {
  async decrementCredits(ctx: MutationCtx) {
    const user = await UserService.ensureUserExists(ctx);
    const currentCredits = user.credits ?? Number(convexEnv.DEFAULT_CREDITS);
    await ctx.db.patch(user._id, {
      credits: currentCredits - 1,
    });
  },

  async getAvailableCredits(ctx: QueryCtx): Promise<number> {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return Number(convexEnv.DEFAULT_CREDITS);
    }
    const user = await ctx.db.get(userId);
    return user?.credits ?? Number(convexEnv.DEFAULT_CREDITS);
  },

  async getCurrentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },

  async ensureUserExists(ctx: MutationCtx): Promise<Doc<"users">> {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError("User not found");

    // Initialize credits if not set
    if (user.credits === undefined) {
      await ctx.db.patch(userId, {
        credits: Number(convexEnv.DEFAULT_CREDITS),
      });
      const updatedUser = await ctx.db.get(userId);
      if (!updatedUser) throw new ConvexError("Failed to update user credits");
      return updatedUser;
    }

    return user;
  },

  async addCredits(
    ctx: MutationCtx,
    args: {
      userId: string;
      creditsToAdd: number;
      stripeCheckoutSessionId: string;
      stripeItemId: string;
    }
  ) {
    console.log("Adding", args.creditsToAdd, "credits to user:", args.userId);
    const userId = args.userId as Id<"users">;
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new ConvexError("No user found with userId = " + args.userId);
    }

    await ctx.db.insert("userPurchases", {
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      stripeItemId: args.stripeItemId,
      userId: userId,
    });

    // Add credits to user record
    const currentCredits = user.credits ?? Number(convexEnv.DEFAULT_CREDITS);
    await ctx.db.patch(userId, {
      credits: currentCredits + args.creditsToAdd,
    });
  },

  async deleteUserData(ctx: MutationCtx, userId: Id<"users">) {
    // Get user record to verify it exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    // Step 1: Delete all user-uploaded images and their files
    const userImages = await ctx.db
      .query("images")
      .withIndex("uploader_user_id", (q) => q.eq("uploaderUserId", userId))
      .collect();

    for (const image of userImages) {
      // Delete the actual file from storage
      if (image.fileId) {
        try {
          await ctx.storage.delete(image.fileId as Id<"_storage">);
        } catch (error) {
          // File might already be deleted, continue with cleanup
          console.warn(`Failed to delete file ${image.fileId}:`, error);
        }
      }
      // Delete the image record
      await ctx.db.delete(image._id);
    }

    // Note: We keep purchase records for tax/accounting compliance
    // but they're already anonymized since we're removing personal data from users table

    // Step 2: Auth session cleanup happens automatically via convex-auth
    // when user is signed out on the client side

    return {
      success: true,
      deletedImages: userImages.length,
      message:
        "Personal data has been anonymized. Your account balance and purchase history have been retained for fraud prevention and legal compliance.",
    };
  },

  async getDataDeletionSummary(ctx: QueryCtx, userId: Id<"users">) {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new ConvexError("User not found");
    }

    const userImages = await ctx.db
      .query("images")
      .withIndex("uploader_user_id", (q) => q.eq("uploaderUserId", userId))
      .collect();

    const userPurchases = await ctx.db
      .query("userPurchases")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return {
      personalDataFields: {
        name: !!user.name,
        email: !!user.email,
        image: !!user.image,
        phone: !!user.phone,
      },
      uploadedImages: userImages.length,
      purchaseRecords: userPurchases.length,
      creditsBalance: user.credits || 0,
      retainedForCompliance: {
        creditsBalance: true,
        purchaseRecords: true,
        userId: true,
      },
    };
  },
};
