# أكاديمية هشام — النسخة المتطورة (Pro)

منصة **أكاديمية واحدة** عربية متطورة لإدارة الطلاب والمعلمين والحجوزات والمدفوعات والحضور.

## المكدس

- **Next.js 16** (App Router) + TypeScript + Tailwind
- **Drizzle ORM** + PostgreSQL (Neon)
- جلسات موقّعة (HttpOnly cookie)
- واجهة **RTL عربية**

## التشغيل المحلي

```bash
cp .env.example .env
# عدّل DATABASE_URL و SESSION_SECRET

bun install
bun run db:push   # إنشاء الجداول على Neon
bun run dev
```

افتح: http://localhost:3000

## الوحدات المخططة

1. تسجيل دخول بالأكواد (إداري / معلم / طالب)
2. نشر حصص (خاصة / جماعية) من المعلم
3. حجز + إثبات دفع + موافقة المعلم
4. حضور المشاركين
5. لوحة إدارة وتقارير

## API جاهز

- `GET /api/health`
- `POST /api/auth/login`

## النشر

مناسب لـ **Vercel** مباشرة.
