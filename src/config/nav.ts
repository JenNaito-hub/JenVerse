import {
  LayoutDashboard,
  BrainCircuit,
  ImageIcon,
  LayoutTemplate,
  FolderKanban,
  History,
  Settings,
} from "lucide-react";
import type { NavItem } from "@/types";

export const mainNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Knowledge AI", href: "/knowledge", icon: BrainCircuit },
  { title: "Image AI", href: "/image", icon: ImageIcon },
  { title: "Templates", href: "/templates", icon: LayoutTemplate, badge: "New" },
  { title: "Projects", href: "/projects", icon: FolderKanban, badge: "8" },
  { title: "History", href: "/history", icon: History },
];

export const secondaryNav: NavItem[] = [
  { title: "Settings", href: "/settings", icon: Settings },
];
