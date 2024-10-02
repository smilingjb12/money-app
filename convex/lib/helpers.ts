import { ConvexError } from "convex/values";
import { settings } from "../../src/lib/settings";
import { QueryCtx } from "../_generated/server";
import { api } from "../_generated/api";
import { SessionId } from "convex-helpers/server/sessions";

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

export async function ensureHasCredits(
  ctx: QueryCtx & { sessionId: SessionId }
) {
  const currentUser = await ctx.runQuery(api.users.getCurrentUser, {
    sessionId: ctx.sessionId,
  });
  if (!currentUser || currentUser.credits <= 0) {
    throw new Error("Not enough credits to upload a file");
  }
}
