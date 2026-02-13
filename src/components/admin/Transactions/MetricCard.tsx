import { Card, CardContent, CardHeader } from "../../ui/card";
import { cn } from "../../ui/utils";

const colorMap = {
  purple: "text-[#A855F7] bg-[#A855F7]/10",
  green: "text-emerald-600 bg-emerald-500/10",
  yellow: "text-amber-600 bg-amber-500/10",
  red: "text-red-600 bg-red-500/10",
  blue: "text-blue-600 bg-blue-500/10",
};

export function MetricCard({
  title,
  value,
  subValue,
  badge,
  color = "purple",
  className,
}: {
  title: string;
  value: string | number;
  subValue?: string;
  badge?: string;
  color?: keyof typeof colorMap;
  className?: string;
}) {
  return (
    <Card className={cn("border-slate-200 dark:border-slate-700", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {badge && (
          <span className={cn("rounded px-1.5 py-0.5 text-xs font-medium", colorMap[color])}>
            {badge}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
        )}
      </CardContent>
    </Card>
  );
}
