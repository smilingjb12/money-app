import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // In a client-side only architecture with Convex Auth, we can't easily check
  // authentication status in middleware. Instead, we'll rely on the pages themselves
  // to handle auth state and redirect if needed.
  //
  // For now, we'll let all requests through and handle authentication at the component level.
  // This prevents the middleware from blocking legitimate authenticated users.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
