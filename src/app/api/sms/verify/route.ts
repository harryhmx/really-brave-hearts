import { NextResponse } from "next/server";
import { RBH_SKILLS_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${RBH_SKILLS_URL}/api/auth/sms/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({ message: "SMS service returned an invalid response" }));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json({ message: "SMS service timed out" }, { status: 504 });
    }
    return NextResponse.json({ message: "Network error" }, { status: 502 });
  }
}
