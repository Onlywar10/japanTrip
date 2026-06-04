"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { memberTransactions, members } from "@/db/schema";
import type { TransactionKind } from "./budget-format";

export type ActionResult = { ok: true } | { ok: false; error: string };

export type MemberTxInput = {
  kind: TransactionKind;
  amount: number;
  description: string;
  category?: string | null;
  occurredAt?: string | null; // ISO date string
};

// ── Members ──────────────────────────────────────────────────────────

export async function addMember(name: string): Promise<ActionResult> {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return { ok: false, error: "Name is required." };

  await db.insert(members).values({ name: trimmed });
  revalidatePath("/members");
  return { ok: true };
}

export async function renameMember(
  id: string,
  name: string,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id." };
  const trimmed = (name ?? "").trim();
  if (!trimmed) return { ok: false, error: "Name is required." };

  await db.update(members).set({ name: trimmed }).where(eq(members.id, id));
  revalidatePath("/members");
  return { ok: true };
}

export async function deleteMember(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id." };
  // Entries are removed via the ON DELETE CASCADE foreign key.
  await db.delete(members).where(eq(members.id, id));
  revalidatePath("/members");
  return { ok: true };
}

// ── Member transactions ──────────────────────────────────────────────

type Validated = {
  kind: TransactionKind;
  amount: number;
  description: string;
  category: string | null;
  occurredAt: Date;
};

function validate(
  input: MemberTxInput,
): { ok: true; values: Validated } | { ok: false; error: string } {
  const kind: TransactionKind = input.kind === "income" ? "income" : "expense";

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
      occurredAt,
    },
  };
}

export async function addMemberTransaction(
  memberId: string,
  input: MemberTxInput,
): Promise<ActionResult> {
  if (!memberId) return { ok: false, error: "Missing member." };

  const parsed = validate(input);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  await db.insert(memberTransactions).values({ memberId, ...parsed.values });
  revalidatePath("/members");
  return { ok: true };
}

export async function updateMemberTransaction(
  id: string,
  input: MemberTxInput,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id." };

  const parsed = validate(input);
  if (!parsed.ok) return { ok: false, error: parsed.error };

  await db
    .update(memberTransactions)
    .set(parsed.values)
    .where(eq(memberTransactions.id, id));
  revalidatePath("/members");
  return { ok: true };
}

export async function deleteMemberTransaction(
  id: string,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id." };

  await db.delete(memberTransactions).where(eq(memberTransactions.id, id));
  revalidatePath("/members");
  return { ok: true };
}
