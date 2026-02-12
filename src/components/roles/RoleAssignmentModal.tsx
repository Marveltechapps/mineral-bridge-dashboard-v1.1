import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { 
  Search, 
  Users, 
  Shield,
  AlertTriangle,
  UserPlus,
  Crown,
  Eye,
  Calendar,
  Mail,
  CheckCircle
} from "lucide-react";

// Mock user data for assignment
const availableUsers = [
  {
    id: "9",
    name: "David Park",
    email: "david.park@company.com",
    avatar: "",
    currentRole: "Viewer",
    currentRoleId: "5",
    department: "Marketing",
    joinDate: "2023-08-15",
    status: "active"
  },
  {
    id: "10",
    name: "Rachel Green",
    email: "rachel.green@company.com", 
    avatar: "",
    currentRole: "Agent",
    currentRoleId: "4",
    department: "Sales",
    joinDate: "2023-06-20",
    status: "active"
  },
  {
    id: "11",
    name: "Tom Wilson",
    email: "tom.wilson@company.com",
    avatar: "",
    currentRole: "Viewer",
    currentRoleId: "5", 
    department: "Support",
    joinDate: "2023-09-10",
    status: "active"
  },
  {
    id: "12",
    name: "Amy Chen",
    email: "amy.chen@company.com",
    avatar: "",
    currentRole: "Agent",
    currentRoleId: "4",
    department: "Sales",
    joinDate: "2023-07-05",
    status: "active"
  },
  {
    id: "13",
    name: "Mark Thompson",
    email: "mark.thompson@company.com",
    avatar: "",
    currentRole: "Manager",
    currentRoleId: "3",
    department: "Operations",
    joinDate: "2022-12-01",
    status: "active"
  }
];

interface RoleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: any[];
}

export function RoleAssignmentModal({ isOpen, onClose, roles }: RoleAssignmentModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [assignmentType, setAssignmentType] = useState<"individual" | "bulk">("individual");

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

  const getRoleColor = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.color || "bg-gray-500";
  };

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    if (selectedUsers.length === 0 || !selectedRole) return;
    
    const selectedRoleData = roles.find(r => r.id === selectedRole);
    const isHighPrivilegeRole = ["1", "2"].includes(selectedRole); // Super Admin or Admin
    
    if (isHighPrivilegeRole) {
      setShowConfirmDialog(true);
    } else {
      processAssignment();
    }
  };

  const processAssignment = () => {
    console.log("Assigning role:", selectedRole, "to users:", selectedUsers);
    // Here you would handle the actual role assignment
    
    // Reset form and close
    setSelectedUsers([]);
    setSelectedRole("");
    setSearchTerm("");
    setShowConfirmDialog(false);
    onClose();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);
  const canAssign = selectedUsers.length > 0 && selectedRole;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Assign Roles to Users
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Assignment Type Toggle */}
            <div className="flex items-center space-x-4">
              <Label>Assignment Type:</Label>
              <div className="flex space-x-2">
                <Button
                  variant={assignmentType === "individual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAssignmentType("individual")}
                >
                  Individual
                </Button>
                <Button
                  variant={assignmentType === "bulk" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAssignmentType("bulk")}
                >
                  Bulk Assignment
                </Button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Select Role to Assign</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => {
                    const RoleIcon = getRoleIcon(role.id);
                    return (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <RoleIcon className="h-4 w-4" />
                          <span>{role.name}</span>
                          <Badge className={`${role.color} text-white border-none text-xs ml-2`}>
                            {role.userCount} users
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              
              {selectedRoleData && (
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>{selectedRoleData.name}:</strong> {selectedRoleData.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedRoleData.permissions.slice(0, 5).map((permission: string) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                    {selectedRoleData.permissions.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{selectedRoleData.permissions.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Search */}
            <div className="space-y-2">
              <Label>Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* User Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Select Users ({selectedUsers.length} selected)</Label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUsers(filteredUsers.map(u => u.id))}
                    disabled={filteredUsers.length === 0}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUsers([])}
                    disabled={selectedUsers.length === 0}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              
              <div className="max-h-80 overflow-y-auto border rounded-lg">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No users found matching your search.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredUsers.map((user) => {
                      const CurrentRoleIcon = getRoleIcon(user.currentRoleId);
                      const isSelected = selectedUsers.includes(user.id);
                      
                      return (
                        <div
                          key={user.id}
                          className={`p-4 border-b last:border-b-0 cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-muted/30'
                          }`}
                          onClick={() => handleUserToggle(user.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleUserToggle(user.id)}
                              className="pointer-events-none"
                            />
                            
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    {user.email}
                                  </p>
                                </div>
                                
                                <div className="text-right">
                                  <Badge className={`${getRoleColor(user.currentRoleId)} text-white border-none gap-1 mb-1`}>
                                    <CurrentRoleIcon className="h-3 w-3" />
                                    {user.currentRole}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">{user.department}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Joined {formatJoinDate(user.joinDate)}
                                </span>
                                <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                  {user.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Assignment Summary */}
            {selectedUsers.length > 0 && selectedRole && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Assignment Summary
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You are about to assign the <strong>{selectedRoleData?.name}</strong> role to{" "}
                  <strong>{selectedUsers.length}</strong> user{selectedUsers.length !== 1 ? 's' : ''}.
                </p>
                <div className="text-xs text-muted-foreground">
                  {selectedUsers.length <= 3 ? (
                    <span>
                      Users: {selectedUsers.map(id => {
                        const user = availableUsers.find(u => u.id === id);
                        return user?.name;
                      }).join(', ')}
                    </span>
                  ) : (
                    <span>
                      Users: {selectedUsers.slice(0, 2).map(id => {
                        const user = availableUsers.find(u => u.id === id);
                        return user?.name;
                      }).join(', ')} and {selectedUsers.length - 2} others
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssign}
              disabled={!canAssign}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Assign Role{selectedUsers.length > 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* High Privilege Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              High Privilege Role Assignment
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to assign a high-privilege role ({selectedRoleData?.name}) that grants 
              significant system access. This action should be carefully reviewed. 
              Are you sure you want to proceed?
              
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  This role includes critical permissions that could affect system security.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={processAssignment}
              className="bg-red-600 hover:bg-red-700"
            >
              Confirm Assignment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}