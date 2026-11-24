import { neon } from "@neondatabase/serverless";
import { hash } from "bcryptjs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL required");
  process.exit(1);
}

const code = process.env.ADMIN_CODE || "ADMIN-01";
const password = process.env.ADMIN_PASSWORD || "admin1234";
const fullName = process.env.ADMIN_NAME || "مدير النظام";
const phone = process.env.ADMIN_PHONE || "0500000000";

const passwordHash = await hash(password, 12);
const sql = neon(url);

const existing = await sql`SELECT id FROM users WHERE code = ${code} LIMIT 1`;
if (existing.length) {
  console.log(`Admin already exists: code=${code}`);
  process.exit(0);
}

await sql`
  INSERT INTO users (role, full_name, phone, code, password_hash, is_active)
  VALUES ('admin', ${fullName}, ${phone}, ${code}, ${passwordHash}, true)
`;
console.log(`Created admin: code=${code} password=${password}`);
