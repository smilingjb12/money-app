import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireAuthentication } from "./lib/helpers";
import { UserService } from "./services/user.service";
import { Doc } from "./_generated/dataModel";

/**
 * GDPR Article 17 - Right to Erasure Implementation
 *
 * This mutation anonymizes user data while retaining necessary records
 * for fraud prevention and legal compliance.
 *
 * What gets deleted:
 * - Personal identifiers (name, email, image, phone)
 * - Verification timestamps
 * - User-uploaded images and files
 * - Authentication session data (handled by convex-auth)
 *
 * What gets retained (legitimate interest):
 * - User ID (as anonymized reference)
 * - Credits balance (fraud prevention)
 * - Purchase records (tax/accounting compliance, but anonymized)
 * - Rate limiting data (abuse prevention)
 */

export const deleteUserData = mutation({
  args: {},
  handler: async (
    ctx
  ): Promise<{
    success: boolean;
    deletedImages: number;
    message: string;
  }> => {
    const userId = await requireAuthentication(ctx);
    return await UserService.deleteUserData(ctx, userId);
  },
});

/**
 * Get summary of what data would be deleted (for user confirmation)
 */
export const getDataDeletionSummary = query({
  args: {},
  handler: async (
    ctx
  ): Promise<{
    personalDataFields: {
      name: boolean;
      email: boolean;
      image: boolean;
      phone: boolean;
    };
    uploadedImages: number;
    purchaseRecords: number;
    creditsBalance: number;
    retainedForCompliance: {
      creditsBalance: boolean;
      purchaseRecords: boolean;
      userId: boolean;
    };
  }> => {
    const userId = await requireAuthentication(ctx);
    return await UserService.getDataDeletionSummary(ctx, userId);
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    return await UserService.getCurrentUser(ctx);
  },
});

export const getAvailableCredits = query({
  args: {},
  handler: async (ctx): Promise<number> => {
    // [AllowAnonymous]
    return await UserService.getAvailableCredits(ctx);
  },
});

export const _addCredits = internalMutation({
  args: {
    userId: v.string(),
    creditsToAdd: v.number(),
    stripeCheckoutSessionId: v.string(),
    stripeItemId: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    return await UserService.addCredits(ctx, args);
  },
});
