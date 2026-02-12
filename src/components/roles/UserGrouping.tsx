import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Users, 
  Search, 
  Filter,
  MoreHorizontal,
  UserPlus,
  UserMinus,
  Crown,
  Shield,
  Eye,
  Calendar,
  Mail,
  Phone
} from "lucide-react";

// Mock user data
const users = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    avatar: "",
    role: "Super Admin",
    roleId: "1",
    department: "IT",
    lastActive: "2 hours ago",
    status: "active",
    joinDate: "2022-01-15"
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "",
    role: "Admin",
    roleId: "2",
    department: "Operations",
    lastActive: "5 minutes ago", 
    status: "active",
    joinDate: "2022-03-22"
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike.chen@company.com", 
    avatar: "",
    role: "Manager",
    roleId: "3",
    department: "Sales",
    lastActive: "1 day ago",
    status: "active",
    joinDate: "2021-11-08"
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    avatar: "",
    role: "Agent",
    roleId: "4", 
    department: "Sales",
    lastActive: "30 minutes ago",
    status: "active",
    joinDate: "2023-01-10"
  },
  {
    id: "5",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@company.com",
    avatar: "",
    role: "Agent",
    roleId: "4",
    department: "Marketing",
    lastActive: "3 hours ago",
    status: "active",
    joinDate: "2023-02-14"
  },
  {
    id: "6",
    name: "Lisa Wong",
    email: "lisa.wong@company.com",
    avatar: "",
    role: "Viewer",
    roleId: "5",
    department: "Support",
    lastActive: "1 week ago",
    status: "inactive",
    joinDate: "2023-05-01"
  }
];

const departments = ["All Departments", "IT", "Operations", "Sales", "Marketing", "Support"];
const statuses = ["All Status", "active", "inactive"];

interface UserGroupingProps {
  roles: any[];
}

export function UserGrouping({ roles }: UserGroupingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [activeTab, setActiveTab] = useState("all");

  const getRoleColor = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.color || "bg-gray-500";
  };

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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.roleId === selectedRole;
    const matchesDepartment = selectedDepartment === "All Departments" || user.department === selectedDepartment;
    const matchesStatus = selectedStatus === "All Status" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
  });

  const getUsersByRole = (roleId: string) => {
    return users.filter(user => user.roleId === roleId);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search Users</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </p>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Display Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto md:grid-cols-3 mb-6 h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
          <TabsTrigger value="all" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Users className="h-4 w-4" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Shield className="h-4 w-4" />
            By Role
          </TabsTrigger>
          <TabsTrigger value="departments" className="gap-2 rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
            <Filter className="h-4 w-4" />
            By Department
          </TabsTrigger>
        </TabsList>

        {/* All Users View */}
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">User</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">Department</th>
                      <th className="p-4 font-medium">Last Active</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      const RoleIcon = getRoleIcon(user.roleId);
                      
                      return (
                        <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={`${getRoleColor(user.roleId)} text-white border-none gap-1`}>
                              <RoleIcon className="h-3 w-3" />
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{user.department}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Role View */}
        <TabsContent value="roles" className="space-y-6">
          {roles.map((role) => {
            const roleUsers = getUsersByRole(role.id);
            const RoleIcon = getRoleIcon(role.id);
            
            return (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={`${role.color} text-white border-none gap-1`}>
                        <RoleIcon className="h-3 w-3" />
                        {role.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {roleUsers.length} users
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Assign Users
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roleUsers.map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.department}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Joined {formatDate(user.joinDate)}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Last active: {user.lastActive}</span>
                            <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1">
                            <UserMinus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* By Department View */}
        <TabsContent value="departments" className="space-y-6">
          {departments.slice(1).map((department) => {
            const deptUsers = users.filter(user => user.department === department);
            
            return (
              <Card key={department}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{department} Department</CardTitle>
                      <p className="text-sm text-muted-foreground">{deptUsers.length} team members</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {deptUsers.map((user) => {
                      const RoleIcon = getRoleIcon(user.roleId);
                      
                      return (
                        <div key={user.id} className="text-center p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <Avatar className="h-16 w-16 mx-auto mb-3">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                          
                          <Badge className={`${getRoleColor(user.roleId)} text-white border-none gap-1 mb-2`}>
                            <RoleIcon className="h-3 w-3" />
                            {user.role}
                          </Badge>
                          
                          <p className="text-xs text-muted-foreground">
                            Active {user.lastActive}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}