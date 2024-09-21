import { auth } from "@/auth";
import { NextResponse } from "next/server";

const allowedPath = ["/", "/testlogin", "/Website%20page/Cheatsheet"];

export default auth((req) => {
    // if the url the user request to enter is protected, return to home page
    if (!req.auth && !allowedPath.includes(req.nextUrl.pathname)) {
        const newUrl = new URL("/api/auth/error?error=AccessDenied", req.nextUrl.origin);
        return NextResponse.redirect(newUrl);
    }
});

export const config = {
    matcher: "/((?!api|static|.*\\..*|_next).*)",
};
