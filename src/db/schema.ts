import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("user_role", ["admin", "teacher", "student"]);
export const sessionTypeEnum = pgEnum("session_type", ["private", "group"]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending_payment",
  "payment_review",
  "confirmed",
  "cancelled",
  "rejected",
  "completed",
]);
export const attendanceEnum = pgEnum("attendance_status", [
  "not_marked",
  "present",
  "absent",
  "late",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "under_review",
  "approved",
  "rejected",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  role: roleEnum("role").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  code: text("code").notNull(),
  passwordHash: text("password_hash").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  uniqueIndex("users_phone_idx").on(t.phone),
  uniqueIndex("users_code_idx").on(t.code),
]);

export const bookableSessions = pgTable("bookable_sessions", {
  id: serial("id").primaryKey(),
  teacherId: integer("teacher_id").notNull().references(() => users.id),
  sessionType: sessionTypeEnum("session_type").notNull(),
  subject: text("subject").notNull(),
  grade: text("grade"),
  topic: text("topic").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  pricePerSeat: numeric("price_per_seat", { precision: 12, scale: 2 }).notNull(),
  capacity: integer("capacity").notNull(),
  reservedSeats: integer("reserved_seats").notNull().default(0),
  deliveryMode: text("delivery_mode").notNull().default("online"),
  meetingUrl: text("meeting_url"),
  location: text("location"),
  status: text("status").notNull().default("published"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => bookableSessions.id),
  bookedByStudentId: integer("booked_by_student_id").notNull().references(() => users.id),
  seatCount: integer("seat_count").notNull().default(1),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: bookingStatusEnum("status").notNull().default("pending_payment"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bookingStudents = pgTable("booking_students", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  sessionId: integer("session_id").notNull().references(() => bookableSessions.id),
  studentId: integer("student_id").notNull().references(() => users.id),
  seatPrice: numeric("seat_price", { precision: 12, scale: 2 }).notNull(),
  attendanceStatus: attendanceEnum("attendance_status").notNull().default("not_marked"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => [
  uniqueIndex("booking_students_session_student").on(t.sessionId, t.studentId),
]);

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: text("method").notNull().default("bank_transfer"),
  reference: text("reference"),
  proofUrl: text("proof_url"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  reviewedByTeacherId: integer("reviewed_by_teacher_id").references(() => users.id),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  reviewNote: text("review_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const academySettings = pgTable("academy_settings", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull().default("أكاديمية هشام"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  address: text("address"),
  paymentInstructions: text("payment_instructions"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
