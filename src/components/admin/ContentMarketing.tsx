import { useState } from "react";
import { 
  Megaphone, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Edit,
  Plus,
  Bell,
  TrendingUp,
  BarChart,
  Calendar
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { useDashboardStore } from "../../store/dashboardStore";

export function ContentMarketing() {
  const { state } = useDashboardStore();
  const banners = [
    {
      id: 1,
      title: "Sustainable Mining Conference",
      status: "Active",
      clicks: 450,
      image: "https://images.unsplash.com/photo-1599831154342-998816c29b4e?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "New Cobalt Compliance Standards",
      status: "Scheduled",
      clicks: 0,
      image: "https://images.unsplash.com/photo-1591197699044-88484f4757c9?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Content & Marketing</h1>
          <p className="text-muted-foreground">Manage banners, notifications, and market insights.</p>
          <p className="text-xs text-muted-foreground mt-1">Target audience: <span className="font-medium text-emerald-600">{state.registryUsers.length}</span> users (from User Management registry)</p>
        </div>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="banners" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Banners & Ads</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Push Notifications</TabsTrigger>
          <TabsTrigger value="insights" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Upload New Banner
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {banners.map((banner) => (
              <Card key={banner.id} className="border-none shadow-sm overflow-hidden">
                <div className="h-40 w-full relative">
                  <img 
                    src={banner.image} 
                    alt={banner.title} 
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-2 right-2 ${
                    banner.status === 'Active' ? 'bg-emerald-600' : 'bg-amber-600'
                  }`}>
                    {banner.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{banner.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <BarChart className="w-3 h-3" />
                        {banner.clicks} clicks this week
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Expires: Dec 31, 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="max-w-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle>Send Broadcast Notification</CardTitle>
              <CardDescription>Send alerts to user groups via app or email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Notification title" />
              </div>
              <div className="space-y-2">
                <Label>Message Body</Label>
                <Textarea placeholder="Type your message here..." />
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="buyers" />
                    <Label htmlFor="buyers">Buyers</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="sellers" />
                    <Label htmlFor="sellers">Sellers</Label>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Bell className="w-4 h-4" />
                Send Notification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
           <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Trending Minerals Config</CardTitle>
              <CardDescription>Highlight minerals on the user dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Lithium Carbonate', 'Copper Cathodes', 'Rare Earth Oxides'].map((mineral, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium">{mineral}</span>
                    </div>
                    <Switch checked={true} />
                  </div>
                ))}
                <Button variant="outline" className="w-full gap-2">
                  <Plus className="w-4 h-4" />
                  Add Trending Item
                </Button>
              </div>
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}