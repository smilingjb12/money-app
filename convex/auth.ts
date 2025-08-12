import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { convexEnv } from "./lib/convexEnv";
import { Doc } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId }) {
      const user = await ctx.db.get(userId) as Doc<"users"> | null;
      if (!user) return;

      // Set default role and credits for new users
      const updates: Partial<Pick<Doc<"users">, "role" | "credits">> = {};
      if (!user.role) {
        updates.role = "user" as const;
      }
      if (user.credits === undefined) {
        updates.credits = Number(convexEnv.DEFAULT_CREDITS);
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(userId, updates);
      }
    },
  },
});
