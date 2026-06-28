import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BrainCircuit,
  ImageIcon,
  PenLine,
  Radar,
  Sparkles,
  Clock,
  CalendarClock,
} from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { statCards } from "@/data/dashboard";
import { channels, scheduledPosts } from "@/data/channels";
import { currentUser } from "@/data/team";
import { getInitials } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const quickActions = [
  {
    title: "Content Studio",
    description: "Sản xuất bài đăng Facebook hàng loạt bằng AI.",
    href: "/content",
    icon: PenLine,
  },
  {
    title: "Image AI",
    description: "Tạo ảnh 4 góc từ một prompt.",
    href: "/image",
    icon: ImageIcon,
  },
  {
    title: "Lead Scraper",
    description: "Thu lead từ Facebook & TikTok, chấm nóng/lạnh.",
    href: "/leads",
    icon: Radar,
  },
  {
    title: "Knowledge AI",
    description: "Chat, viết và tóm tắt với AI.",
    href: "/knowledge",
    icon: BrainCircuit,
  },
];

export default function DashboardPage() {
  const channelName = (id: string) =>
    channels.find((c) => c.id === id)?.name ?? "Kênh";
  const channelAvatar = (id: string) =>
    channels.find((c) => c.id === id)?.avatar ?? "";

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description="Tổng quan workspace content marketing của bạn hôm nay."
      >
        <Button variant="primary" asChild>
          <Link href="/content">
            <Sparkles className="h-4 w-4" />
            Tạo chiến dịch
          </Link>
        </Button>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Chart + activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UsageChart />
        </div>
        <ActivityFeed />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="group flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-primary">
                <action.icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <h3 className="font-semibold">{action.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                Mở
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Card>
          </Link>
        ))}
      </div>

      {/* Today's schedule */}
      <Card>
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Lịch đăng hôm nay</h2>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/schedule">
              Xem tất cả
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ul className="divide-y divide-border px-2 pb-2">
          {scheduledPosts.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex w-12 shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Clock className="h-3 w-3" />
                {p.time}
              </span>
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage
                  src={channelAvatar(p.channelId)}
                  alt={channelName(p.channelId)}
                />
                <AvatarFallback className="text-[10px]">
                  {getInitials(channelName(p.channelId))}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {channelName(p.channelId)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
