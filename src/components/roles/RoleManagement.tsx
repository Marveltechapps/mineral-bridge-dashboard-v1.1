import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Shield, 
  Users, 
  Settings, 
  Eye,
  Plus,
  History,
  UserCheck,
  Lock
} from "lucide-react";

import { PermissionMatrix } from "./PermissionMatrix";
import { UserGrouping } from "./UserGrouping";
import { AuditLogs } from "./AuditLogs";
import { RoleAssignmentModal } from "./RoleAssignmentModal";
import { AccessPreview } from "./AccessPreview";

// Mock data for roles
const roles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    color: "bg-red-500",
    userCount: 2,
    permissions: ["read", "write", "delete", "admin", "audit", "manage_users", "manage_roles"]
  },
  {
    id: "2", 
    name: "Admin",
    description: "Administrative access with user management",
    color: "bg-blue-500",
    userCount: 8,
    permissions: ["read", "write", "delete", "manage_users", "audit"]
  },
  {
    id: "3",
    name: "Manager",
    description: "Management-level access to properties and clients",
    color: "bg-green-500", 
    userCount: 15,
    permissions: ["read", "write", "manage_properties", "manage_clients"]
  },
  {
    id: "4",
    name: "Agent",
    description: "Property agent with client interaction capabilities",
    color: "bg-purple-500",
    userCount: 42,
    permissions: ["read", "write", "view_properties", "manage_clients"]
  },
  {
    id: "5",
    name: "Viewer",
    description: "Read-only access to basic information",
    color: "bg-gray-500",
    userCount: 28,
    permissions: ["read"]
  }
];

export function RoleManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showAccessPreview, setShowAccessPreview] = useState(false);

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role);
  };

  const handleAssignRole = () => {
    setShowAssignmentModal(true);
  };

  const handlePreviewAccess = () => {
    setShowAccessPreview(true);
  };

  const totalUsers = roles.reduce((sum, role) => sum + role.userCount, 0);
  const totalRoles = roles.length;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            Role Management
          </h1>
          <p className="text-muted-foreground">
            Manage user roles, permissions, and access control
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handlePreviewAccess} className="gap-2">
            <Eye className="h-4 w-4" />
            Preview Access
          </Button>
          <Button onClick={handleAssignRole} className="gap-2">
            <Plus className="h-4 w-4" />
            Assign Role
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{totalUsers}</p>
                <p className="text-xs text-green-600">+5 this week</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-950/20 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Roles</p>
                <p className="text-2xl font-bold text-green-600">{totalRoles}</p>
                <p className="text-xs text-muted-foreground">Custom roles</p>
              </div>
              <div className="h-8 w-8 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">7</p>
                <p className="text-xs text-orange-600">Require attention</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 dark:bg-orange-950/20 rounded-full flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Level</p>
                <p className="text-2xl font-bold text-purple-600">High</p>
                <p className="text-xs text-green-600">All systems secure</p>
              </div>
              <div className="h-8 w-8 bg-purple-100 dark:bg-purple-950/20 rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Role Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedRole.id === role.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'border-border hover:border-blue-300'
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${role.color} text-white border-none`}>
                    {role.name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{role.userCount} users</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {role.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto md:grid-cols-4 mb-6 h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="overview" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Users className="h-4 w-4" />
            User Groups
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <History className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Permission Matrix Tab */}
        <TabsContent value="overview" className="space-y-6">
          <PermissionMatrix selectedRole={selectedRole} onRoleUpdate={handleRoleSelect} />
        </TabsContent>

        {/* User Grouping Tab */}
        <TabsContent value="users" className="space-y-6">
          <UserGrouping roles={roles} />
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-6">
          <AuditLogs />
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Management Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Require approval for role changes</p>
                    <p className="text-sm text-muted-foreground">All role modifications require admin approval</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Multi-factor authentication</p>
                    <p className="text-sm text-muted-foreground">Require MFA for privileged roles</p>
                  </div>
                  <Button variant="outline">Setup</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session timeout</p>
                    <p className="text-sm text-muted-foreground">Configure automatic logout for security</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <RoleAssignmentModal 
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        roles={roles}
      />
      
      <AccessPreview 
        isOpen={showAccessPreview}
        onClose={() => setShowAccessPreview(false)}
        selectedRole={selectedRole}
      />
    </div>
  );
}