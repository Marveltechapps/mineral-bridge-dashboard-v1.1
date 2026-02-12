import { useState } from "react";
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Shield, 
  Users,
  MoreHorizontal,
  Filter,
  Eye
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RoleDetailsDialog } from "./RoleDetailsDialog";

interface Role {
  id: string;
  name: string;
  totalUsers: number;
  createdDate: string;
  lastModified: string;
  status: "active" | "inactive";
  description: string;
}

const mockRoles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    totalUsers: 3,
    createdDate: "2024-01-15",
    lastModified: "2024-11-10",
    status: "active",
    description: "Full system access"
  },
  {
    id: "2",
    name: "Project Manager",
    totalUsers: 12,
    createdDate: "2024-02-20",
    lastModified: "2024-11-08",
    status: "active",
    description: "Manage projects and teams"
  },
  {
    id: "3",
    name: "Sales Agent",
    totalUsers: 45,
    createdDate: "2024-03-10",
    lastModified: "2024-11-05",
    status: "active",
    description: "Handle property sales"
  },
  {
    id: "4",
    name: "Finance Manager",
    totalUsers: 8,
    createdDate: "2024-03-15",
    lastModified: "2024-10-22",
    status: "active",
    description: "Financial operations and reporting"
  },
  {
    id: "5",
    name: "Support Staff",
    totalUsers: 25,
    createdDate: "2024-04-01",
    lastModified: "2024-09-15",
    status: "active",
    description: "Customer support and inquiries"
  },
  {
    id: "6",
    name: "Marketing Team",
    totalUsers: 10,
    createdDate: "2024-05-12",
    lastModified: "2024-08-20",
    status: "inactive",
    description: "Marketing and promotions"
  }
];

interface RolesManagementPageProps {
  onNavigate?: (view: string, roleId?: string) => void;
}

export function RolesManagementPage({ onNavigate }: RolesManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<Role[]>(mockRoles);

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || role.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (roleId: string) => {
    if (confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter((r) => r.id !== roleId));
    }
  };

  const handleViewDetails = (role: Role) => {
    setSelectedRole(role);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage user roles and access permissions
          </p>
        </div>
        <Button 
          onClick={() => onNavigate?.("create-role")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Roles</p>
              <p className="text-2xl font-semibold mt-1">{roles.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Roles</p>
              <p className="text-2xl font-semibold mt-1">
                {roles.filter((r) => r.status === "active").length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-semibold mt-1">
                {roles.reduce((sum, r) => sum + r.totalUsers, 0)}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactive Roles</p>
              <p className="text-2xl font-semibold mt-1">
                {roles.filter((r) => r.status === "inactive").length}
              </p>
            </div>
            <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Roles Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Total Users</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No roles found
                </TableCell>
              </TableRow>
            ) : (
              filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{role.name}</p>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{role.totalUsers}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(role.createdDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(role.lastModified).toLocaleDateString()}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(role)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onNavigate?.("edit-role", role.id)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(role.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Role Details Dialog */}
      {selectedRole && (
        <RoleDetailsDialog
          role={selectedRole}
          open={!!selectedRole}
          onClose={() => setSelectedRole(null)}
          onEdit={() => {
            setSelectedRole(null);
            onNavigate?.("edit-role", selectedRole.id);
          }}
        />
      )}
    </div>
  );
}
