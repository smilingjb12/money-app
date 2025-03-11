import { ConvexError } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";

export const UserService = {
  async createSignedInUser(
    ctx: MutationCtx,
    args: { userId: string; email: string }
  ) {
    return await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      credits: Number(convexEnv.DEFAULT_CREDITS),
      isAnonymous: false,
    });
  },

  async decrementCredits(ctx: MutationCtx, args: { userId: string }) {
    const user = await UserService.getUserById(ctx, { userId: args.userId });
    await ctx.db.patch(user!._id, {
      credits: user!.credits - 1,
    });
  },

  async getAvailableCredits(ctx: QueryCtx): Promise<number> {
    if (!(await ctx.auth.getUserIdentity())) {
      return Number(convexEnv.DEFAULT_CREDITS);
    }
    const user = await UserService.getCurrentUser(ctx);
    return user?.credits ?? Number(convexEnv.DEFAULT_CREDITS);
  },

  async getCurrentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
    const userIdentity = await ctx.auth.getUserIdentity();
    return await UserService.getUserById(ctx, {
      userId: userIdentity!.subject,
    });
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
    const user = await UserService.getUserById(ctx, { userId: args.userId });

    if (!user) {
      throw new ConvexError("No user found with userId = " + args.userId);
    }

    await ctx.db.insert("userPurchases", {
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      stripeItemId: args.stripeItemId,
      userId: args.userId,
    });
    await ctx.db.patch(user._id, {
      credits: user.credits + args.creditsToAdd,
    });
  },

  async getUserById(ctx: QueryCtx, args: { userId: string }) {
    const user = await ctx.db
      .query("users")
      .withIndex("user_id", (q) => q.eq("userId", args.userId))
      .first();

    return user;
  },
};
