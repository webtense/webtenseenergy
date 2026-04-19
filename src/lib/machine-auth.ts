import { NextResponse } from "next/server";

export function hasValidCronBearer(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export function unauthorizedMachineResponse() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
