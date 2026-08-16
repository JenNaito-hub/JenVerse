import { BrainCircuit, ImageIcon, Bell } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { activityFeed } from "@/data/dashboard";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import type { ActivityItem } from "@/types";

const typeIcon = {
  knowledge: BrainCircuit,
  image: ImageIcon,
  system: Bell,
} as const;

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = typeIcon[item.type];
  return (
    <li className="flex items-start gap-3">
      <div className="relative">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarImage src={item.actor.avatar} alt={item.actor.name} />
          <AvatarFallback>{getInitials(item.actor.name)}</AvatarFallback>
        </Avatar>
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-card ring-1 ring-border">
          <Icon className="h-3 w-3 text-muted-foreground" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">
          <span className="font-medium">{item.actor.name}</span>{" "}
          <span className="text-muted-foreground">{item.action}</span>{" "}
          <span className="font-medium">{item.target}</span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatRelativeTime(item.createdAt)}
        </p>
      </div>
    </li>
  );
}

export function ActivityFeed() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-5">
          {activityFeed.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
