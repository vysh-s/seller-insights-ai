import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We'll keep the users table from the template just in case, but won't use it for the main app logic
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// === APPLICATION TYPES (In-Memory Data) ===

export const insightItemSchema = z.object({
  title: z.string(),
  current_state: z.string(),
  benchmark: z.string(),
  recommendation: z.string(),
  expected_impact: z.string(),
});

export const insightsSchema = z.object({
  overall_health: z.enum(["excellent", "good", "concerning"]),
  key_finding: z.string(),
  insights: z.array(insightItemSchema),
  priority_action: z.string(),
});

export const metricsSchema = z.object({
  total_transactions: z.number(),
  completed_transactions: z.number(),
  completion_rate: z.number(),
  cancellation_rate: z.number(),
  failure_rate: z.number(),
  total_revenue: z.number(),
  average_transaction_value: z.number(),
  repeat_customer_rate: z.number(),
  average_processing_time_seconds: z.number(),
});

export const sellerSchema = z.object({
  seller_id: z.string(),
  business_name: z.string(),
  industry: z.string(),
  metrics: metricsSchema,
  insights: insightsSchema,
});

export type Seller = z.infer<typeof sellerSchema>;
export type SellerMetrics = z.infer<typeof metricsSchema>;
export type SellerInsights = z.infer<typeof insightsSchema>;
export type InsightItem = z.infer<typeof insightItemSchema>;

// Summarized seller for the list view
export const sellerSummarySchema = sellerSchema.pick({
  seller_id: true,
  business_name: true,
  industry: true,
});
export type SellerSummary = z.infer<typeof sellerSummarySchema>;
