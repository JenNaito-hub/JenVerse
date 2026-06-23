import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usageData } from "@/data/dashboard";

export function UsageChart() {
  const max = Math.max(
    ...usageData.flatMap((d) => [d.knowledge, d.image])
  );

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle>Usage this week</CardTitle>
          <CardDescription>Generations by type, last 7 days</CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
            Knowledge
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            Image
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-56 items-end justify-between gap-3">
          {usageData.map((d) => (
            <div
              key={d.label}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-44 w-full items-end justify-center gap-1.5">
                <div
                  className="w-1/2 max-w-[18px] rounded-t-md bg-foreground transition-all"
                  style={{ height: `${(d.knowledge / max) * 100}%` }}
                  title={`${d.knowledge} knowledge`}
                />
                <div
                  className="w-1/2 max-w-[18px] rounded-t-md bg-primary transition-all"
                  style={{ height: `${(d.image / max) * 100}%` }}
                  title={`${d.image} image`}
                />
              </div>
              <span className="text-xs text-muted-foreground">{d.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
