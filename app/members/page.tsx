import type { Metadata } from "next";

import { getMembers, getMemberTransactions } from "@/lib/members";
import { MembersView } from "@/components/members/members-view";

export const metadata: Metadata = {
  title: "Personal · Kyūshū Itinerary",
  description: "Individual pocket-money accounts for each traveller.",
};

// Accounts change as the family logs entries, so render fresh each request.
export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const [members, transactionsByMember] = await Promise.all([
    getMembers(),
    getMemberTransactions(),
  ]);

  return (
    <MembersView
      members={members}
      transactionsByMember={transactionsByMember}
    />
  );
}
