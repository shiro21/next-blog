import { NextRequest, NextResponse } from "next/server"

export const middleware = (req: NextRequest) => {
    if (req.nextUrl.pathname.startsWith("/")) {

        return NextResponse.next();
    }
}