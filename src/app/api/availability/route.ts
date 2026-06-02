import { NextResponse } from "next/server";
import { getDisabledDayKeys } from "@/lib/bookings";

export const dynamic = "force-dynamic";

// Возвращает занятые (недоступные) дни для календаря.
export async function GET() {
  try {
    const disabled = await getDisabledDayKeys();
    return NextResponse.json(
      { disabled },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    console.error("availability error", e);
    return NextResponse.json({ disabled: [] }, { status: 500 });
  }
}
