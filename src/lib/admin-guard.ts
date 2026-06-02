import { NextResponse } from "next/server";
import { isAuthenticated } from "./auth";

// Возвращает NextResponse(401), если запрос не авторизован, иначе null.
export async function guard(): Promise<NextResponse | null> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}
