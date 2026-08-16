"use client";

import Link from "next/link";
import {
  Bell,
  Plus,
  LogOut,
  User,
  Settings,
  BrainCircuit,
  ImageIcon,
  PenLine,
  Clapperboard,
} from "lucide-react";

import { currentUser } from "@/data/team";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth/actions";
import { MobileNav } from "./mobile-nav";
import { GlobalSearch } from "./global-search";
import { ThemeToggle } from "./theme-toggle";

const notifications = [
  { id: "n1", title: "Content Studio tạo xong 12 bài mới", time: "5m ago" },
  { id: "n2", title: "Lead Scraper thu 48 leads từ một video TikTok", time: "1h ago" },
  { id: "n3", title: "Đã lên lịch 18 bài trên 6 kênh Facebook", time: "3h ago" },
  { id: "n4", title: "Bạn đã dùng 77% credits trong tháng", time: "Yesterday" },
];

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-8">
      <MobileNav />

      <div className="hidden flex-1 md:block md:max-w-md">
        <GlobalSearch />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary" size="sm" className="hidden sm:inline-flex">
              <Plus className="h-4 w-4" />
              New generation
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem asChild>
              <Link href="/content">
                <PenLine className="h-4 w-4" />
                Content Studio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/image">
                <ImageIcon className="h-4 w-4" />
                Image AI
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/video">
                <Clapperboard className="h-4 w-4" />
                Video Studio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/knowledge">
                <BrainCircuit className="h-4 w-4" />
                Knowledge AI
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between text-sm font-semibold text-foreground">
              Notifications
              <Badge variant="primary" className="h-5">
                {notifications.length} new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex flex-col items-start gap-0.5 py-2.5"
              >
                <span className="text-sm font-medium">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/history"
                className="justify-center text-sm text-muted-foreground"
              >
                View all activity
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-0.5 pr-3 transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">
                {currentUser.name.split(" ")[0]}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {currentUser.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  jen.aescentic@gmail.com
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>
              <Badge variant="primary" className="font-medium">
                Pro plan
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={signOut}>
              <DropdownMenuItem asChild>
                <button
                  type="submit"
                  className="w-full text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
