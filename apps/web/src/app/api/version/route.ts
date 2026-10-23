import { NextResponse } from "next/server";
import { APP_VERSION, MIN_SUPPORTED_VERSION, BUILD_CHANNEL } from "@quran/contracts";

export async function GET(request: Request) {
  const versionInfo = {
    version: APP_VERSION,
    minSupportedVersion: MIN_SUPPORTED_VERSION,
    buildTime: new Date().toISOString(),
    channel: BUILD_CHANNEL,
    commitHash: process.env.VERCEL_GIT_COMMIT_SHA || "fb45c24",
    serverTimestamp: Date.now(),
  };

  return NextResponse.json(versionInfo, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
