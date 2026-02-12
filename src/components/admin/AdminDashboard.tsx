import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Home,
  Users,
  TrendingUp,
  ArrowRightLeft,
  DollarSign,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const monthlyData = [
  { month: "Jan", closings: 12, revenue: 4.2 },
  { month: "Feb", closings: 15, revenue: 5.8 },
  { month: "Mar", closings: 18, revenue: 6.5 },
  { month: "Apr", closings: 22, revenue: 8.2 },
  { month: "May", closings: 19, revenue: 7.1 },
  { month: "Jun", closings: 25, revenue: 9.5 },
  { month: "Jul", closings: 28, revenue: 11.2 },
  { month: "Aug", closings: 24, revenue: 8.9 },
  { month: "Sep", closings: 30, revenue: 12.5 },
  { month: "Oct", closings: 32, revenue: 13.8 },
  { month: "Nov", closings: 29, revenue: 11.9 },
];

const recentActivities = [
  {
    id: 1,
    type: "property",
    title: "New Property Listed",
    description: "Skyline Towers - Unit 402 added to Mumbai Central",
    time: "5 minutes ago",
    user: "Sarah Mitchell",
  },
  {
    id: 2,
    type: "deal",
    title: "Deal Closed",
    description: "Marina Bay Apartment sold for AED 2.5M",
    time: "15 minutes ago",
    user: "Ahmed Al-Rashid",
  },
  {
    id: 3,
    type: "enquiry",
    title: "New Enquiry",
    description: "Buy request for Riverside Penthouse",
    time: "1 hour ago",
    user: "Sanya Malhotra",
  },
  {
    id: 4,
    type: "payment",
    title: "Payment Received",
    description: "₹85 Lakh commission from Green Valley Villa",
    time: "2 hours ago",
    user: "Priya Sharma",
  },
];

export function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* KPI Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Properties */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
                <Home className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                <ArrowUp className="h-3 w-3" />
                12%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Properties</p>
              <p className="text-3xl mb-2">1,248</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">824 Live</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-amber-600" />
                  <span className="text-amber-600">156 Pending</span>
                </span>
                <span className="text-muted-foreground">268 Sold</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                <ArrowUp className="h-3 w-3" />
                8%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Users</p>
              <p className="text-3xl mb-2">3,542</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>1,248 Buyers</span>
                <span>892 Sellers</span>
                <span>124 Agents</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ongoing Deals */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                <ArrowDown className="h-3 w-3" />
                3%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ongoing Deals</p>
              <p className="text-3xl mb-2">156</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>89 Buy</span>
                <span>45 Sell</span>
                <span>22 Exchange</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exchange Requests */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl">
                <ArrowRightLeft className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                <ArrowUp className="h-3 w-3" />
                24%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Exchange Requests</p>
              <p className="text-3xl mb-2">48</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>22 Pending</span>
                <span>18 Approved</span>
                <span>8 Completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KPI Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl">
                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                <ArrowUp className="h-3 w-3" />
                18%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl mb-2">₹124.5 Cr</p>
              <p className="text-sm text-muted-foreground">
                Commission: ₹8.2 Cr (6.6%)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* New Enquiries */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-xl">
                <MessageSquare className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                12 New
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">New Enquiries</p>
              <p className="text-3xl mb-2">89</p>
              <p className="text-sm text-muted-foreground">
                32 unassigned • 57 in progress
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Platform Health */}
        <Card className="border-border/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-100 dark:bg-cyan-900/20 rounded-xl">
                <CheckCircle className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Healthy
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Platform Health</p>
              <p className="text-3xl mb-2">98.5%</p>
              <p className="text-sm text-muted-foreground">
                Uptime • 2.4s avg response
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Closings Chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Monthly Closings</span>
              <Button variant="ghost" size="sm">
                View Report
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="closings" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Revenue Trend</span>
              <Button variant="ghost" size="sm">
                View Report
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Activity</span>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === "property"
                      ? "bg-blue-100 dark:bg-blue-900/20"
                      : activity.type === "deal"
                      ? "bg-green-100 dark:bg-green-900/20"
                      : activity.type === "enquiry"
                      ? "bg-purple-100 dark:bg-purple-900/20"
                      : "bg-orange-100 dark:bg-orange-900/20"
                  }`}
                >
                  {activity.type === "property" ? (
                    <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  ) : activity.type === "deal" ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : activity.type === "enquiry" ? (
                    <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-1">{activity.title}</p>
                  <p className="text-sm text-muted-foreground mb-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.user} • {activity.time}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
