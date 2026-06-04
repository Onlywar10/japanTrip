import { asc, desc } from "drizzle-orm";

import { db } from "@/db";
import { memberTransactions, members } from "@/db/schema";
import type { AccountTransaction, MemberAccount } from "./budget-format";

/** All members, oldest first (stable display order). */
export async function getMembers(): Promise<MemberAccount[]> {
  const rows = await db
    .select()
    .from(members)
    .orderBy(asc(members.createdAt));
  return rows.map((m) => ({ id: m.id, name: m.name }));
}

/** Every member entry, newest first, grouped by member id. */
export async function getMemberTransactions(): Promise<
  Record<string, AccountTransaction[]>
> {
  const rows = await db
    .select()
    .from(memberTransactions)
    .orderBy(
      desc(memberTransactions.occurredAt),
      desc(memberTransactions.createdAt),
    );

  const byMember: Record<string, AccountTransaction[]> = {};
  for (const r of rows) {
    (byMember[r.memberId] ??= []).push({
      id: r.id,
      kind: r.kind,
      amount: r.amount,
      description: r.description,
      category: r.category,
      occurredAt: r.occurredAt.toISOString(),
    });
  }
  return byMember;
}
