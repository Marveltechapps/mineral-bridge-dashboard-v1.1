import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Eye, 
  Shield,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Home,
  Users,
  BarChart3,
  Settings,
  Database,
  FileText,
  MessageCircle,
  Crown,
  UserPlus,
  AlertTriangle
} from "lucide-react";

const systemFeatures = [
  {
    category: "Dashboard",
    icon: Home,
    features: [
      { name: "View Dashboard", permission: "read", description: "Access main dashboard overview" },
      { name: "Customize Dashboard", permission: "write", description: "Modify dashboard layout and widgets" },
      { name: "Export Dashboard Data", permission: "advanced_analytics", description: "Export dashboard metrics" }
    ]
  },
  {
    category: "Property Management", 
    icon: Home,
    features: [
      { name: "View Properties", permission: "view_properties", description: "Browse property listings" },
      { name: "Add Properties", permission: "manage_properties", description: "Create new property listings" },
      { name: "Edit Properties", permission: "manage_properties", description: "Modify existing properties" },
      { name: "Delete Properties", permission: "delete", description: "Remove property listings" },
      { name: "Property Financials", permission: "property_financials", description: "Access pricing and financial data" }
    ]
  },
  {
    category: "User Management",
    icon: Users,
    features: [
      { name: "View Users", permission: "view_users", description: "See user profiles and information" },
      { name: "Create Users", permission: "manage_users", description: "Add new user accounts" },
      { name: "Edit Users", permission: "manage_users", description: "Modify user profiles" },
      { name: "Deactivate Users", permission: "manage_users", description: "Disable user accounts" },
      { name: "Manage Roles", permission: "manage_roles", description: "Assign and modify user roles" }
    ]
  },
  {
    category: "Client Relations",
    icon: MessageCircle,
    features: [
      { name: "View Clients", permission: "view_clients", description: "Access client contact information" },
      { name: "Manage Clients", permission: "manage_clients", description: "Create and update client profiles" },
      { name: "Client Communications", permission: "client_communications", description: "Send messages and schedule meetings" },
      { name: "View Client History", permission: "view_clients", description: "Access client interaction history" }
    ]
  },
  {
    category: "Analytics & Reports",
    icon: BarChart3,
    features: [
      { name: "View Analytics", permission: "view_analytics", description: "Access basic dashboards and reports" },
      { name: "Advanced Analytics", permission: "advanced_analytics", description: "Access detailed reports and export data" },
      { name: "Financial Reports", permission: "financial_reports", description: "View sensitive financial analytics" },
      { name: "Export Data", permission: "advanced_analytics", description: "Export reports and data" }
    ]
  },
  {
    category: "System Administration",
    icon: Settings,
    features: [
      { name: "System Settings", permission: "system_settings", description: "Modify application configuration" },
      { name: "View Audit Logs", permission: "audit", description: "Access system audit trails" },
      { name: "Backup & Restore", permission: "backup_restore", description: "Manage system backups" },
      { name: "System Monitoring", permission: "admin", description: "Monitor system performance" }
    ]
  }
];

const getAccessLevel = (hasPermission: boolean, permission: string) => {
  if (!hasPermission) return { level: "denied", color: "text-red-600", icon: XCircle };
  
  const criticalPermissions = ["admin", "manage_roles", "system_settings", "backup_restore"];
  const advancedPermissions = ["delete", "manage_users", "financial_reports", "audit"];
  
  if (criticalPermissions.includes(permission)) {
    return { level: "critical", color: "text-red-600", icon: Lock };
  } else if (advancedPermissions.includes(permission)) {
    return { level: "advanced", color: "text-orange-600", icon: Shield };
  } else {
    return { level: "granted", color: "text-green-600", icon: CheckCircle };
  }
};

interface AccessPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: any;
}

