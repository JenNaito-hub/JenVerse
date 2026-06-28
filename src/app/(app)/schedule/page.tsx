import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { ScheduleView } from "@/components/schedule/schedule-view";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Lịch đăng & Kênh"
        description="Quản lý các kênh Facebook, lịch đăng sắp tới và bật đăng tự động."
      />
      <ScheduleView />
    </div>
  );
}
