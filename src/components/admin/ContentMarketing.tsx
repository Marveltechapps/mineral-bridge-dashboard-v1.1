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
  Calendar,
  Video
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

type VideoItem = {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  description: string;
  duration: string;
  xpReward: string;
};

const defaultVideos: VideoItem[] = [
  { id: "v1", title: "L1 Safety Fundamentals", subtitle: "ASM TRAINING MODULE", videoUrl: "", description: "Mandatory safety protocols for institutional artisanal mining accreditation, covering ventilation and tunnel integrity.", duration: "12 Mins", xpReward: "+15 XP" },
  { id: "v2", title: "", subtitle: "", videoUrl: "", description: "", duration: "", xpReward: "" }
];

export function ContentMarketing() {
  const { state } = useDashboardStore();
  const [artisanalVideos, setArtisanalVideos] = useState<VideoItem[]>(defaultVideos);
  type BannerItem = { id: number; title: string; status: string; clicks: number; image: string };
  const bannerSections: { key: string; title: string; slots: (BannerItem | null)[] }[] = [
    {
      key: "homepage",
      title: "Homepage",
      slots: [
        { id: 1, title: "Sustainable Mining Conference", status: "Active", clicks: 450, image: "https://images.unsplash.com/photo-1599831154342-998816c29b4e?w=800&auto=format&fit=crop&q=60" },
        { id: 2, title: "New Cobalt Compliance Standards", status: "Scheduled", clicks: 0, image: "https://images.unsplash.com/photo-1591197699044-88484f4757c9?w=800&auto=format&fit=crop&q=60" }
      ]
    },
    { key: "buy", title: "Buy banner", slots: [null] },
    { key: "sell", title: "Sell banner", slots: [null] },
    { key: "artisanal", title: "Artisanal miners page", slots: [null, null] }
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
          <TabsTrigger value="videos" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400 gap-2">
            <Video className="w-4 h-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Push Notifications</TabsTrigger>
          <TabsTrigger value="insights" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="banners" className="mt-4 space-y-8">
          {bannerSections.map((section) => (
            <div key={section.key} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">{section.title}</h2>
                <span className="text-xs text-muted-foreground">{section.slots.length} banner{section.slots.length !== 1 ? "s" : ""}</span>
              </div>
              <div className={`grid gap-4 ${section.slots.length === 1 ? "grid-cols-1 max-w-md" : "md:grid-cols-2"}`}>
                {section.slots.map((banner, idx) => (
                  <Card key={`${section.key}-${idx}`} className="border-none shadow-sm overflow-hidden">
                    {banner ? (
                      <>
                        <div className="h-40 w-full relative">
                          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                          <Badge className={`absolute top-2 right-2 ${banner.status === "Active" ? "bg-emerald-600" : "bg-amber-600"}`}>
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
                      </>
                    ) : (
                      <>
                        <div className="h-40 w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                          <ImageIcon className="w-10 h-10 text-slate-400 mb-2" />
                          <p className="text-sm text-muted-foreground">Slot {idx + 1}</p>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-muted-foreground">No banner</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <BarChart className="w-3 h-3" />
                                0 clicks
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8" title="Edit">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" disabled title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">—</span>
                            </div>
                          </div>
                        </CardContent>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="videos" className="mt-4 space-y-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">Artisanal miners page – Videos</h2>
              <p className="text-sm text-muted-foreground mt-1">Training videos shown on the artisanal miners page in the app. Edit below and they will appear in the app.</p>
            </div>
            <div className="space-y-6">
              {artisanalVideos.map((video, idx) => (
                <Card key={video.id} className="border-none shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">Video {idx + 1}</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => setArtisanalVideos((prev) => prev.filter((v) => v.id !== video.id))}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</Label>
                      <Input
                        placeholder="e.g. L1 Safety Fundamentals"
                        value={video.title}
                        onChange={(e) => setArtisanalVideos((prev) => prev.map((v) => (v.id === video.id ? { ...v, title: e.target.value } : v)))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Subtitle / Module type</Label>
                      <Input
                        placeholder="e.g. ASM TRAINING MODULE"
                        value={video.subtitle}
                        onChange={(e) => setArtisanalVideos((prev) => prev.map((v) => (v.id === video.id ? { ...v, subtitle: e.target.value } : v)))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Video URL (embed)</Label>
                      <Input
                        placeholder="https://..."
                        value={video.videoUrl}
                        onChange={(e) => setArtisanalVideos((prev) => prev.map((v) => (v.id === video.id ? { ...v, videoUrl: e.target.value } : v)))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Description (Curriculum summary)</Label>
                      <Textarea
                        placeholder="Mandatory safety protocols for institutional artisanal mining accreditation..."
                        value={video.description}
                        onChange={(e) => setArtisanalVideos((prev) => prev.map((v) => (v.id === video.id ? { ...v, description: e.target.value } : v)))}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</Label>
                        <Input
                          placeholder="e.g. 12 Mins"
                          value={video.duration}
                          onChange={(e) => setArtisanalVideos((prev) => prev.map((v) => (v.id === video.id ? { ...v, duration: e.target.value } : v)))}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">XP Reward</Label>
                        <Input
                          placeholder="e.g. +15 XP"
                          value={video.xpReward}
                          onChange={(e) => setArtisanalVideos((prev) => prev.map((v) => (v.id === video.id ? { ...v, xpReward: e.target.value } : v)))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="gap-2" onClick={() => setArtisanalVideos((prev) => [...prev, { id: `v-${Date.now()}`, title: "", subtitle: "", videoUrl: "", description: "", duration: "", xpReward: "" }])}>
              <Plus className="w-4 h-4" />
              Add video
            </Button>
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