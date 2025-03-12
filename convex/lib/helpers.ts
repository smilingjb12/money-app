import { UserIdentity } from "convex/server";
import { ConvexError } from "convex/values";
import { QueryCtx } from "../_generated/server";
import { UserService } from "../services/user.service";
import { convexEnv } from "./convexEnv";

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
  fileId: string
) {
  const uploadedFiles = await ctx.db.system
    .query("_storage")
    .filter((q) => q.eq(q.field("_id"), fileId))
    .collect();

  if (
    uploadedFiles.some(
      (f) => f.size > Number(convexEnv.NEXT_PUBLIC_UPLOAD_SIZE_LIMIT)
    )
  ) {
    throw new ConvexError("Upload size exceeded");
  }
}

export async function ensureHasPositiveCredits(ctx: QueryCtx) {
  const currentUser = await UserService.getCurrentUser(ctx);
  console.log("currentUser", currentUser);
  if (currentUser!.credits <= 0) {
    throw new Error("Not enough credits to perform the action");
  }
}
