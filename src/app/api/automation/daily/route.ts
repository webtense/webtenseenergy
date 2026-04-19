import { NextResponse } from "next/server";
import { hasValidCronBearer, unauthorizedMachineResponse } from "@/lib/machine-auth";
import { runDailyAutomation } from "@/server/services/automation-daily";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!hasValidCronBearer(request)) {
    return unauthorizedMachineResponse();
  }

  try {
    const body = (await request.json().catch(() => ({}))) as { dryRun?: boolean; forceNewsletter?: boolean };
    const summary = await runDailyAutomation({
      dryRun: body.dryRun,
      forceNewsletter: body.forceNewsletter,
    });
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error running daily automation:", error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Automation failed" },
      { status: 500 },
    );
  }
}
