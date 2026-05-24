import { Topbar } from "@/components/itinerary/topbar";
import { Masthead } from "@/components/itinerary/masthead";
import { Planner } from "@/components/itinerary/planner";
import { Footer } from "@/components/itinerary/footer";

export default function Home() {
  return (
    <>
      <Topbar />
      <main className="flex-1">
        <Masthead />
        <Planner />
      </main>
      <Footer />
    </>
  );
}
