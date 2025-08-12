import { ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id, Doc } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { UserService } from "../services/user.service";
import { convexEnv } from "./convexEnv";

export type UserRole = NonNullable<Doc<"users">["role"]>;

export function getUserRole(user: Doc<"users">): UserRole {
  return user.role ?? "user";
}


export async function requireAuthentication(
  ctx: QueryCtx,
  requiredRole: UserRole = "user"
): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError("Unauthorized");
  }

  if (requiredRole === "admin") {
    const user = await ctx.db.get(userId);
    if (!user || getUserRole(user) !== "admin") {
      throw new ConvexError("Insufficient permissions - admin access required");
    }
  }

  return userId;
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
  const credits = await UserService.getAvailableCredits(ctx);
  console.log("available credits", credits);
  if (credits <= 0) {
    throw new Error("Not enough credits to perform the action");
  }
}
