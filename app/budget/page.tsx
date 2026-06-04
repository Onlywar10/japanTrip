import type { Metadata } from "next";

import { getTransactions, summarize } from "@/lib/budget";
import { BudgetView } from "@/components/budget/budget-view";

export const metadata: Metadata = {
  title: "Budget · Kyūshū Itinerary",
  description: "Shared family trip budget — balance, contributions and spending.",
};

// The budget changes as the family adds entries, so render fresh each request.
export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const transactions = await getTransactions();
  const summary = summarize(transactions);

  return <BudgetView transactions={transactions} summary={summary} />;
}
