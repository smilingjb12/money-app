import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { COLLECTION_SEGMENT } from "./lib/routes";

const isProtectedRoute = createRouteMatcher([`/${COLLECTION_SEGMENT}(.*)`]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