export function AccessPreview({ isOpen, onClose, selectedRole }: AccessPreviewProps) {
  const [activeTab, setActiveTab] = useState("features");

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case "1": return Crown;
      case "2": return Shield;
      case "3": return Users;
      case "4": return UserPlus;
      case "5": return Eye;
      default: return Users;
    }
  };

  const hasPermission = (permission: string) => {
    return selectedRole.permissions.includes(permission);
  };

  const getPermissionSummary = () => {
    const total = systemFeatures.reduce((sum, category) => sum + category.features.length, 0);
    const granted = systemFeatures.reduce((sum, category) => 
      sum + category.features.filter(feature => hasPermission(feature.permission)).length, 0
    );
    const denied = total - granted;
    
    const critical = systemFeatures.reduce((sum, category) =>
      sum + category.features.filter(feature => {
        const access = getAccessLevel(hasPermission(feature.permission), feature.permission);
        return access.level === "critical";
      }).length, 0
    );

    return { total, granted, denied, critical };
  };

  const summary = getPermissionSummary();
  const RoleIcon = getRoleIcon(selectedRole.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Access Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Role Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={`${selectedRole.color} text-white border-none gap-1`}>
                    <RoleIcon className="h-4 w-4" />
                    {selectedRole.name}
                  </Badge>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{selectedRole.userCount} users</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <p className="text-lg font-bold text-green-600">{summary.granted}</p>
                  <p className="text-xs text-muted-foreground">Granted</p>
                </div>
                <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <p className="text-lg font-bold text-red-600">{summary.denied}</p>
                  <p className="text-xs text-muted-foreground">Denied</p>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <p className="text-lg font-bold text-orange-600">{summary.critical}</p>
                  <p className="text-xs text-muted-foreground">Critical Access</p>
                </div>
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">{Math.round((summary.granted / summary.total) * 100)}%</p>
                  <p className="text-xs text-muted-foreground">Coverage</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-auto md:grid-cols-3 mb-6 h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
              <TabsTrigger value="features" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
                <Home className="h-4 w-4" />
                Feature Access
              </TabsTrigger>
              <TabsTrigger value="permissions" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
                <Shield className="h-4 w-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="restrictions" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
                <Lock className="h-4 w-4" />
                Restrictions
              </TabsTrigger>
            </TabsList>

            {/* Feature Access Tab */}
            <TabsContent value="features" className="space-y-6">
              {systemFeatures.map((category) => {
                const CategoryIcon = category.icon;
                const grantedFeatures = category.features.filter(f => hasPermission(f.permission));
                
                return (
                  <Card key={category.category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-blue-600" />
                        {category.category}
                        <Badge variant="outline" className="ml-2">
                          {grantedFeatures.length}/{category.features.length} accessible
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {category.features.map((feature) => {
                          const access = getAccessLevel(hasPermission(feature.permission), feature.permission);
                          const AccessIcon = access.icon;
                          
                          return (
                            <div
                              key={feature.name}
                              className={`p-3 rounded-lg border ${
                                access.level === "denied" 
                                  ? "border-red-200 bg-red-50 dark:bg-red-950/10" 
                                  : access.level === "critical"
                                  ? "border-red-300 bg-red-50 dark:bg-red-950/20"
                                  : access.level === "advanced"
                                  ? "border-orange-300 bg-orange-50 dark:bg-orange-950/20"
                                  : "border-green-200 bg-green-50 dark:bg-green-950/10"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <AccessIcon className={`h-4 w-4 ${access.color}`} />
                                    <span className="font-medium text-sm">{feature.name}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs mt-2 ${access.color}`}
                                  >
                                    {access.level === "denied" ? "Access Denied" :
                                     access.level === "critical" ? "Critical Access" :
                                     access.level === "advanced" ? "Advanced Access" :
                                     "Access Granted"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            {/* Permissions Tab */}
            <TabsContent value="permissions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      "read", "write", "delete", "admin", "audit", "manage_users", "manage_roles",
                      "view_properties", "manage_properties", "property_financials",
                      "view_clients", "manage_clients", "client_communications",
                      "view_analytics", "advanced_analytics", "financial_reports",
                      "system_settings", "backup_restore", "view_users"
                    ].map((permission) => {
                      const granted = hasPermission(permission);
                      const access = getAccessLevel(granted, permission);
                      const AccessIcon = access.icon;
                      
                      return (
                        <div
                          key={permission}
                          className={`p-3 rounded-lg border flex items-center gap-2 ${
                            granted ? "border-green-200 bg-green-50 dark:bg-green-950/10" : "border-gray-200"
                          }`}
                        >
                          <AccessIcon className={`h-4 w-4 ${access.color}`} />
                          <span className="text-sm font-medium">{permission}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Restrictions Tab */}
            <TabsContent value="restrictions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-red-600" />
                    Access Restrictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemFeatures.map((category) => {
                      const deniedFeatures = category.features.filter(f => !hasPermission(f.permission));
                      
                      if (deniedFeatures.length === 0) return null;
                      
                      const CategoryIcon = category.icon;
                      
                      return (
                        <div key={category.category} className="border-l-4 border-red-500 pl-4">
                          <h4 className="font-medium flex items-center gap-2 mb-2">
                            <CategoryIcon className="h-4 w-4" />
                            {category.category}
                            <Badge variant="destructive" className="text-xs">
                              {deniedFeatures.length} restricted
                            </Badge>
                          </h4>
                          <div className="space-y-2">
                            {deniedFeatures.map((feature) => (
                              <div key={feature.name} className="flex items-center gap-2 text-sm">
                                <XCircle className="h-3 w-3 text-red-600" />
                                <span className="text-muted-foreground">{feature.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    
                    {summary.denied === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Unlock className="h-12 w-12 mx-auto mb-4 text-green-600 opacity-50" />
                        <p>This role has no access restrictions.</p>
                        <p className="text-sm">All system features are accessible.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Security Warnings */}
              {summary.critical > 0 && (
                <Card className="border-red-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="h-5 w-5" />
                      Security Notice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p className="text-red-600 font-medium">
                        This role has {summary.critical} critical system permissions.
                      </p>
                      <p className="text-muted-foreground">
                        Users with this role can perform sensitive operations that may affect system security 
                        and data integrity. Regular auditing and monitoring is recommended.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}