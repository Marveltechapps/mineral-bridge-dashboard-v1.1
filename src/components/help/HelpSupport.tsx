import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { 
  HelpCircle,
  BookOpen,
  MessageCircle,
  Activity,
  Search,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react";

import { FAQSection } from "./FAQSection";
import { TutorialSection } from "./TutorialSection";
import { LiveChatSection } from "./LiveChatSection";
import { SystemStatusSection } from "./SystemStatusSection";

export function HelpSupport() {
  const [activeTab, setActiveTab] = useState("faq");

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="h-7 w-7 text-blue-600" />
            Help & Support
          </h1>
          <p className="text-muted-foreground">
            Find answers, learn features, and get assistance
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Call Support</span>
            <span className="sm:hidden">Call</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email Us</span>
            <span className="sm:hidden">Email</span>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Time</p>
                <p className="text-lg font-bold text-green-600">&lt; 5min</p>
              </div>
              <MessageCircle className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Status</p>
                <p className="text-lg font-bold text-green-600">Operational</p>
              </div>
              <Activity className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Articles</p>
                <p className="text-lg font-bold text-blue-600">150+</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tutorials</p>
                <p className="text-lg font-bold text-purple-600">25+</p>
              </div>
              <HelpCircle className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="faq" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQs</span>
            <span className="sm:hidden">FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Tutorials</span>
            <span className="sm:hidden">Learn</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Live Chat</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">System Status</span>
            <span className="sm:hidden">Status</span>
          </TabsTrigger>
        </TabsList>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <FAQSection />
        </TabsContent>

        {/* Tutorials Tab */}
        <TabsContent value="tutorials" className="space-y-6">
          <TutorialSection />
        </TabsContent>

        {/* Live Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <LiveChatSection />
        </TabsContent>

        {/* System Status Tab */}
        <TabsContent value="status" className="space-y-6">
          <SystemStatusSection />
        </TabsContent>
      </Tabs>

      {/* Floating Contact Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button size="lg" className="rounded-full shadow-lg gap-2">
          <MessageCircle className="h-4 w-4" />
          Help
        </Button>
      </div>
    </div>
  );
}