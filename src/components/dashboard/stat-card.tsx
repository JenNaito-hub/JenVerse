import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { StatCard as StatCardType } from "@/types";

export function StatCard({ stat }: { stat: StatCardType }) {
  const positive = stat.trend === "up";
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
          <stat.icon className="h-5 w-5 text-foreground" />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-xs font-semibold",
            positive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-600"
          )}
        >
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
          {Math.abs(stat.change)}%
        </span>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
      </div>
    </Card>
  );
}
