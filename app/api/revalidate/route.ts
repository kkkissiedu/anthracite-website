import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-sanity-webhook-secret");
  const expected = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret || !expected || !safeCompare(secret, expected)) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    revalidatePath('/');
    revalidatePath('/work/architectural-structural');
    revalidatePath('/work/sculptor');
    revalidatePath('/services/real-estate');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
