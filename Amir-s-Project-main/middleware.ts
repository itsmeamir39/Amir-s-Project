import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const protectedPrefixes = ["/admin", "/librarian", "/patron"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  if (!isProtected) return res;

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const { data: roleRecord } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = roleRecord?.role;
  if (pathname.startsWith("/admin") && role !== "Admin") return NextResponse.redirect(new URL("/login", req.url));
  if (pathname.startsWith("/librarian") && role !== "Librarian" && role !== "Admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname.startsWith("/patron") && !role) return NextResponse.redirect(new URL("/login", req.url));

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/librarian/:path*", "/patron/:path*"],
};
