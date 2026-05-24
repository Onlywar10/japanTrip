import {
  Plane,
  Car,
  Landmark,
  UtensilsCrossed,
  ShoppingBag,
  Mountain,
  Camera,
  Train,
  BedDouble,
  type LucideIcon,
} from "lucide-react";
import type { StopType } from "@/lib/itinerary";

const MAP: Record<StopType, LucideIcon> = {
  plane: Plane,
  car: Car,
  shrine: Landmark,
  food: UtensilsCrossed,
  shopping: ShoppingBag,
  nature: Mountain,
  sight: Camera,
  transport: Train,
  hotel: BedDouble,
};

interface Props {
  type: StopType;
  className?: string;
}

export function StopIcon({ type, className }: Props) {
  const Icon = MAP[type] ?? Camera;
  return <Icon className={className} aria-hidden strokeWidth={1.6} />;
}
