import type { Metadata } from "next";

import { PageHeader } from "@/components/shared/page-header";
import { VideoStudio } from "@/components/video/video-studio";
import { isVideoConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Video Studio" };

export default function VideoPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Video Studio"
        description="Tạo video ngắn từ kịch bản — chọn phong cách, thời lượng và giọng lồng tiếng."
      />
      <VideoStudio aiConfigured={isVideoConfigured()} />
    </div>
  );
}
