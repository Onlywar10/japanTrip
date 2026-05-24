import type { Metadata } from "next";
import { ReservationsView } from "@/components/reservations/reservations-view";

export const metadata: Metadata = {
  title: "Reservations · Kyūshū Itinerary",
  description: "Hotel bookings, restaurant reservations, and activity tickets.",
};

export default function ReservationsPage() {
  return <ReservationsView />;
}
