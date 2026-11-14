import { auth } from "@/lib/auth/server";
export default auth.middleware({
  loginUrl: "/auth/sign-in",
  publicRoutes: [
    "/",
    "/app",
    "/demo",
    "/api/demo",
    "/demo-poster.jpg",
    "/demo-captions.srt",
    "/api/extract",
    "/api/business",
    "/favicon.svg",
    "/og.png",
  ],
});
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
