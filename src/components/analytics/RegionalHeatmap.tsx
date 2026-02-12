import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { MapPin, TrendingUp, DollarSign } from "lucide-react";

const heatmapData = [
  { 
    region: 'Downtown',
    activity: 95,
    sales: 4200000,
    transactions: 185,
    avgPrice: 22703,
    growth: 12.5,
    coordinates: { row: 1, col: 2 }
  },
  { 
    region: 'Midtown',
    activity: 88,
    sales: 3800000,
    transactions: 165,
    avgPrice: 23030,
    growth: 8.3,
    coordinates: { row: 2, col: 2 }
  },
  { 
    region: 'Upper East Side',
    activity: 75,
    sales: 3200000,
    transactions: 125,
    avgPrice: 25600,
    growth: 15.2,
    coordinates: { row: 1, col: 3 }
  },
  { 
    region: 'Brooklyn Heights',
    activity: 82,
    sales: 2900000,
    transactions: 140,
    avgPrice: 20714,
    growth: 6.8,
    coordinates: { row: 3, col: 1 }
  },
  { 
    region: 'Queens',
    activity: 65,
    sales: 2100000,
    transactions: 120,
    avgPrice: 17500,
    growth: 18.9,
    coordinates: { row: 3, col: 3 }
  },
  { 
    region: 'Bronx',
    activity: 58,
    sales: 1650000,
    transactions: 98,
    avgPrice: 16837,
    growth: 22.1,
    coordinates: { row: 1, col: 1 }
  },
  { 
    region: 'Staten Island',
    activity: 45,
    sales: 1200000,
    transactions: 75,
    avgPrice: 16000,
    growth: 9.4,
    coordinates: { row: 4, col: 1 }
  },
  { 
    region: 'Long Island',
    activity: 70,
    sales: 2800000,
    transactions: 110,
    avgPrice: 25455,
    growth: 11.7,
    coordinates: { row: 2, col: 4 }
  }
];

interface RegionalHeatmapProps {
  className?: string;
}

export function RegionalHeatmap({ className }: RegionalHeatmapProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getActivityColor = (activity: number) => {
    if (activity >= 90) return 'bg-red-500';
    if (activity >= 80) return 'bg-orange-500';
    if (activity >= 70) return 'bg-yellow-500';
    if (activity >= 60) return 'bg-green-500';
    if (activity >= 50) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  const getActivityLevel = (activity: number) => {
    if (activity >= 90) return 'Very High';
    if (activity >= 80) return 'High';
    if (activity >= 70) return 'Moderate';
    if (activity >= 60) return 'Low';
    return 'Very Low';
  };

  const maxActivity = Math.max(...heatmapData.map(d => d.activity));
  const minActivity = Math.min(...heatmapData.map(d => d.activity));

  const topPerformers = [...heatmapData]
    .sort((a, b) => b.activity - a.activity)
    .slice(0, 3);

  const fastestGrowing = [...heatmapData]
    .sort((a, b) => b.growth - a.growth)
    .slice(0, 3);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Regional Activity Heatmap
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            <TrendingUp className="h-3 w-3" />
            Live Data
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Market activity and performance by region
        </p>
      </CardHeader>
      <CardContent>
        {/* Heatmap Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {heatmapData.map((region, index) => (
              <div
                key={index}
                className="group relative p-4 rounded-lg border transition-all duration-200 hover:shadow-lg cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${getActivityColor(region.activity).replace('bg-', 'rgb(')}20), ${getActivityColor(region.activity).replace('bg-', 'rgb(')}10))`
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm truncate">{region.region}</h4>
                  <div className={`w-3 h-3 rounded-full ${getActivityColor(region.activity)}`} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Activity</span>
                    <span className="font-medium">{region.activity}/100</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Transactions</span>
                    <span className="font-medium">{region.transactions}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Avg Price</span>
                    <span className="font-medium">{formatCurrency(region.avgPrice)}</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Growth</span>
                    <span className={`font-medium ${region.growth >= 10 ? 'text-green-600' : 'text-blue-600'}`}>
                      +{region.growth}%
                    </span>
                  </div>
                </div>

                {/* Tooltip on hover */}
                <div className="absolute inset-x-0 bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                    <h5 className="font-medium mb-2">{region.region}</h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Activity Level:</span>
                        <span className="font-medium">{getActivityLevel(region.activity)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Sales:</span>
                        <span className="font-medium">{formatCurrency(region.sales)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transactions:</span>
                        <span className="font-medium">{region.transactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Price:</span>
                        <span className="font-medium">{formatCurrency(region.avgPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth Rate:</span>
                        <span className="font-medium text-green-600">+{region.growth}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>Activity Level:</span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Moderate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Very High</span>
            </div>
          </div>
        </div>

        {/* Performance Rankings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Performers */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Top Performing Regions
            </h4>
            {topPerformers.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{region.region}</p>
                    <p className="text-xs text-muted-foreground">
                      {region.transactions} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{region.activity}/100</p>
                  <p className="text-xs text-green-600">+{region.growth}%</p>
                </div>
              </div>
            ))}
          </div>

          {/* Fastest Growing */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              Fastest Growing Markets
            </h4>
            {fastestGrowing.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{region.region}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(region.sales)} total
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm text-green-600">+{region.growth}%</p>
                  <p className="text-xs text-muted-foreground">{region.activity}/100</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}