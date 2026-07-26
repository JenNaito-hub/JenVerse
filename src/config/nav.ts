import {
  LayoutDashboard,
  BrainCircuit,
  ImageIcon,
  Clapperboard,
  PenLine,
  ScrollText,
  FileSignature,
  CalendarClock,
  LayoutTemplate,
  Radar,
  History,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Knowledge AI", href: "/knowledge", icon: BrainCircuit },
  { title: "Image AI", href: "/image", icon: ImageIcon },
  { title: "Video Studio", href: "/video", icon: Clapperboard },
  { title: "Content Studio", href: "/content", icon: PenLine },
  { title: "Mẫu kịch bản", href: "/scripts", icon: ScrollText },
  { title: "Hợp đồng", href: "/contracts", icon: FileSignature, badge: "New" },
  { title: "Schedule", href: "/schedule", icon: CalendarClock },
  { title: "Templates", href: "/templates", icon: LayoutTemplate },
  { title: "Lead Scraper", href: "/leads", icon: Radar, badge: "New" },
  { title: "History", href: "/history", icon: History },
];

export const secondaryNav: NavItem[] = [
  { title: "Settings", href: "/settings", icon: Settings },
];
