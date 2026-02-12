import { Copy, Pencil, Power, Shield, Users, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { toast } from "sonner";

interface Role {
  id: string;
  name: string;
  totalUsers: number;
  createdDate: string;
  lastModified: string;
  status: "active" | "inactive";
  description: string;
}

interface RoleDetailsDialogProps {
  role: Role;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const mockPermissions = {
  "Users & Clients": ["View Users", "Create Users", "Edit Users"],
  "Property Listings": ["View Properties", "Create Properties", "Edit Properties", "Delete Properties"],
  "Transactions": ["View Transactions", "Create Transactions"],
  "Payments & Finance": ["View Payments", "View Invoices"],
  "Reports & Analytics": ["View Reports", "Export Reports"],
  "Settings": ["View Settings"]
};

const mockAssignedUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", avatar: "JD" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatar: "JS" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", avatar: "MJ" },
];

export function RoleDetailsDialog({ role, open, onClose, onEdit }: RoleDetailsDialogProps) {
  const handleDuplicate = () => {
    toast.success(`Role "${role.name}" duplicated successfully`);
    onClose();
  };

  const handleToggleStatus = () => {
    const newStatus = role.status === "active" ? "inactive" : "active";
    toast.success(`Role ${newStatus === "active" ? "activated" : "deactivated"} successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-2xl">{role.name}</DialogTitle>
                <DialogDescription className="mt-1">{role.description}</DialogDescription>
              </div>
            </div>
            <Badge
              variant={role.status === "active" ? "default" : "secondary"}
              className={
                role.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
              }
            >
              {role.status}
            </Badge>
          </div>
        </DialogHeader>

        <Separator />

        {/* Role Information */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Created Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(role.createdDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Last Modified</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{new Date(role.lastModified).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Total Users</Label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{role.totalUsers} users assigned</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Role ID</Label>
              <code className="text-xs bg-muted px-2 py-1 rounded">{role.id}</code>
            </div>
          </div>

          <Separator />

          {/* Permissions */}
          <div className="space-y-3">
            <h4 className="font-semibold">Permissions</h4>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(mockPermissions).map(([category, perms]) => (
                <div key={category} className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h5 className="font-medium text-sm">{category}</h5>
                  <div className="flex flex-wrap gap-2">
                    {perms.map((perm) => (
                      <Badge key={perm} variant="secondary" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Assigned Users */}
          <div className="space-y-3">
            <h4 className="font-semibold">Assigned Users ({mockAssignedUsers.length})</h4>
            <div className="space-y-2">
              {mockAssignedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {user.avatar}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label className="font-medium">Role Status</Label>
              <p className="text-sm text-muted-foreground">
                {role.status === "active" 
                  ? "Role is currently active and in use" 
                  : "Role is inactive and not available for assignment"}
              </p>
            </div>
            <Switch
              checked={role.status === "active"}
              onCheckedChange={handleToggleStatus}
            />
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button onClick={onEdit} className="flex-1">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Role
          </Button>
          <Button onClick={handleDuplicate} variant="outline" className="flex-1">
            <Copy className="h-4 w-4 mr-2" />
            Duplicate Role
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
