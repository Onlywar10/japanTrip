import { Masthead } from "@/components/itinerary/masthead";
import { Planner } from "@/components/itinerary/planner";
import { DiamondCollage } from "@/components/album/diamond-collage";

export default function Home() {
  return (
    <>
      <Masthead />
      <Planner />
      <DiamondCollage />
    </>
  );
}
