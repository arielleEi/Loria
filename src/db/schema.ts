import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["free", "pro"]);
export const toolEnum = pgEnum("tool_type", [
  "pdf_summary",
  "cv_generator",
  "text_corrector",
]);
export const statusEnum = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "trialing",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  plan: planEnum("plan").default("free").notNull(),
  creditsUsed: integer("credits_used").default(0).notNull(),
  creditsLimit: integer("credits_limit").default(20).notNull(),
  creditsResetAt: timestamp("credits_reset_at").defaultNow().notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  status: statusEnum("status").notNull(),
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const generations = pgTable("generations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tool: toolEnum("tool").notNull(),
  inputText: text("input_text"),
  outputText: text("output_text"),
  fileName: varchar("file_name", { length: 500 }),
  language: varchar("language", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type Generation = typeof generations.$inferSelect;
