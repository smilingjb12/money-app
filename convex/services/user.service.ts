import { ConvexError } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { convexEnv } from "../lib/convexEnv";

export const UserService = {
  async deleteUser(ctx: MutationCtx, args: { externalUserId: string }) {
    const user = await UserService.getUserByExternalUserId(ctx, {
      externalUserId: args.externalUserId,
    });
    if (!user) {
      return;
    }
    return await ctx.db.delete(user._id);
  },

  async createOrUpdateUser(
    ctx: MutationCtx,
    args: { externalUserId: string; email: string }
  ) {
    const user = await UserService.getUserByExternalUserId(ctx, {
      externalUserId: args.externalUserId,
    });
    if (user) {
      return await ctx.db.patch(user._id, {
        email: args.email,
      });
    }
    return await ctx.db.insert("users", {
      externalUserId: args.externalUserId,
      email: args.email,
      credits: Number(convexEnv.DEFAULT_CREDITS),
    });
  },

  async decrementCredits(ctx: MutationCtx, args: { externalUserId: string }) {
    const user = await UserService.getUserByExternalUserId(ctx, {
      externalUserId: args.externalUserId,
    });
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
    return await UserService.getUserByExternalUserId(ctx, {
      externalUserId: userIdentity!.subject,
    });
  },

  async addCredits(
    ctx: MutationCtx,
    args: {
      externalUserId: string;
      creditsToAdd: number;
      stripeCheckoutSessionId: string;
      stripeItemId: string;
    }
  ) {
    console.log(
      "Adding",
      args.creditsToAdd,
      "credits to user:",
      args.externalUserId
    );
    const user = await UserService.getUserByExternalUserId(ctx, {
      externalUserId: args.externalUserId,
    });

    if (!user) {
      throw new ConvexError(
        "No user found with externalUserId = " + args.externalUserId
      );
    }

    await ctx.db.insert("userPurchases", {
      stripeCheckoutSessionId: args.stripeCheckoutSessionId,
      stripeItemId: args.stripeItemId,
      externalUserId: args.externalUserId,
    });
    await ctx.db.patch(user._id, {
      credits: user.credits + args.creditsToAdd,
    });
  },

  async getUserByExternalUserId(
    ctx: QueryCtx,
    args: { externalUserId: string }
  ) {
    const user = await ctx.db
      .query("users")
      .withIndex("external_user_id", (q) =>
        q.eq("externalUserId", args.externalUserId)
      )
      .first();

    return user;
  },
};
