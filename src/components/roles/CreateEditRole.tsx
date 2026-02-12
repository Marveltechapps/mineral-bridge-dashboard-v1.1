import { useState } from "react";
import { ArrowLeft, Save, Users, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

interface Permission {
  category: string;
  permissions: {
    name: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  }[];
}

const initialPermissions: Permission[] = [
  {
    category: "Users & Clients",
    permissions: [
      { name: "User Management", view: false, create: false, edit: false, delete: false },
      { name: "Client Profiles", view: false, create: false, edit: false, delete: false },
      { name: "User Roles", view: false, create: false, edit: false, delete: false },
    ],
  },
  {
    category: "Property Listings",
    permissions: [
      { name: "Properties", view: false, create: false, edit: false, delete: false },
      { name: "Property Details", view: false, create: false, edit: false, delete: false },
      { name: "Property Status", view: false, create: false, edit: false, delete: false },
    ],
  },
  {
    category: "Buy/Sell/Exchange Transactions",
    permissions: [
      { name: "Buy Enquiries", view: false, create: false, edit: false, delete: false },
      { name: "Sell Enquiries", view: false, create: false, edit: false, delete: false },
      { name: "Exchange Requests", view: false, create: false, edit: false, delete: false },
      { name: "Transaction History", view: false, create: false, edit: false, delete: false },
    ],
  },
  {
    category: "Payments & Finance",
    permissions: [
      { name: "Transactions", view: false, create: false, edit: false, delete: false },
      { name: "Commissions", view: false, create: false, edit: false, delete: false },
      { name: "Invoices", view: false, create: false, edit: false, delete: false },
      { name: "Refunds", view: false, create: false, edit: false, delete: false },
      { name: "Payment Gateways", view: false, create: false, edit: false, delete: false },
    ],
  },
  {
    category: "Reports & Analytics",
    permissions: [
      { name: "Dashboard Analytics", view: false, create: false, edit: false, delete: false },
      { name: "Sales Reports", view: false, create: false, edit: false, delete: false },
      { name: "Financial Reports", view: false, create: false, edit: false, delete: false },
      { name: "GST Reports", view: false, create: false, edit: false, delete: false },
    ],
  },
  {
    category: "Settings & Project Admin",
    permissions: [
      { name: "Project Settings", view: false, create: false, edit: false, delete: false },
      { name: "System Configuration", view: false, create: false, edit: false, delete: false },
      { name: "Email Templates", view: false, create: false, edit: false, delete: false },
      { name: "Activity Logs", view: false, create: false, edit: false, delete: false },
    ],
  },
];

const mockUsers = [
  { id: "1", name: "John Doe", email: "john@example.com" },
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com" },
  { id: "4", name: "Sarah Williams", email: "sarah@example.com" },
  { id: "5", name: "Tom Brown", email: "tom@example.com" },
];

interface CreateEditRoleProps {
  roleId?: string;
  onBack?: () => void;
}

export function CreateEditRole({ roleId, onBack }: CreateEditRoleProps) {
  const [roleName, setRoleName] = useState(roleId ? "Project Manager" : "");
  const [roleDescription, setRoleDescription] = useState(
    roleId ? "Manage projects and teams" : ""
  );
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(
    roleId ? ["1", "2", "3"] : []
  );
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handlePermissionChange = (
    categoryIndex: number,
    permissionIndex: number,
    action: "view" | "create" | "edit" | "delete"
  ) => {
    const newPermissions = [...permissions];
    newPermissions[categoryIndex].permissions[permissionIndex][action] =
      !newPermissions[categoryIndex].permissions[permissionIndex][action];
    setPermissions(newPermissions);
  };

  const handleSelectAll = (categoryIndex: number, action: "view" | "create" | "edit" | "delete") => {
    const newPermissions = [...permissions];
    const allChecked = newPermissions[categoryIndex].permissions.every(p => p[action]);
    newPermissions[categoryIndex].permissions.forEach(p => {
      p[action] = !allChecked;
    });
    setPermissions(newPermissions);
  };

  const handleAddUser = (userId: string) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      toast.error("Please enter a role name");
      return;
    }
    toast.success(roleId ? "Role updated successfully" : "Role created successfully");
    onBack?.();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">
            {roleId ? "Edit Role" : "Create New Role"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {roleId ? "Update role details and permissions" : "Define role details and assign permissions"}
          </p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          {roleId ? "Update Role" : "Create Role"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Role Details */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Information */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <h3 className="font-semibold">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name *</Label>
              <Input
                id="roleName"
                placeholder="e.g., Sales Manager"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleDescription">Description</Label>
              <Input
                id="roleDescription"
                placeholder="Brief description of the role"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assign Users */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Assign Users</h3>
              <Badge variant="secondary">{selectedUsers.length} users</Badge>
            </div>

            <div className="space-y-2">
              <Label>Add Users to Role</Label>
              <div className="relative">
                <Select onValueChange={handleAddUser}>
                  <SelectTrigger>
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select users..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers
                      .filter((user) => !selectedUsers.includes(user.id))
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Users List */}
            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Users ({selectedUsers.length})</Label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {selectedUsers.map((userId) => {
                    const user = mockUsers.find((u) => u.id === userId);
                    if (!user) return null;
                    return (
                      <div
                        key={userId}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveUser(userId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Permissions Matrix */}
        <div className="lg:col-span-2">
          <div className="bg-card border rounded-xl overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="font-semibold">Permissions Matrix</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Select permissions for this role
              </p>
            </div>

            <div className="overflow-x-auto">
              {permissions.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border-b last:border-b-0">
                  <div className="bg-muted/50 px-6 py-3">
                    <h4 className="font-medium text-sm">{category.category}</h4>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Permission</TableHead>
                        <TableHead className="text-center w-[100px]">
                          <div className="flex flex-col items-center gap-1">
                            <span>View</span>
                            <Checkbox 
                              checked={category.permissions.every(p => p.view)}
                              onCheckedChange={() => handleSelectAll(categoryIndex, "view")}
                            />
                          </div>
                        </TableHead>
                        <TableHead className="text-center w-[100px]">
                          <div className="flex flex-col items-center gap-1">
                            <span>Create</span>
                            <Checkbox 
                              checked={category.permissions.every(p => p.create)}
                              onCheckedChange={() => handleSelectAll(categoryIndex, "create")}
                            />
                          </div>
                        </TableHead>
                        <TableHead className="text-center w-[100px]">
                          <div className="flex flex-col items-center gap-1">
                            <span>Edit</span>
                            <Checkbox 
                              checked={category.permissions.every(p => p.edit)}
                              onCheckedChange={() => handleSelectAll(categoryIndex, "edit")}
                            />
                          </div>
                        </TableHead>
                        <TableHead className="text-center w-[100px]">
                          <div className="flex flex-col items-center gap-1">
                            <span>Delete</span>
                            <Checkbox 
                              checked={category.permissions.every(p => p.delete)}
                              onCheckedChange={() => handleSelectAll(categoryIndex, "delete")}
                            />
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.permissions.map((permission, permissionIndex) => (
                        <TableRow key={permissionIndex}>
                          <TableCell className="font-medium">{permission.name}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.view}
                                onCheckedChange={() =>
                                  handlePermissionChange(categoryIndex, permissionIndex, "view")
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.create}
                                onCheckedChange={() =>
                                  handlePermissionChange(categoryIndex, permissionIndex, "create")
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.edit}
                                onCheckedChange={() =>
                                  handlePermissionChange(categoryIndex, permissionIndex, "edit")
                                }
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.delete}
                                onCheckedChange={() =>
                                  handlePermissionChange(categoryIndex, permissionIndex, "delete")
                                }
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
