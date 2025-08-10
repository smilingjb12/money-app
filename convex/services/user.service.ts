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
    console.log(
      "Adding",
      args.creditsToAdd,
      "credits to user:",
      args.userId
    );
    const userId = args.userId as Id<"users">;
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new ConvexError(
        "No user found with userId = " + args.userId
      );
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
};
