import { NextRequest, NextResponse } from "next/server";
import { TransactionalEmailSchema } from "@quran/contracts";
import { getEmailService } from "@quran/adapters";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = TransactionalEmailSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid email payload",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const emailService = getEmailService();
    const result = await emailService.send(parseResult.data);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "Failed to dispatch email",
          mode: result.mode,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: result.id,
      mode: result.mode,
      recipient: parseResult.data.to,
      type: parseResult.data.type,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Email API Exception]", message);
    return NextResponse.json(
      { error: "Internal server error", message },
      { status: 500 }
    );
  }
}
