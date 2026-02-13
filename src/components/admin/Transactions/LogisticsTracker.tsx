import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Progress } from "../../ui/progress";
import type { LogisticsDetails } from "../../../store/dashboardStore";

const CHECKPOINTS = [
  { id: "1", label: "Pickup", status: "completed" as const },
  { id: "2", label: "In transit", status: "current" as const },
  { id: "3", label: "Delivered", status: "pending" as const },
];

export function LogisticsTracker({
  shipment,
  progress = 65,
}: {
  shipment: LogisticsDetails;
  progress?: number;
}) {
  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{shipment.carrierName} Tracking</CardTitle>
          <Badge variant="secondary" className="bg-[#A855F7]/10 text-[#A855F7]">
            {progress}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-4 min-h-[200px] flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Map placeholder — integrate React Leaflet for live GPS
          </p>
        </div>
        <div>
          <p className="text-sm font-medium mb-1">Progress</p>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {CHECKPOINTS.map((point) => (
            <div
              key={point.id}
              className={`p-3 rounded-lg border text-center ${
                point.status === "current"
                  ? "border-[#A855F7] bg-purple-50 dark:bg-purple-950/30"
                  : point.status === "completed"
                    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20"
                    : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <p className="text-xs font-medium">{point.label}</p>
              {point.status === "completed" && (
                <span className="text-emerald-600 text-xs">✓</span>
              )}
            </div>
          ))}
        </div>
        <div className="text-sm space-y-1">
          <p>
            <span className="text-muted-foreground">AWB:</span> {shipment.trackingNumber}
          </p>
          <a
            href={shipment.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#A855F7] hover:underline"
          >
            Track on carrier site →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
