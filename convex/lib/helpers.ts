import { UserIdentity } from "convex/server";
import { ConvexError } from "convex/values";
import { settings } from "../../src/lib/settings";
import { api } from "../_generated/api";
import { QueryCtx } from "../_generated/server";

export async function requireAuthentication(
  ctx: QueryCtx
): Promise<UserIdentity> {
  const userIdentity = await ctx.auth.getUserIdentity();
  if (!userIdentity) {
    throw new ConvexError("Unauthorized");
  }

  return userIdentity;
}

export async function ensureUploadSizeIsNotExceeded(
  ctx: QueryCtx,
  aImageId: string,
  bImageId: string
) {
  const uploadedFiles = await ctx.db.system
    .query("_storage")
    .filter((q) =>
      q.or(q.eq(q.field("_id"), aImageId), q.eq(q.field("_id"), bImageId))
    )
    .collect();

  if (uploadedFiles.some((f) => f.size > settings.getUploadSizeLimit())) {
    throw new ConvexError("Upload size exceeded");
  }
}

export async function ensureHasPositiveCredits(ctx: QueryCtx) {
  const currentUser = await ctx.runQuery(api.users.getCurrentUser, {});
  if (!currentUser || currentUser.credits <= 0) {
    throw new Error("Not enough credits to perform the action");
  }
}
