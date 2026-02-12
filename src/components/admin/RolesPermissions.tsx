import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Shield, Plus, Eye, Edit, Trash2, Clock, User } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: Permission[];
}

const mockRoles: Role[] = [
  {
    id: "R001",
    name: "Super Admin",
    description: "Full access to all features and settings",
    userCount: 2,
    permissions: [
      { module: "Dashboard", view: true, create: true, edit: true, delete: true },
      { module: "Properties", view: true, create: true, edit: true, delete: true },
      { module: "Users", view: true, create: true, edit: true, delete: true },
      { module: "Marketplace", view: true, create: true, edit: true, delete: true },
      { module: "Payments", view: true, create: true, edit: true, delete: true },
      { module: "Settings", view: true, create: true, edit: true, delete: true },
    ],
  },
  {
    id: "R002",
    name: "Admin",
    description: "Manage properties, users, and transactions",
    userCount: 5,
    permissions: [
      { module: "Dashboard", view: true, create: false, edit: false, delete: false },
      { module: "Properties", view: true, create: true, edit: true, delete: true },
      { module: "Users", view: true, create: true, edit: true, delete: false },
      { module: "Marketplace", view: true, create: true, edit: true, delete: false },
      { module: "Payments", view: true, create: false, edit: false, delete: false },
      { module: "Settings", view: true, create: false, edit: true, delete: false },
    ],
  },
  {
    id: "R003",
    name: "Agent",
    description: "Manage assigned properties and enquiries",
    userCount: 18,
    permissions: [
      { module: "Dashboard", view: true, create: false, edit: false, delete: false },
      { module: "Properties", view: true, create: true, edit: true, delete: false },
      { module: "Users", view: true, create: false, edit: false, delete: false },
      { module: "Marketplace", view: true, create: true, edit: true, delete: false },
      { module: "Payments", view: true, create: false, edit: false, delete: false },
      { module: "Settings", view: false, create: false, edit: false, delete: false },
    ],
  },
  {
    id: "R004",
    name: "Viewer",
    description: "Read-only access to reports and data",
    userCount: 12,
    permissions: [
      { module: "Dashboard", view: true, create: false, edit: false, delete: false },
      { module: "Properties", view: true, create: false, edit: false, delete: false },
      { module: "Users", view: true, create: false, edit: false, delete: false },
      { module: "Marketplace", view: true, create: false, edit: false, delete: false },
      { module: "Payments", view: true, create: false, edit: false, delete: false },
      { module: "Settings", view: false, create: false, edit: false, delete: false },
    ],
  },
];

const activityLog = [
  {
    id: 1,
    user: "Sarah Mitchell",
    action: "Updated permissions for Agent role",
    timestamp: "2024-11-08 14:32",
  },
  {
    id: 2,
    user: "John Davis",
    action: "Created new role: Content Manager",
    timestamp: "2024-11-07 10:15",
  },
  {
    id: 3,
    user: "Admin User",
    action: "Deleted role: Intern",
    timestamp: "2024-11-06 16:45",
  },
  {
    id: 4,
    user: "Sarah Mitchell",
    action: "Modified Viewer role permissions",
    timestamp: "2024-11-05 09:22",
  },
];

export function RolesPermissions() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleTogglePermission = (
    roleId: string,
    module: string,
    permission: keyof Omit<Permission, "module">
  ) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: role.permissions.map((perm) =>
              perm.module === module
                ? { ...perm, [permission]: !perm[permission] }
                : perm
            ),
          };
        }
        return role;
      })
    );
    toast.success("Permission updated successfully");
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId));
    toast.success("Role deleted successfully");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Roles & Permissions</h1>
          <p className="text-muted-foreground">
            Manage user roles and access control across the platform
          </p>
        </div>
        <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {roles.map((role) => (
          <Card key={role.id} className="border-border/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
                  <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="outline">{role.userCount} users</Badge>
              </div>
              <div>
                <h3 className="font-medium mb-1">{role.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {role.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedRole(role);
                    setEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Permissions Matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="min-w-[200px]">Module</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.id} className="text-center min-w-[120px]">
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-xs text-muted-foreground font-normal">
                          {role.userCount} users
                        </p>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {["Dashboard", "Properties", "Users", "Marketplace", "Payments", "Settings"].map(
                  (module) => (
                    <TableRow key={module} className="hover:bg-muted/20">
                      <TableCell className="font-medium">{module}</TableCell>
                      {roles.map((role) => {
                        const perm = role.permissions.find((p) => p.module === module);
                        return (
                          <TableCell key={role.id} className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="w-12 text-muted-foreground">View</span>
                                  <Switch
                                    checked={perm?.view || false}
                                    onCheckedChange={() =>
                                      handleTogglePermission(role.id, module, "view")
                                    }
                                    disabled={role.name === "Super Admin"}
                                  />
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="w-12 text-muted-foreground">Create</span>
                                  <Switch
                                    checked={perm?.create || false}
                                    onCheckedChange={() =>
                                      handleTogglePermission(role.id, module, "create")
                                    }
                                    disabled={role.name === "Super Admin"}
                                  />
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="w-12 text-muted-foreground">Edit</span>
                                  <Switch
                                    checked={perm?.edit || false}
                                    onCheckedChange={() =>
                                      handleTogglePermission(role.id, module, "edit")
                                    }
                                    disabled={role.name === "Super Admin"}
                                  />
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="w-12 text-muted-foreground">Delete</span>
                                  <Switch
                                    checked={perm?.delete || false}
                                    onCheckedChange={() =>
                                      handleTogglePermission(role.id, module, "delete")
                                    }
                                    disabled={role.name === "Super Admin"}
                                  />
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityLog.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-1">{log.user}</p>
                  <p className="text-sm text-muted-foreground mb-1">{log.action}</p>
                  <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Role Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>Define a new administrative role and its associated permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role Name</Label>
              <Input id="role-name" placeholder="e.g., Content Manager" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                placeholder="Brief description of this role"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Role created successfully");
                setCreateDialogOpen(false);
              }}
            >
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
