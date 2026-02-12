import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, LineChart, Line, Tooltip, Legend } from 'recharts';
import { TrendingUp, Home, DollarSign, Users } from "lucide-react";

// Monthly Closings Data
const monthlyClosingsData = [
  { month: 'Jan', closings: 12, revenue: 45 },
  { month: 'Feb', closings: 18, revenue: 62 },
  { month: 'Mar', closings: 15, revenue: 58 },
  { month: 'Apr', closings: 22, revenue: 78 },
  { month: 'May', closings: 28, revenue: 95 },
  { month: 'Jun', closings: 25, revenue: 88 },
  { month: 'Jul', closings: 30, revenue: 105 },
  { month: 'Aug', closings: 26, revenue: 92 },
  { month: 'Sep', closings: 32, revenue: 112 },
  { month: 'Oct', closings: 35, revenue: 125 },
  { month: 'Nov', closings: 38, revenue: 135 },
  { month: 'Dec', closings: 42, revenue: 148 },
];

const propertyTypeData = [
  { type: 'Villa', count: 45, color: '#3b82f6' },
  { type: 'Apartment', count: 78, color: '#10b981' },
  { type: 'Commercial', count: 32, color: '#f59e0b' },
  { type: 'Plot', count: 28, color: '#8b5cf6' },
  { type: 'Warehouse', count: 15, color: '#ec4899' },
  { type: 'Residential', count: 49, color: '#14b8a6' },
];

const recentSales = [
  { 
    property: "Lakeside Villa", 
    buyer: "Rajesh Kumar",
    amount: "₹4.2Cr",
    status: "Completed",
    statusColor: "green"
  },
  { 
    property: "Metro Square", 
    buyer: "Priya Sharma",
    amount: "₹2.8Cr",
    status: "In Progress",
    statusColor: "blue"
  },
  { 
    property: "Downtown Heights", 
    buyer: "Amit Patel",
    amount: "₹3.5Cr",
    status: "Pending",
    statusColor: "orange"
  },
];

export function DataWidget() {
  const getStatusColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900';
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900';
      case 'orange':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-900';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Monthly Closings Chart */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Monthly Closings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Property closings and revenue trends
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.2%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyClosingsData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3} 
                  vertical={false} 
                />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="closings" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Closings"
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Revenue (Cr)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Property Type Distribution */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              Property Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {propertyTypeData.map((item, index) => {
                const total = propertyTypeData.reduce((sum, p) => sum + p.count, 0);
                const percentage = ((item.count / total) * 100).toFixed(0);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.type}</span>
                      <span className="font-medium">{item.count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Recent Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale, index) => (
                <div 
                  key={index}
                  className="flex items-start justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">{sale.property}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {sale.buyer}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-sm font-semibold">{sale.amount}</p>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(sale.statusColor)}`}
                    >
                      {sale.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
