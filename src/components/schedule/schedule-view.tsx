"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Facebook,
  Users,
  UserRound,
  Bot,
  Clock,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { channels as seedChannels, scheduledPosts } from "@/data/channels";
import { toast } from "@/components/ui/toast";
import type { Channel, ChannelType } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const typeIcon: Record<ChannelType, typeof Facebook> = {
  Profile: UserRound,
  Fanpage: Facebook,
  Group: Users,
};

export function ScheduleView() {
  const [channels, setChannels] = useState<Channel[]>(seedChannels);
  const [autoPost, setAutoPost] = useState(false);

  const stats = useMemo(() => {
    const pending = channels.reduce((sum, c) => sum + c.pending, 0);
    const active = channels.filter((c) => c.active).length;
    return { pending, posted: 124, active };
  }, [channels]);

  const toggleChannel = (id: string) =>
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );

  const addChannel = () => {
    const n = channels.length + 1;
    setChannels((prev) => [
      ...prev,
      {
        id: `ch-${Date.now()}`,
        name: `Kênh mới ${n}`,
        avatar: `https://api.dicebear.com/9.x/glass/svg?seed=ch${n}`,
        type: "Fanpage",
        pending: 0,
        frequency: "2 bài/ngày",
        active: true,
      },
    ]);
    toast("Đã thêm kênh");
  };

  const channelName = (id: string) =>
    channels.find((c) => c.id === id)?.name ?? "Kênh";
  const channelAvatar = (id: string) =>
    channels.find((c) => c.id === id)?.avatar ?? "";

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Bài chờ đăng", value: stats.pending, icon: CalendarClock },
          { label: "Đã đăng", value: stats.posted, icon: CheckCircle2 },
          { label: "Kênh hoạt động", value: stats.active, icon: Facebook },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary">
              <s.icon className="h-5 w-5 text-foreground" />
            </span>
            <div>
              <p className="text-2xl font-bold tracking-tight">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Channels */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Kênh Facebook</h2>
            <Button variant="primary" size="sm" onClick={addChannel}>
              <Plus className="h-4 w-4" />
              Thêm kênh
            </Button>
          </div>

          <div className="divide-y divide-border">
            {channels.map((c) => {
              const Icon = typeIcon[c.type];
              return (
                <div key={c.id} className="flex items-center gap-3 py-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={c.avatar} alt={c.name} />
                      <AvatarFallback>{getInitials(c.name)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-card ring-1 ring-border">
                      <Icon className="h-3 w-3 text-muted-foreground" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{c.name}</p>
                      <Badge variant="muted" className="hidden sm:inline-flex">
                        {c.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {c.pending} bài chờ · {c.frequency}
                    </p>
                  </div>
                  <Switch
                    checked={c.active}
                    onCheckedChange={() => toggleChannel(c.id)}
                  />
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming + auto-post */}
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="mb-4 font-semibold">Lịch đăng sắp tới</h2>
            <ul className="space-y-3">
              {scheduledPosts.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="flex w-12 shrink-0 items-center gap-1 text-xs font-semibold text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {p.time}
                  </span>
                  <Avatar className="h-7 w-7 border border-border">
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

          <Card
            className={cn(
              "p-5 transition-colors",
              autoPost && "border-foreground"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-primary">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Tự động đăng</p>
                  <p className="text-xs text-muted-foreground">
                    Kích hoạt đăng tự động lên hàng loạt kênh.
                  </p>
                </div>
              </div>
              <Switch
                checked={autoPost}
                onCheckedChange={(v) => {
                  setAutoPost(v);
                  toast(
                    v
                      ? "Cần nối Facebook Page để đăng thật"
                      : "Đã tắt đăng tự động"
                  );
                }}
              />
            </div>
            {autoPost && (
              <p className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
                Demo — để đăng thật, cần kết nối Facebook Page qua Graph API
                (hợp lệ với Page bạn sở hữu).
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
