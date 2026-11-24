# أكاديمية هشام — النسخة المتطورة (Pro)

منصة **أكاديمية واحدة** عربية متطورة.

## المكدس

Next.js 16 · Drizzle · Neon · جلسات HttpOnly · واجهة RTL عربية

## التشغيل

```bash
cp .env.example .env
bun install
bun run db:push
DATABASE_URL=... bun run scripts/seed-admin.mjs
bun run dev
```

دخول افتراضي بعد البذر: `ADMIN-01` / `admin1234`

## ما تم تنفيذه

1. **إدارة المستخدمين** — `/admin/users`
2. **نشر الحصص** — `/teacher/sessions/new` (خاصة / جماعية)

## التالي

3. الحجز + إثبات الدفع  
4. الحضور  
