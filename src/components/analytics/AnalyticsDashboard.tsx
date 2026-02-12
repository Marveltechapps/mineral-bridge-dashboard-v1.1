import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  BarChart3, 
  Moon, 
  Sun, 
  TrendingUp, 
  Calendar,
  Download,
  Settings,
  RefreshCw
} from "lucide-react";

import { AnalyticsFilters } from "./AnalyticsFilters";
import { SalesTrendsChart } from "./SalesTrendsChart";
import { PropertyTypeChart } from "./PropertyTypeChart";
import { RegionalHeatmap } from "./RegionalHeatmap";
import { UserEngagementChart } from "./UserEngagementChart";
import { ScheduleReportModal } from "./ScheduleReportModal";

export function AnalyticsDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const handleFiltersChange = (filters: any) => {
    console.log('Filters changed:', filters);
    // Update charts based on filters
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting data as ${format}...`);
    // Implement export functionality
  };

  const handleScheduleReport = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = (reportConfig: any) => {
    console.log('Scheduling report:', reportConfig);
    // Implement report scheduling logic
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
    console.log('Refreshing analytics data...');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex-1 space-y-6 p-4 md:p-6 ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-blue-600" />
            Analytics & Reporting
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into sales, properties, and user engagement
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Last Updated */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
            <Button variant="ghost" size="sm" onClick={handleRefresh} className="gap-1">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
          
          {/* Auto Refresh Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Auto refresh</span>
            <Switch 
              checked={isAutoRefresh} 
              onCheckedChange={setIsAutoRefresh}
            />
          </div>
          
          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4" />
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={toggleDarkMode}
            />
            <Moon className="h-4 w-4" />
          </div>
          
          {/* Settings */}
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <AnalyticsFilters 
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        onScheduleReport={handleScheduleReport}
      />

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto md:grid-cols-4 mb-6 h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="overview" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="sales" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <BarChart3 className="h-4 w-4" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="properties" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Badge variant="outline" className="ml-2">Properties</Badge>
          </TabsTrigger>
          <TabsTrigger value="engagement" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Badge variant="outline" className="ml-2">Engagement</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">$16.7M</p>
                      <p className="text-xs text-green-600">+12.5% from last month</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Properties Sold</p>
                      <p className="text-2xl font-bold text-blue-600">833</p>
                      <p className="text-xs text-blue-600">+8.3% from last month</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-950/20 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-purple-600">22.8K</p>
                      <p className="text-xs text-purple-600">+15.2% from last month</p>
                    </div>
                    <div className="h-8 w-8 bg-purple-100 dark:bg-purple-950/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Deal Size</p>
                      <p className="text-2xl font-bold text-orange-600">$20.1K</p>
                      <p className="text-xs text-orange-600">+3.7% from last month</p>
                    </div>
                    <div className="h-8 w-8 bg-orange-100 dark:bg-orange-950/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesTrendsChart />
              <PropertyTypeChart />
            </div>
            
            <RegionalHeatmap />
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-6">
            <SalesTrendsChart className="col-span-full" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PropertyTypeChart />
              <RegionalHeatmap />
            </div>
          </div>
        </TabsContent>

        {/* Properties Tab */}
        <TabsContent value="properties" className="space-y-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PropertyTypeChart />
              <RegionalHeatmap />
            </div>
            
            {/* Additional property-specific charts could go here */}
            <Card>
              <CardHeader>
                <CardTitle>Property Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">45 days</p>
                    <p className="text-sm text-muted-foreground">Avg. Time on Market</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">92%</p>
                    <p className="text-sm text-muted-foreground">List to Sale Price Ratio</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">78%</p>
                    <p className="text-sm text-muted-foreground">Properties with Virtual Tours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <UserEngagementChart />
        </TabsContent>
      </Tabs>

      {/* Schedule Report Modal */}
      <ScheduleReportModal 
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleSubmit}
      />
    </div>
  );
}