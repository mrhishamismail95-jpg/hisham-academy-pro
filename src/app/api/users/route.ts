import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAdmin } from "@/lib/api-auth";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const createSchema = z.object({
  role: z.enum(["admin", "teacher", "student"]),
  fullName: z.string().min(2, "الاسم قصير جداً"),
  phone: z.string().min(8, "رقم الجوال غير صالح"),
  email: z.string().email().optional().or(z.literal("")),
  code: z.string().min(2, "الكود مطلوب"),
  password: z.string().min(4, "كلمة المرور قصيرة"),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (!db) return NextResponse.json({ error: "قاعدة البيانات غير مُعدّة" }, { status: 503 });

  const rows = await db
    .select({
      id: schema.users.id,
      role: schema.users.role,
      fullName: schema.users.fullName,
      phone: schema.users.phone,
      email: schema.users.email,
      code: schema.users.code,
      isActive: schema.users.isActive,
      createdAt: schema.users.createdAt,
    })
    .from(schema.users)
    .orderBy(desc(schema.users.createdAt));

  return NextResponse.json({ users: rows });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  if (!db) return NextResponse.json({ error: "قاعدة البيانات غير مُعدّة" }, { status: 503 });

  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صالحة" },
        { status: 400 }
      );
    }
    const data = parsed.data;
    const passwordHash = await hashPassword(data.password);

    const inserted = await db
      .insert(schema.users)
      .values({
        role: data.role,
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        email: data.email?.trim() || null,
        code: data.code.trim().toUpperCase(),
        passwordHash,
      })
      .returning({
        id: schema.users.id,
        role: schema.users.role,
        fullName: schema.users.fullName,
        code: schema.users.code,
      });

    return NextResponse.json({ ok: true, user: inserted[0] }, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "الكود أو رقم الجوال مستخدم مسبقاً" }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "فشل إنشاء المستخدم" }, { status: 500 });
  }
}
