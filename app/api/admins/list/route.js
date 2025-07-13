// /app/api/admins/list/route.js
import { NextResponse } from "next/server";

export async function GET() {
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
  return NextResponse.json(adminEmails);
}
