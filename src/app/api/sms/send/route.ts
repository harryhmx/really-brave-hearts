import { NextResponse } from "next/server";
import { RBH_SKILLS_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${RBH_SKILLS_URL}/api/auth/sms/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: "Network error" }, { status: 502 });
  }
}
