import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * "income"  -> money added to the family pot (a contribution / top-up)
 * "expense" -> money spent out of the pot
 *
 * Balance left = SUM(income) - SUM(expense), computed on read.
 */
export const transactionKind = pgEnum("transaction_kind", ["income", "expense"]);

export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    kind: transactionKind("kind").notNull(),

    // Whole Japanese Yen. Always stored as a positive amount; `kind` decides
    // the sign. `integer` is exact for yen and returns a real JS number,
    // so summing the balance needs no string parsing.
    amount: integer("amount").notNull(),

    // Short label, e.g. "Lunch at Ichiran" or "Mom's contribution".
    description: text("description").notNull(),

    // Optional free-text grouping, e.g. "food", "lodging", "transport".
    category: text("category"),

    // Optional: which family member this relates to / who paid.
    member: text("member"),

    // When the money actually moved (defaults to now, editable by the user).
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => sql`now()`),
  },
  (table) => [index("transactions_occurred_at_idx").on(table.occurredAt)],
);

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
