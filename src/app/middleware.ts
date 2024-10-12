import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;
  console.log("$$$ middleware working $$$");

  if (!token) {
    return NextResponse.json({ message: "No session found", status: 401 });
  }

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.json({ message: "Session Expired", status: 401 });
  }
}

export const config = {
  matcher: ["/api/protected"],
};
