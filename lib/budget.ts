import { desc } from "drizzle-orm";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import type { BudgetTransaction } from "./budget-format";

export { summarize } from "./budget-format";

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
