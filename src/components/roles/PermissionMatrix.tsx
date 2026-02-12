import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { 
  Shield, 
  Info, 
  Save, 
  RotateCcw,
  AlertTriangle,
  Lock,
  Eye,
  Edit,
  Trash2,
  Users,
  Settings,
  Database,
  FileText,
  DollarSign,
  Home,
  MessageCircle,
  Calendar
} from "lucide-react";

const permissionCategories = [
  {
    name: "Core System",
    icon: Database,
    permissions: [
      {
        key: "read",
        name: "Read Access",
        description: "View system data and information",
        level: "basic"
      },
      {
        key: "write",
        name: "Write Access", 
        description: "Create and modify data",
        level: "intermediate"
      },
      {
        key: "delete",
        name: "Delete Access",
        description: "Remove data from the system",
        level: "advanced"
      },
      {
        key: "admin",
        name: "Admin Access",
        description: "Full administrative control",
        level: "critical"
      }
    ]
  },
  {
    name: "User Management",
    icon: Users,
    permissions: [
      {
        key: "view_users",
        name: "View Users",
        description: "See user profiles and basic information",
        level: "basic"
      },
      {
        key: "manage_users",
        name: "Manage Users",
        description: "Create, edit, and deactivate user accounts",
        level: "advanced"
      },
      {
        key: "manage_roles",
        name: "Manage Roles",
        description: "Assign and modify user roles and permissions",
        level: "critical"
      }
    ]
  },
  {
    name: "Property Management",
    icon: Home,
    permissions: [
      {
        key: "view_properties",
        name: "View Properties",
        description: "Access property listings and details",
        level: "basic"
      },
      {
        key: "manage_properties",
        name: "Manage Properties",
        description: "Add, edit, and remove property listings",
        level: "intermediate"
      },
      {
        key: "property_financials",
        name: "Property Financials",
        description: "Access financial data and pricing information",
        level: "advanced"
      }
    ]
  },
  {
    name: "Client Relations",
    icon: MessageCircle,
    permissions: [
      {
        key: "view_clients",
        name: "View Clients",
        description: "Access client contact information",
        level: "basic"
      },
      {
        key: "manage_clients",
        name: "Manage Clients",
        description: "Create and update client profiles",
        level: "intermediate"
      },
      {
        key: "client_communications",
        name: "Client Communications",
        description: "Send messages and schedule appointments",
        level: "intermediate"
      }
    ]
  },
  {
    name: "Analytics & Reports",
    icon: FileText,
    permissions: [
      {
        key: "view_analytics",
        name: "View Analytics",
        description: "Access dashboards and basic reports",
        level: "basic"
      },
      {
        key: "advanced_analytics",
        name: "Advanced Analytics",
        description: "Access detailed reports and export data",
        level: "intermediate"
      },
      {
        key: "financial_reports",
        name: "Financial Reports", 
        description: "View sensitive financial analytics",
        level: "advanced"
      }
    ]
  },
  {
    name: "System Settings",
    icon: Settings,
    permissions: [
      {
        key: "system_settings",
        name: "System Settings",
        description: "Modify application configuration",
        level: "critical"
      },
      {
        key: "audit",
        name: "Audit Logs",
        description: "View system audit trails and logs",
        level: "advanced"
      },
      {
        key: "backup_restore",
        name: "Backup & Restore",
        description: "Manage system backups and data recovery",
        level: "critical"
      }
    ]
  }
];

const getPermissionLevelColor = (level: string) => {
  switch (level) {
    case "basic": return "text-green-600 bg-green-100 dark:bg-green-950/20";
    case "intermediate": return "text-blue-600 bg-blue-100 dark:bg-blue-950/20";
    case "advanced": return "text-orange-600 bg-orange-100 dark:bg-orange-950/20";
    case "critical": return "text-red-600 bg-red-100 dark:bg-red-950/20";
    default: return "text-gray-600 bg-gray-100 dark:bg-gray-950/20";
  }
};

const getPermissionIcon = (level: string) => {
  switch (level) {
    case "basic": return Eye;
    case "intermediate": return Edit;
    case "advanced": return Shield;
    case "critical": return Lock;
    default: return Info;
  }
};

interface PermissionMatrixProps {
  selectedRole: any;
  onRoleUpdate: (role: any) => void;
}

