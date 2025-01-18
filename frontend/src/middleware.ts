import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 避免無限循環的標記
  const hasRedirected = request.headers.get("x-redirected");
  if (hasRedirected) {
    return NextResponse.next();
  }

  const path = request.nextUrl.pathname;
  const token = request.cookies.get("auth_token")?.value;

  // 如果是訪問登入或註冊頁面且已登入
  if ((path === "/login" || path === "/register") && token) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    response.headers.set("x-redirected", "1");
    return response;
  }

  // 如果是訪問需要認證的頁面且未登入
  if (path.startsWith("/dashboard") && !token) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.headers.set("x-redirected", "1");
    return response;
  }

  return NextResponse.next();
}

// 確保只對特定路徑執行 middleware
export const config = {
  matcher: ["/login", "/register", "/dashboard", "/dashboard/:path*"],
};
