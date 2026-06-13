import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Middleware triggered for path:", request.nextUrl.pathname);

  // Check if accessing dashboard routes
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  console.log("Is dashboard route:", isDashboardRoute);

  if (isDashboardRoute) {
    // According to project specifications, we need to check for Supabase auth cookies
    // Supabase auth cookies are named in the format: sb-[project-id]-auth-token
    // But they might also be stored as access-token, refresh-token, etc.

    // Get all cookies
    const cookies = request.cookies.getAll();
    console.log(
      "All cookies:",
      cookies.map((c) => c.name),
    );

    // Look for any Supabase auth-related cookies
    // Supabase typically sets cookies with names like:
    // - sb-[project-ref]-auth-token
    // - sb-[project-ref]-auth-refresh-token
    // - sb-[project-ref]-auth-provider-token
    const supabaseAuthCookieExists = cookies.some(
      (cookie) =>
        cookie.name.includes("sb-") &&
        (cookie.name.includes("-auth-token") ||
          cookie.name.includes("-auth-refresh-token") ||
          cookie.name.includes("-auth-access-token") ||
          cookie.name.includes("-auth-provider-token")),
    );

    console.log(
      "Found Supabase auth-related cookie:",
      supabaseAuthCookieExists,
    );

    // As an alternative, also check for generic auth tokens
    const genericAuthTokens = cookies.filter(
      (cookie) =>
        cookie.name.includes("access-token") ||
        cookie.name.includes("refresh-token") ||
        cookie.name.includes("sb-access-token") ||
        cookie.name.includes("sb-refresh-token"),
    );

    console.log("Found generic auth tokens:", genericAuthTokens);

    const hasValidSession =
      supabaseAuthCookieExists || genericAuthTokens.length > 0;
    console.log("Has valid session:", hasValidSession);

    if (!hasValidSession) {
      console.log("No valid session, redirecting to login");
      // Redirect to login if no valid session cookies are found
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?redirect=${encodeURIComponent(request.nextUrl.pathname)}`;
      return NextResponse.redirect(url);
    } else {
      console.log("Valid session found, allowing access");
    }
  }

  console.log("Allowing request to continue");
  return NextResponse.next();
}

// Define which paths the middleware should run on
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
