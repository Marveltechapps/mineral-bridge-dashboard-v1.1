import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Home, Building, Building2, Store, Trees } from "lucide-react";

const propertyData = [
  { name: 'Apartments', value: 45, color: '#3b82f6', sales: 2850000 },
  { name: 'Houses', value: 30, color: '#22c55e', sales: 4200000 },
  { name: 'Condos', value: 15, color: '#f59e0b', sales: 1650000 },
  { name: 'Commercial', value: 7, color: '#8b5cf6', sales: 3800000 },
  { name: 'Land', value: 3, color: '#ef4444', sales: 950000 }
];

const getIcon = (name: string) => {
  switch (name) {
    case 'Apartments': return Building;
    case 'Houses': return Home;
    case 'Condos': return Building2;
    case 'Commercial': return Store;
    case 'Land': return Trees;
    default: return Home;
  }
};

interface PropertyTypeChartProps {
  className?: string;
}

export function PropertyTypeChart({ className }: PropertyTypeChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalSales = propertyData.reduce((sum, item) => sum + item.sales, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value}% of total transactions
          </p>
          <p className="text-sm font-medium">
            Sales: {formatCurrency(data.sales)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for segments less than 5%
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          Property Types Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Transaction breakdown by property type
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut Chart */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {propertyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and Details */}
          <div className="space-y-4">
            {propertyData.map((item, index) => {
              const IconComponent = getIcon(item.name);
              const percentage = (item.sales / totalSales) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.value}% of transactions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.sales)}</p>
                    <p className="text-sm text-muted-foreground">
                      {percentage.toFixed(1)}% of sales
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Most Popular</p>
              <p className="font-medium text-blue-600">Apartments</p>
              <p className="text-xs text-muted-foreground">45% of transactions</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Highest Value</p>
              <p className="font-medium text-green-600">Houses</p>
              <p className="text-xs text-muted-foreground">{formatCurrency(4200000)} total</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Growing Segment</p>
              <p className="font-medium text-purple-600">Commercial</p>
              <p className="text-xs text-muted-foreground">+15% this quarter</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}