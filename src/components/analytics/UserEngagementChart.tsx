import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from "recharts";
import { Users, Eye, MessageCircle, Calendar } from "lucide-react";

const engagementData = [
  { 
    day: 'Mon',
    activeUsers: 2400,
    pageViews: 8900,
    messages: 145,
    appointments: 23,
    avgSessionTime: 4.2 
  },
  { 
    day: 'Tue',
    activeUsers: 2800,
    pageViews: 9500,
    messages: 168,
    appointments: 31,
    avgSessionTime: 4.8 
  },
  { 
    day: 'Wed',
    activeUsers: 3200,
    pageViews: 11200,
    messages: 192,
    appointments: 28,
    avgSessionTime: 5.1 
  },
  { 
    day: 'Thu',
    activeUsers: 3600,
    pageViews: 12100,
    messages: 215,
    appointments: 35,
    avgSessionTime: 5.3 
  },
  { 
    day: 'Fri',
    activeUsers: 4100,
    pageViews: 13800,
    messages: 243,
    appointments: 42,
    avgSessionTime: 5.7 
  },
  { 
    day: 'Sat',
    activeUsers: 3800,
    pageViews: 10200,
    messages: 189,
    appointments: 38,
    avgSessionTime: 6.2 
  },
  { 
    day: 'Sun',
    activeUsers: 2900,
    pageViews: 7800,
    messages: 132,
    appointments: 25,
    avgSessionTime: 5.9 
  }
];

const topPages = [
  { page: 'Property Listings', views: 45230, bounce: 32.1, avgTime: '3:24' },
  { page: 'Home Page', views: 38910, bounce: 28.5, avgTime: '2:18' },
  { page: 'Property Details', views: 29580, bounce: 24.8, avgTime: '4:52' },
  { page: 'Agent Profiles', views: 18650, bounce: 35.2, avgTime: '2:45' },
  { page: 'Contact Forms', views: 12340, bounce: 18.9, avgTime: '5:12' }
];

interface UserEngagementChartProps {
  className?: string;
}

export function UserEngagementChart({ className }: UserEngagementChartProps) {
  const totalActiveUsers = engagementData.reduce((sum, day) => sum + day.activeUsers, 0);
  const totalPageViews = engagementData.reduce((sum, day) => sum + day.pageViews, 0);
  const totalMessages = engagementData.reduce((sum, day) => sum + day.messages, 0);
  const totalAppointments = engagementData.reduce((sum, day) => sum + day.appointments, 0);

  const avgSessionTime = engagementData.reduce((sum, day) => sum + day.avgSessionTime, 0) / engagementData.length;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'avgSessionTime' ? `${entry.value} min` : formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            User Engagement Analytics
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            <Eye className="h-3 w-3" />
            This Week
          </Badge>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="h-4 w-4 text-purple-600 mr-1" />
            </div>
            <p className="text-lg font-bold text-purple-600">{formatNumber(totalActiveUsers)}</p>
            <p className="text-xs text-muted-foreground">Active Users</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Eye className="h-4 w-4 text-blue-600 mr-1" />
            </div>
            <p className="text-lg font-bold text-blue-600">{formatNumber(totalPageViews)}</p>
            <p className="text-xs text-muted-foreground">Page Views</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <MessageCircle className="h-4 w-4 text-green-600 mr-1" />
            </div>
            <p className="text-lg font-bold text-green-600">{totalMessages}</p>
            <p className="text-xs text-muted-foreground">Messages Sent</p>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="h-4 w-4 text-orange-600 mr-1" />
            </div>
            <p className="text-lg font-bold text-orange-600">{totalAppointments}</p>
            <p className="text-xs text-muted-foreground">Appointments</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Main Engagement Chart */}
        <div className="h-[350px] w-full mb-6">
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">Daily Active Users & Page Views</h4>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="day" 
                className="text-xs"
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="left"
                className="text-xs"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => formatNumber(value)}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                className="text-xs"
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}min`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                yAxisId="left"
                dataKey="activeUsers" 
                fill="#8b5cf6" 
                name="Active Users"
                radius={[2, 2, 0, 0]}
                opacity={0.8}
              />
              <Bar 
                yAxisId="left"
                dataKey="pageViews" 
                fill="#3b82f6" 
                name="Page Views"
                radius={[2, 2, 0, 0]}
                opacity={0.6}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgSessionTime"
                stroke="#22c55e"
                strokeWidth={3}
                name="Avg Session Time"
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Activities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Messages & Appointments */}
          <div className="h-[200px] w-full">
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Messages & Appointments</h4>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="day" 
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
                  formatter={(value, name) => [value, name === 'messages' ? 'Messages' : 'Appointments']}
                />
                <Bar dataKey="messages" fill="#22c55e" name="messages" radius={[2, 2, 0, 0]} />
                <Bar dataKey="appointments" fill="#f59e0b" name="appointments" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Session Duration Trend */}
          <div className="h-[200px] w-full">
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Average Session Duration</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="day" 
                  className="text-xs"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  className="text-xs"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}min`}
                />
                <Tooltip 
                  formatter={(value) => [`${value} minutes`, 'Session Duration']}
                />
                <Line
                  type="monotone"
                  dataKey="avgSessionTime"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Pages Performance */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Top Performing Pages</h4>
          <div className="space-y-2">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{page.page}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(page.views)} views • {page.avgTime} avg time
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{page.bounce}%</p>
                  <p className="text-xs text-muted-foreground">bounce rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Average Session Time</p>
              <p className="text-xl font-bold text-purple-600">{avgSessionTime.toFixed(1)} min</p>
              <p className="text-xs text-green-600">+12% from last week</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Peak Day</p>
              <p className="text-xl font-bold text-blue-600">Friday</p>
              <p className="text-xs text-muted-foreground">{formatNumber(4100)} active users</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-xl font-bold text-green-600">3.2%</p>
              <p className="text-xs text-green-600">+0.8% from last week</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}