export function PermissionMatrix({ selectedRole, onRoleUpdate }: PermissionMatrixProps) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>(
    () => {
      const initialState: Record<string, boolean> = {};
      permissionCategories.forEach(category => {
        category.permissions.forEach(permission => {
          initialState[permission.key] = selectedRole.permissions.includes(permission.key);
        });
      });
      return initialState;
    }
  );
  
  const [hasChanges, setHasChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingChange, setPendingChange] = useState<{key: string, value: boolean} | null>(null);

  const handlePermissionChange = (key: string, value: boolean) => {
    // Check if this is a critical permission change
    const permission = permissionCategories
      .flatMap(cat => cat.permissions)
      .find(p => p.key === key);
    
    if (permission?.level === "critical" && value) {
      setPendingChange({ key, value });
      setShowConfirmDialog(true);
      return;
    }

    setPermissions(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const confirmCriticalChange = () => {
    if (pendingChange) {
      setPermissions(prev => ({ ...prev, [pendingChange.key]: pendingChange.value }));
      setHasChanges(true);
    }
    setShowConfirmDialog(false);
    setPendingChange(null);
  };

  const handleSave = () => {
    const updatedPermissions = Object.entries(permissions)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key);
    
    const updatedRole = {
      ...selectedRole,
      permissions: updatedPermissions
    };
    
    onRoleUpdate(updatedRole);
    setHasChanges(false);
  };

  const handleReset = () => {
    const resetState: Record<string, boolean> = {};
    permissionCategories.forEach(category => {
      category.permissions.forEach(permission => {
        resetState[permission.key] = selectedRole.permissions.includes(permission.key);
      });
    });
    setPermissions(resetState);
    setHasChanges(false);
  };

  const getEnabledCount = (categoryPermissions: any[]) => {
    return categoryPermissions.filter(p => permissions[p.key]).length;
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Permission Matrix
              </CardTitle>
              <Badge className={`${selectedRole.color} text-white border-none`}>
                {selectedRole.name}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <>
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure permissions for the <strong>{selectedRole.name}</strong> role. 
            Changes marked as critical will require additional confirmation.
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {permissionCategories.map((category) => {
              const CategoryIcon = category.icon;
              const enabledCount = getEnabledCount(category.permissions);
              const totalCount = category.permissions.length;
              
              return (
                <div key={category.name} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CategoryIcon className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium">{category.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {enabledCount}/{totalCount} enabled
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.permissions.map((permission) => {
                      const PermissionIcon = getPermissionIcon(permission.level);
                      const isEnabled = permissions[permission.key];
                      
                      return (
                        <div
                          key={permission.key}
                          className={`p-4 rounded-lg border transition-all ${
                            isEnabled 
                              ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/10' 
                              : 'border-border hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <PermissionIcon className={`h-4 w-4 ${
                                  permission.level === 'critical' ? 'text-red-500' :
                                  permission.level === 'advanced' ? 'text-orange-500' :
                                  permission.level === 'intermediate' ? 'text-blue-500' :
                                  'text-green-500'
                                }`} />
                                <span className="font-medium text-sm">{permission.name}</span>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">{permission.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              
                              <p className="text-xs text-muted-foreground mb-3">
                                {permission.description}
                              </p>
                              
                              <Badge className={`text-xs ${getPermissionLevelColor(permission.level)}`}>
                                {permission.level}
                                {permission.level === 'critical' && (
                                  <AlertTriangle className="h-3 w-3 ml-1" />
                                )}
                              </Badge>
                            </div>
                            
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={(value) => handlePermissionChange(permission.key, value)}
                              className="ml-3"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Permission Summary */}
          <div className="mt-8 p-4 bg-muted/30 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Permission Summary
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Permissions</p>
                <p className="font-medium">{Object.values(permissions).filter(Boolean).length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Critical Access</p>
                <p className="font-medium text-red-600">
                  {permissionCategories
                    .flatMap(cat => cat.permissions)
                    .filter(p => p.level === 'critical' && permissions[p.key])
                    .length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Advanced Access</p>
                <p className="font-medium text-orange-600">
                  {permissionCategories
                    .flatMap(cat => cat.permissions)
                    .filter(p => p.level === 'advanced' && permissions[p.key])
                    .length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Basic Access</p>
                <p className="font-medium text-green-600">
                  {permissionCategories
                    .flatMap(cat => cat.permissions)
                    .filter(p => p.level === 'basic' && permissions[p.key])
                    .length}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Permission Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Permission Change
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to grant a critical system permission. This action could provide 
              significant access to sensitive system functions. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingChange(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCriticalChange} className="bg-red-600 hover:bg-red-700">
              Confirm Critical Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}