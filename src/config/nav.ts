import {
  LayoutDashboard,
  BrainCircuit,
  ImageIcon,
  Clapperboard,
  PenLine,
  ScrollText,
  CalendarClock,
  LayoutTemplate,
  Workflow,
  Radar,
  History,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Knowledge AI", href: "/knowledge", icon: BrainCircuit },
  { title: "Image AI", href: "/image", icon: ImageIcon },
  { title: "Video Studio", href: "/video", icon: Clapperboard, badge: "New" },
  { title: "Content Studio", href: "/content", icon: PenLine, badge: "New" },
  { title: "Mẫu kịch bản", href: "/scripts", icon: ScrollText },
  { title: "Schedule", href: "/schedule", icon: CalendarClock },
  { title: "Templates", href: "/templates", icon: LayoutTemplate },
  { title: "Workflows", href: "/workflows", icon: Workflow },
  { title: "Lead Scraper", href: "/leads", icon: Radar, badge: "New" },
  { title: "History", href: "/history", icon: History },
];

export const secondaryNav: NavItem[] = [
  { title: "Settings", href: "/settings", icon: Settings },
];
