import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BrainCircuit, ImageIcon, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { statCards } from "@/data/dashboard";
import { currentUser } from "@/data/team";

export const metadata: Metadata = { title: "Dashboard" };

const quickActions = [
  {
    title: "Knowledge AI",
    description: "Draft, summarize and ideate with text generation.",
    href: "/knowledge",
    icon: BrainCircuit,
  },
  {
    title: "Image AI",
    description: "Create on-brand visuals from a simple prompt.",
    href: "/image",
    icon: ImageIcon,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(" ")[0]}`}
        description="Here's what's happening across your workspace today."
      >
        <Button variant="primary" asChild>
          <Link href="/image">
            <Sparkles className="h-4 w-4" />
            New generation
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="group flex items-center gap-4 p-5 transition-shadow hover:shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-primary">
                <action.icon className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
