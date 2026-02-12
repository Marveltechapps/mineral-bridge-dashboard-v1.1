import { useMemo } from "react";
import { 
  Download, 
  Calendar,
  BarChart2,
  PieChart,
  LineChart,
  TrendingUp,
  Map,
  Users
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { useDashboardStore } from "../../store/dashboardStore";

export function AnalyticsInsights() {
  const { state } = useDashboardStore();
  const volumeSum = useMemo(
    () =>
      state.transactions.reduce((s, t) => s + (parseFloat(t.finalAmount.replace(/[^0-9.-]/g, "")) || 0), 0),
    [state.transactions]
  );
  const totalUsers = state.registryUsers.length;
  const usersUnderReview = state.registryUsers.filter((u) => u.status === "Under Review" || u.status === "Not Submitted").length;
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics & Insights</h1>
          <p className="text-muted-foreground">Market trends, user behavior, and platform performance.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Trading Volume Chart Placeholder */}
        <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Trading Volume Trends</CardTitle>
            <CardDescription>Daily transaction volume in USD.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden group">
               {/* Mock Chart Visualization */}
               <div className="absolute inset-0 flex items-end justify-between px-6 pb-6 pt-12 gap-2">
                 {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                   <div key={i} className="flex-1 bg-emerald-500/20 rounded-t-sm relative group-hover:bg-emerald-500/30 transition-all">
                     <div 
                        className="absolute bottom-0 left-0 right-0 bg-emerald-600 rounded-t-sm transition-all duration-500 ease-out"
                        style={{ height: `${h}%` }}
                     />
                   </div>
                 ))}
               </div>
               <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/50 px-2 py-1 rounded text-xs font-mono font-medium backdrop-blur">
                 Volume: {volumeSum >= 1e6 ? `$${(volumeSum / 1e6).toFixed(2)}M` : `$${volumeSum.toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
               </div>
            </div>
          </CardContent>
        </Card>

        {/* User Registry (from User Management) */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Registry Users</CardTitle>
            <CardDescription>Linked from User Management.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            <div className="text-center">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">{totalUsers}</span>
              <p className="text-xs text-muted-foreground mt-1">Total users</p>
              {usersUnderReview > 0 && (
                <p className="text-xs text-amber-600 mt-2">{usersUnderReview} need verification</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Mineral Categories</CardTitle>
            <CardDescription>Market share by volume.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4">
            <div className="relative w-48 h-48 rounded-full border-[16px] border-emerald-500 border-r-blue-500 border-b-amber-500 border-l-purple-500 flex items-center justify-center">
              <div className="text-center">
                <span className="text-2xl font-bold">12</span>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
            <div className="w-full mt-8 space-y-3">
              {[
                { label: "Battery Metals", color: "bg-emerald-500", val: "45%" },
                { label: "Ferrous Metals", color: "bg-blue-500", val: "25%" },
                { label: "Precious Metals", color: "bg-amber-500", val: "20%" },
                { label: "Rare Earths", color: "bg-purple-500", val: "10%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="font-medium">{item.val}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>High Value Users</CardTitle>
            <CardDescription>Top trading partners by volume.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Volume</TableHead>
                    <TableHead className="text-right">Trades</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Global Steel Corp", vol: "$12.5M", trades: 45 },
                    { name: "Tesla Supply", vol: "$8.2M", trades: 22 },
                    { name: "CATL Materials", vol: "$6.8M", trades: 31 },
                    { name: "Rio Tinto Sales", vol: "$5.1M", trades: 18 },
                  ].map((u, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">{u.vol}</TableCell>
                      <TableCell className="text-right">{u.trades}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
           <CardHeader>
            <CardTitle>Regional Activity</CardTitle>
            <CardDescription>Active orders by region.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: "Asia Pacific", count: 145, percent: 45 },
                { region: "North America", count: 82, percent: 28 },
                { region: "Europe", count: 54, percent: 18 },
                { region: "Africa", count: 25, percent: 9 },
              ].map((r, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{r.region}</span>
                    <span className="text-muted-foreground">{r.count} orders</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${r.percent}%` }} />
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