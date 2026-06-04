"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import type { TransactionKind } from "./budget-format";

export type TransactionInput = {
  kind: TransactionKind;
  amount: number;
  description: string;
  category?: string | null;
  member?: string | null;
  occurredAt?: string | null; // ISO date string
};

export type ActionResult = { ok: true } | { ok: false; error: string };

type Validated = {
  kind: TransactionKind;
  amount: number;
  description: string;
  category: string | null;
  member: string | null;
  occurredAt: Date;
};

function validate(
  input: TransactionInput,
): { ok: true; values: Validated } | { ok: false; error: string } {
  const kind: TransactionKind = input.kind === "income" ? "income" : "expense";

  // Whole yen, strictly positive. Sign is carried by `kind`, not the number.
  const amount = Math.round(Number(input.amount));
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, error: "Amount must be a number greater than 0." };
  }

  const description = (input.description ?? "").trim();
  if (!description) {
    return { ok: false, error: "Description is required." };
  }

  const occurredAt = input.occurredAt ? new Date(input.occurredAt) : new Date();
  if (Number.isNaN(occurredAt.getTime())) {
    return { ok: false, error: "Invalid date." };
  }

  return {
    ok: true,
    values: {
      kind,
      amount,
      description,
      category: input.category?.trim() || null,
      member: input.member?.trim() || null,
      occurredAt,
    },
  };
}

export async function addTransaction(
  input: TransactionInput,
): Promise<ActionResult> {
  const parsed = validate(input);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  await db.insert(transactions).values(parsed.values);
  revalidatePath("/budget");
  return { ok: true };
}

export async function updateTransaction(
  id: string,
  input: TransactionInput,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id." };

  const parsed = validate(input);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  await db
    .update(transactions)
    .set(parsed.values)
    .where(eq(transactions.id, id));
  revalidatePath("/budget");
  return { ok: true };
}

export async function deleteTransaction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id." };

  await db.delete(transactions).where(eq(transactions.id, id));
  revalidatePath("/budget");
  return { ok: true };
}
