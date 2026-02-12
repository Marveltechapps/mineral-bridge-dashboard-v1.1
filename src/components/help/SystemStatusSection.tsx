import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { 
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Server,
  Database,
  Globe,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Bell,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react";

const systemComponents = [
  {
    id: "api",
    name: "API Services",
    status: "operational",
    uptime: 99.98,
    responseTime: 145,
    icon: Server,
    description: "Core application programming interface"
  },
  {
    id: "database",
    name: "Database",
    status: "operational", 
    uptime: 99.95,
    responseTime: 89,
    icon: Database,
    description: "Primary data storage systems"
  },
  {
    id: "web",
    name: "Web Application",
    status: "operational",
    uptime: 99.97,
    responseTime: 267,
    icon: Globe,
    description: "Main web interface and frontend"
  },
  {
    id: "auth",
    name: "Authentication",
    status: "degraded",
    uptime: 98.92,
    responseTime: 892,
    icon: Shield,
    description: "User login and security services"
  },
  {
    id: "storage",
    name: "File Storage",
    status: "operational",
    uptime: 99.99,
    responseTime: 234,
    icon: Database,
    description: "Document and media storage"
  },
  {
    id: "notifications",
    name: "Notifications",
    status: "operational",
    uptime: 99.94,
    responseTime: 178,
    icon: Bell,
    description: "Email and push notification services"
  }
];

const recentIncidents = [
  {
    id: "1",
    title: "Authentication Service Degradation",
    description: "Users may experience slower login times due to increased traffic",
    status: "investigating",
    severity: "minor",
    startTime: "2024-01-15T14:30:00Z",
    lastUpdate: "2024-01-15T15:45:00Z",
    affectedServices: ["auth"]
  },
  {
    id: "2", 
    title: "Scheduled Database Maintenance",
    description: "Routine maintenance to improve performance and reliability",
    status: "scheduled",
    severity: "maintenance",
    startTime: "2024-01-20T02:00:00Z",
    endTime: "2024-01-20T04:00:00Z",
    affectedServices: ["database", "api"]
  },
  {
    id: "3",
    title: "File Upload Issues Resolved",
    description: "Temporary issues with file uploads have been fully resolved",
    status: "resolved",
    severity: "minor",
    startTime: "2024-01-14T10:15:00Z",
    endTime: "2024-01-14T11:30:00Z",
    affectedServices: ["storage"]
  }
];

const systemMetrics = [
  {
    name: "Overall Uptime",
    value: 99.96,
    target: 99.9,
    trend: "up",
    period: "30 days"
  },
  {
    name: "Average Response Time",
    value: 234,
    target: 300,
    trend: "down",
    period: "24 hours",
    unit: "ms"
  },
  {
    name: "Error Rate",
    value: 0.02,
    target: 0.1,
    trend: "stable",
    period: "7 days",
    unit: "%"
  },
  {
    name: "Incidents This Month",
    value: 2,
    target: 5,
    trend: "down",
    period: "January 2024"
  }
];

const recentUpdates = [
  {
    id: "1",
    version: "v2.4.1",
    title: "Performance Improvements & Bug Fixes",
    date: "2024-01-14",
    type: "patch",
    features: [
      "Improved dashboard loading times by 40%",
      "Fixed issue with property image uploads",
      "Enhanced mobile responsiveness",
      "Updated security dependencies"
    ]
  },
  {
    id: "2",
    version: "v2.4.0", 
    title: "New Analytics Features",
    date: "2024-01-08",
    type: "feature",
    features: [
      "Added regional heatmap visualization",
      "New user engagement metrics",
      "Enhanced export functionality",
      "Dark mode support for analytics"
    ]
  },
  {
    id: "3",
    version: "v2.3.2",
    title: "Security Enhancement",
    date: "2024-01-01",
    type: "security",
    features: [
      "Strengthened API authentication",
      "Enhanced data encryption",
      "Improved audit logging",
      "Updated third-party dependencies"
    ]
  }
];

export function SystemStatusSection() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-green-600 bg-green-100 dark:bg-green-950/20";
      case "degraded": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950/20";
      case "outage": return "text-red-600 bg-red-100 dark:bg-red-950/20";
      case "maintenance": return "text-blue-600 bg-blue-100 dark:bg-blue-950/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-950/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return CheckCircle;
      case "degraded": return AlertTriangle;
      case "outage": return XCircle;
      case "maintenance": return Clock;
      default: return Minus;
    }
  };

  const getIncidentStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "text-green-600 bg-green-100 dark:bg-green-950/20";
      case "investigating": return "text-orange-600 bg-orange-100 dark:bg-orange-950/20";
      case "identified": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-950/20";
      case "monitoring": return "text-blue-600 bg-blue-100 dark:bg-blue-950/20";
      case "scheduled": return "text-purple-600 bg-purple-100 dark:bg-purple-950/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-950/20";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return TrendingUp;
      case "down": return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string, isGood: boolean) => {
    if (trend === "stable") return "text-gray-600";
    const positive = (trend === "up" && isGood) || (trend === "down" && !isGood);
    return positive ? "text-green-600" : "text-red-600";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case "feature": return "text-blue-600 bg-blue-100 dark:bg-blue-950/20";
      case "security": return "text-red-600 bg-red-100 dark:bg-red-950/20";
      case "patch": return "text-green-600 bg-green-100 dark:bg-green-950/20";
      default: return "text-gray-600 bg-gray-100 dark:bg-gray-950/20";
    }
  };

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // Here you would trigger a data refresh
  };

  const overallStatus = systemComponents.every(component => component.status === "operational") 
    ? "operational" 
    : systemComponents.some(component => component.status === "outage")
    ? "outage"
    : "degraded";

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className={`border-l-4 ${
        overallStatus === "operational" ? "border-l-green-500 bg-green-50/50 dark:bg-green-950/10" :
        overallStatus === "degraded" ? "border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/10" :
        "border-l-red-500 bg-red-50/50 dark:bg-red-950/10"
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getStatusColor(overallStatus)}`}>
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {overallStatus === "operational" ? "All Systems Operational" :
                   overallStatus === "degraded" ? "Some Systems Degraded" :
                   "System Outage"}
                </CardTitle>
                <p className="text-muted-foreground">
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                Subscribe
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemMetrics.map((metric) => {
              const TrendIcon = getTrendIcon(metric.trend);
              const isGoodMetric = metric.name === "Overall Uptime";
              
              return (
                <div key={metric.name} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-2xl font-bold">
                      {metric.value}
                      {metric.unit && <span className="text-sm">{metric.unit}</span>}
                    </span>
                    <TrendIcon className={`h-4 w-4 ${getTrendColor(metric.trend, isGoodMetric)}`} />
                  </div>
                  <p className="text-sm font-medium">{metric.name}</p>
                  <p className="text-xs text-muted-foreground">{metric.period}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Components */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              System Components
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {systemComponents.filter(c => c.status === "operational").length}/{systemComponents.length} Operational
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemComponents.map((component) => {
              const StatusIcon = getStatusIcon(component.status);
              const ComponentIcon = component.icon;
              
              return (
                <div key={component.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <ComponentIcon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{component.name}</h4>
                        <p className="text-sm text-muted-foreground">{component.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Uptime:</span>
                        <span className="font-medium">{component.uptime}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Response:</span>
                        <span className="font-medium">{component.responseTime}ms</span>
                      </div>
                    </div>
                    
                    <Badge className={`gap-1 ${getStatusColor(component.status)}`}>
                      <StatusIcon className="h-3 w-3" />
                      {component.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Recent Incidents & Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentIncidents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600 opacity-50" />
              <p>No recent incidents to report</p>
              <p className="text-sm">All systems are running smoothly</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{incident.title}</h4>
                        <Badge className={`text-xs ${getIncidentStatusColor(incident.status)}`}>
                          {incident.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {incident.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Started: {formatDate(incident.startTime)}</span>
                        {incident.endTime && (
                          <span>Ended: {formatDate(incident.endTime)}</span>
                        )}
                        <span>Duration: {formatDuration(incident.startTime, incident.endTime)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {incident.affectedServices.map((service) => {
                        const component = systemComponents.find(c => c.id === service);
                        return (
                          <Badge key={service} variant="secondary" className="text-xs">
                            {component?.name || service}
                          </Badge>
                        );
                      })}
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUpdates.map((update) => (
              <div key={update.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{update.version}</Badge>
                    <Badge className={`text-xs ${getUpdateTypeColor(update.type)}`}>
                      {update.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{update.date}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Download className="h-3 w-3" />
                    Notes
                  </Button>
                </div>
                
                <h4 className="font-medium mb-2">{update.title}</h4>
                <ul className="space-y-1">
                  {update.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Page Links */}
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <h3 className="font-medium mb-2">Need More Information?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Visit our dedicated status page for detailed system monitoring and historical data.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Status Page
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Maintenance Schedule
            </Button>
            <Button className="gap-2">
              <Bell className="h-4 w-4" />
              Subscribe to Updates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}