import { NextResponse } from "next/server";
import { getSession, type SessionUser } from "@/lib/auth";

export async function requireSession(roles?: Array<SessionUser["role"]>) {
  const session = await getSession();
  if (!session) {
    return { session: null as SessionUser | null, error: NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 }) };
  }
  if (roles && roles.length > 0) {
    const ok = session.role === "admin" || roles.includes(session.role);
    if (!ok) {
      return { session, error: NextResponse.json({ error: "غير مصرح" }, { status: 403 }) };
    }
  }
  return { session, error: null as NextResponse | null };
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return { session: null, error: NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 }) };
  }
  if (session.role !== "admin") {
    return { session, error: NextResponse.json({ error: "للإداريين فقط" }, { status: 403 }) };
  }
  return { session, error: null };
}
