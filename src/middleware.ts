import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import CookiesService from "./lib/cookies";

export const config = {
    matcher: '/((?!_next/static|_next/iamge|favicon.ico).*)',
};

const publicRoutes = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
];

export async function middleware(req: NextRequest){
    const pathname = req.nextUrl.pathname;
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    const sessionCookie = await CookiesService.getAuthToken();
    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
    }
    return NextResponse.next();
}