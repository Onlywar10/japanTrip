import type { Metadata } from "next";
import { AlbumView } from "@/components/album/album-view";

export const metadata: Metadata = {
  title: "Album · Kyūshū Itinerary",
  description: "Shared family trip photo album.",
  robots: { index: false, follow: false },
};

export default function AlbumPage() {
  return <AlbumView />;
}
