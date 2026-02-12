import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'pink';
}

export function KPICard({ 
  title, 
  value, 
  subtitle,
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  description,
  color = 'blue'
}: KPICardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'blue':
        return {
          iconBg: 'bg-blue-50 dark:bg-blue-950',
          iconColor: 'text-blue-600 dark:text-blue-400',
        };
      case 'green':
        return {
          iconBg: 'bg-green-50 dark:bg-green-950',
          iconColor: 'text-green-600 dark:text-green-400',
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-50 dark:bg-purple-950',
          iconColor: 'text-purple-600 dark:text-purple-400',
        };
      case 'orange':
        return {
          iconBg: 'bg-orange-50 dark:bg-orange-950',
          iconColor: 'text-orange-600 dark:text-orange-400',
        };
      case 'teal':
        return {
          iconBg: 'bg-teal-50 dark:bg-teal-950',
          iconColor: 'text-teal-600 dark:text-teal-400',
        };
      case 'pink':
        return {
          iconBg: 'bg-pink-50 dark:bg-pink-950',
          iconColor: 'text-pink-600 dark:text-pink-400',
        };
      default:
        return {
          iconBg: 'bg-blue-50 dark:bg-blue-950',
          iconColor: 'text-blue-600 dark:text-blue-400',
        };
    }
  };

  const getChangeBadgeClasses = () => {
    switch (changeType) {
      case 'positive':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900';
      case 'negative':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800';
    }
  };

  const colorClasses = getColorClasses();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Card className="transition-all duration-300 hover:shadow-lg hover:shadow-black/5 border-border/50 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-semibold tracking-tight">
                        {value}
                      </h3>
                      {subtitle && subtitle.includes(':') ? (
                        <div className="flex items-baseline gap-3 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground mb-0.5">
                              {subtitle.split(':')[0]}
                            </p>
                            <p className="text-2xl font-semibold">
                              {subtitle.split(':')[1].trim()}
                            </p>
                          </div>
                        </div>
                      ) : subtitle ? (
                        <p className="text-xs text-muted-foreground">
                          {subtitle}
                        </p>
                      ) : null}
                    </div>
                    {change !== undefined && (
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-0.5 ${getChangeBadgeClasses()}`}
                        >
                          <span className="flex items-center gap-1">
                            {changeType === 'positive' ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : changeType === 'negative' ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : null}
                            {changeType === 'positive' ? '+' : ''}{change}%
                          </span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">vs last month</span>
                      </div>
                    )}
                  </div>
                  <div className={`${colorClasses.iconBg} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`h-5 w-5 ${colorClasses.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TooltipTrigger>
        {description && (
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
