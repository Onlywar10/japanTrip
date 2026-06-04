import type { LocaleText } from "./itinerary";

export type TransactionKind = "income" | "expense";

/** Plain, serializable shape passed from the server to client components. */
export type BudgetTransaction = {
  id: string;
  kind: TransactionKind;
  amount: number;
  description: string;
  category: string | null;
  member: string | null;
  occurredAt: string; // ISO date string
};

export type BudgetSummary = {
  balance: number;
  totalIn: number;
  totalOut: number;
};

const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

/** Format whole yen, e.g. 12500 -> "¥12,500". Negatives keep the sign. */
export function formatYen(amount: number): string {
  return yen.format(amount);
}

/** A handful of suggested categories, shown as quick-pick chips. */
export const CATEGORIES: { value: string; label: LocaleText }[] = [
  { value: "food", label: { en: "Food", zh: "餐飲" } },
  { value: "lodging", label: { en: "Lodging", zh: "住宿" } },
  { value: "transport", label: { en: "Transport", zh: "交通" } },
  { value: "shopping", label: { en: "Shopping", zh: "購物" } },
  { value: "tickets", label: { en: "Tickets", zh: "票券" } },
  { value: "other", label: { en: "Other", zh: "其他" } },
];

export function categoryLabel(value: string): LocaleText {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
