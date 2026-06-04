import { desc } from "drizzle-orm";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import type { BudgetSummary, BudgetTransaction } from "./budget-format";

/** All transactions, newest first. Runs on the server only. */
export async function getTransactions(): Promise<BudgetTransaction[]> {
  const rows = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.occurredAt), desc(transactions.createdAt));

  return rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    amount: r.amount,
    description: r.description,
    category: r.category,
    member: r.member,
    occurredAt: r.occurredAt.toISOString(),
  }));
}

/** Derive the running totals from a list of transactions (no extra query). */
export function summarize(items: BudgetTransaction[]): BudgetSummary {
  let totalIn = 0;
  let totalOut = 0;
  for (const t of items) {
    if (t.kind === "income") totalIn += t.amount;
    else totalOut += t.amount;
  }
  return { totalIn, totalOut, balance: totalIn - totalOut };
}
