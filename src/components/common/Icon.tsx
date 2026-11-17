import {
  Sprout, MessagesSquare, Puzzle, BookOpenText, BriefcaseBusiness, Mic, Hand, Sun, UtensilsCrossed, ShoppingBag, Plane,
  GraduationCap, Building2, Phone, LifeBuoy, TrendingUp, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Sprout, MessagesSquare, Puzzle, BookOpenText, BriefcaseBusiness, Mic, Hand, Sun, UtensilsCrossed, ShoppingBag, Plane,
  GraduationCap, Building2, Phone, LifeBuoy, TrendingUp,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = map[name] ?? Sprout;
  return <C className={className} aria-hidden />;
}
