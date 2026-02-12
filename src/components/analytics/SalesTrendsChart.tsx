import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const salesData = [
  { month: 'Jan', sales: 850000, transactions: 45, avgPrice: 18889 },
  { month: 'Feb', sales: 920000, transactions: 52, avgPrice: 17692 },
  { month: 'Mar', sales: 1100000, transactions: 58, avgPrice: 18966 },
  { month: 'Apr', sales: 1250000, transactions: 65, avgPrice: 19231 },
  { month: 'May', sales: 1180000, transactions: 61, avgPrice: 19344 },
  { month: 'Jun', sales: 1350000, transactions: 68, avgPrice: 19853 },
  { month: 'Jul', sales: 1420000, transactions: 72, avgPrice: 19722 },
  { month: 'Aug', sales: 1380000, transactions: 70, avgPrice: 19714 },
  { month: 'Sep', sales: 1290000, transactions: 66, avgPrice: 19545 },
  { month: 'Oct', sales: 1450000, transactions: 74, avgPrice: 19595 },
  { month: 'Nov', sales: 1520000, transactions: 78, avgPrice: 19487 },
  { month: 'Dec', sales: 1680000, transactions: 85, avgPrice: 19765 }
];

interface SalesTrendsChartProps {
  className?: string;
}

export function SalesTrendsChart({ className }: SalesTrendsChartProps) {
  const currentMonth = salesData[salesData.length - 1];
  const previousMonth = salesData[salesData.length - 2];
  const salesGrowth = ((currentMonth.sales - previousMonth.sales) / previousMonth.sales) * 100;
  const transactionGrowth = ((currentMonth.transactions - previousMonth.transactions) / previousMonth.transactions) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'sales') {
      return [formatCurrency(value), 'Sales Volume'];
    }
    if (name === 'transactions') {
      return [value, 'Transactions'];
    }
    if (name === 'avgPrice') {
      return [formatCurrency(value), 'Avg Price'];
    }
    return [value, name];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Sales Trends
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={salesGrowth >= 0 ? "default" : "destructive"} className="gap-1">
              {salesGrowth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(salesGrowth).toFixed(1)}%
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(currentMonth.sales)}
            </p>
            <p className="text-xs text-muted-foreground">
              {salesGrowth >= 0 ? '+' : ''}{salesGrowth.toFixed(1)}% from last month
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-bold text-blue-600">
              {currentMonth.transactions}
            </p>
            <p className="text-xs text-muted-foreground">
              {transactionGrowth >= 0 ? '+' : ''}{transactionGrowth.toFixed(1)}% from last month
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Avg Price</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(currentMonth.avgPrice)}
            </p>
            <p className="text-xs text-muted-foreground">
              Current month average
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {formatTooltipValue(entry.value as number, entry.dataKey as string)[1]}: {formatTooltipValue(entry.value as number, entry.dataKey as string)[0]}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#22c55e"
                strokeWidth={3}
                fill="url(#salesGradient)"
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Secondary Chart - Transactions */}
        <div className="mt-6 h-[200px] w-full">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Transaction Volume</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                formatter={(value, name) => [value, 'Transactions']}
                labelClassName="font-medium"
              />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}