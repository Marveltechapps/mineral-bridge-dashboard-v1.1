import { useState } from "react";
import { 
  Settings, 
  Shield, 
  Globe, 
  Database,
  Users,
  Bell,
  Lock,
  LogOut,
  Save,
  Plus,
  Trash2,
  Check,
  Eye,
  Edit,
  FileText
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useDashboardStore } from "../../store/dashboardStore";

export function AdminSettings() {
  const { state } = useDashboardStore();
  const [activeTab, setActiveTab] = useState("general");
  
  // Admin Users State
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, name: "Sarah Connor", email: "sarah@mineralbridge.com", role: "Super Admin", status: "Active" },
    { id: 2, name: "John Smith", email: "john@mineralbridge.com", role: "Finance/Admin", status: "Active" },
    { id: 3, name: "Emily Chen", email: "emily@mineralbridge.com", role: "Content Admin", status: "Inactive" },
  ]);

  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isManageRolesOpen, setIsManageRolesOpen] = useState(false);
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", role: "Operations" });
  const [editingUser, setEditingUser] = useState<any>(null);

  // Role Permissions Data
  const [roles, setRoles] = useState([
    {
      name: "Super Admin",
      description: "Full system access and configuration control",
      permissions: {
        financials: { view: true, edit: true, delete: true },
        operations: { view: true, edit: true, delete: true },
        content: { view: true, edit: true, delete: true },
        users: { view: true, edit: true, delete: true }
      }
    },
    {
      name: "Finance/Admin",
      description: "Manages payments, settlements, and invoices",
      permissions: {
        financials: { view: true, edit: true, delete: false },
        operations: { view: true, edit: false, delete: false },
        content: { view: false, edit: false, delete: false },
        users: { view: true, edit: false, delete: false }
      }
    },
    {
      name: "Operations",
      description: "Oversees order processing and mineral flow",
      permissions: {
        financials: { view: false, edit: false, delete: false },
        operations: { view: true, edit: true, delete: false },
        content: { view: true, edit: false, delete: false },
        users: { view: true, edit: false, delete: false }
      }
    },
    {
      name: "Content Admin",
      description: "Updates news, ESG reports, and static content",
      permissions: {
        financials: { view: false, edit: false, delete: false },
        operations: { view: false, edit: false, delete: false },
        content: { view: true, edit: true, delete: true },
        users: { view: false, edit: false, delete: false }
      }
    }
  ]);

  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState("Super Admin");

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newOrders: true,
    newUsers: false,
    systemUpdates: true,
    marketing: false
  });

  // Integrations State
  const [integrations, setIntegrations] = useState([
    { id: "stripe", name: "Stripe Payments", connected: true, lastSync: "2 hours ago" },
    { id: "sendgrid", name: "SendGrid Email", connected: true, lastSync: "1 day ago" },
    { id: "slack", name: "Slack Notifications", connected: false, lastSync: "-" },
    { id: "analytics", name: "Google Analytics", connected: true, lastSync: "5 mins ago" },
  ]);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(int => 
      int.id === id ? { ...int, connected: !int.connected } : int
    ));
  };

  const removeAdmin = (id: number) => {
    setAdminUsers(adminUsers.filter(u => u.id !== id));
  };

  const handleAddAdmin = () => {
    if (newAdmin.name && newAdmin.email) {
      setAdminUsers([
        ...adminUsers,
        {
          id: adminUsers.length + 1,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          status: "Active"
        }
      ]);
      setNewAdmin({ name: "", email: "", role: "Operations" });
      setIsAddAdminOpen(false);
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setIsEditAdminOpen(true);
  };

  const handleUpdateAdmin = () => {
    if (editingUser && editingUser.name && editingUser.email) {
      setAdminUsers(adminUsers.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setIsEditAdminOpen(false);
      setEditingUser(null);
    }
  };

  // Helper to get current role permissions for the dialog
  const currentRole = roles.find(r => r.name === selectedRoleForEdit) || roles[0];

  const togglePermission = (module: string, type: 'view' | 'edit' | 'delete') => {
    setRoles(roles.map(role => {
      if (role.name === selectedRoleForEdit) {
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [module]: {
              // @ts-ignore
              ...role.permissions[module],
              // @ts-ignore
              [type]: !role.permissions[module][type]
            }
          }
        };
      }
      return role;
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
          <p className="text-muted-foreground">Configure global platform parameters and security.</p>
          <p className="text-xs text-muted-foreground mt-1">Registry users (User Management): <span className="font-medium text-emerald-600">{state.registryUsers.length}</span></p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-2">
           <Card className="border-none shadow-sm">
             <CardContent className="p-2">
               {[
                 { id: "general", icon: Globe, label: "General" },
                 { id: "admin", icon: Users, label: "Admin Users" },
                 { id: "security", icon: Shield, label: "Security & Logs" },
                 { id: "integrations", icon: Database, label: "Integrations" },
                 { id: "notifications", icon: Bell, label: "Notifications" },
               ].map((item, i) => (
                 <Button 
                   key={item.id} 
                   variant={activeTab === item.id ? "secondary" : "ghost"} 
                   className={`w-full justify-start gap-2 ${activeTab === item.id ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                   onClick={() => setActiveTab(item.id)}
                 >
                   <item.icon className="w-4 h-4" />
                   {item.label}
                 </Button>
               ))}
             </CardContent>
           </Card>
        </div>

        <div className="flex-1 space-y-6">
          {activeTab === "general" && (
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>General Configuration</CardTitle>
                <CardDescription>Basic platform settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform Name</Label>
                    <Input defaultValue="Mineral Bridge" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input defaultValue="support@mineralbridge.com" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="aud">AUD (A$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                        <SelectItem value="est">EST (GMT-5)</SelectItem>
                        <SelectItem value="pst">PST (GMT-8)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <>
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Security Policies</CardTitle>
                  <CardDescription>Manage access control and authentication.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                       <Label>Two-Factor Authentication (2FA)</Label>
                       <p className="text-xs text-muted-foreground">Enforce 2FA for all admin accounts</p>
                     </div>
                     <Switch checked={true} />
                   </div>
                   <Separator />
                   <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                       <Label>Session Timeout</Label>
                       <p className="text-xs text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                     </div>
                     <Switch checked={true} />
                   </div>
                   <Separator />
                   <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                       <Label>Strict KYC Mode</Label>
                       <p className="text-xs text-muted-foreground">Prevent unverified users from viewing prices</p>
                     </div>
                     <Switch checked={false} />
                   </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Audit Logs</CardTitle>
                  <CardDescription>Recent system activities.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "Updated System Settings", user: "Admin User", time: "2 hours ago" },
                      { action: "Deleted User 'Test Account'", user: "Admin User", time: "5 hours ago" },
                      { action: "Changed Commission Rate to 2.5%", user: "Super Admin", time: "1 day ago" },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                            <Lock className="w-4 h-4 text-slate-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{log.action}</p>
                            <p className="text-xs text-muted-foreground">by {log.user}</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          
          {activeTab === "admin" && (
             <Card className="border-none shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                   <CardTitle>Admin User Management</CardTitle>
                   <CardDescription>Manage administrative access and roles.</CardDescription>
                 </div>
                 <div className="flex gap-2">
                    <Dialog open={isManageRolesOpen} onOpenChange={setIsManageRolesOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Shield className="w-4 h-4" />
                          Manage Roles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Role Permissions</DialogTitle>
                          <DialogDescription>
                            Configure granular access levels for each administrative role.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Tabs defaultValue="Super Admin" value={selectedRoleForEdit} onValueChange={setSelectedRoleForEdit} className="w-full">
                           <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg w-full justify-start overflow-x-auto">
                              {roles.map(r => (
                                <TabsTrigger key={r.name} value={r.name} className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">{r.name}</TabsTrigger>
                              ))}
                           </TabsList>
                           <div className="mt-4">
                             <div className="mb-4">
                               <h4 className="font-semibold text-sm">{currentRole.name}</h4>
                               <p className="text-xs text-muted-foreground">{currentRole.description}</p>
                             </div>
                             
                             <Table>
                               <TableHeader>
                                 <TableRow>
                                   <TableHead>Module</TableHead>
                                   <TableHead className="text-center">View</TableHead>
                                   <TableHead className="text-center">Edit</TableHead>
                                   <TableHead className="text-center">Delete</TableHead>
                                 </TableRow>
                               </TableHeader>
                               <TableBody>
                                 {Object.entries(currentRole.permissions).map(([module, perms]) => (
                                   <TableRow key={module}>
                                     <TableCell className="font-medium capitalize">{module === 'users' ? 'User Management' : module}</TableCell>
                                     <TableCell className="text-center">
                                       <Checkbox 
                                          checked={perms.view} 
                                          onCheckedChange={() => togglePermission(module, 'view')}
                                          disabled={currentRole.name === 'Super Admin'} 
                                       />
                                     </TableCell>
                                     <TableCell className="text-center">
                                       <Checkbox 
                                          checked={perms.edit} 
                                          onCheckedChange={() => togglePermission(module, 'edit')}
                                          disabled={currentRole.name === 'Super Admin'}
                                       />
                                     </TableCell>
                                     <TableCell className="text-center">
                                       <Checkbox 
                                          checked={perms.delete} 
                                          onCheckedChange={() => togglePermission(module, 'delete')}
                                          disabled={currentRole.name === 'Super Admin'}
                                       />
                                     </TableCell>
                                   </TableRow>
                                 ))}
                               </TableBody>
                             </Table>
                           </div>
                        </Tabs>

                        <DialogFooter>
                          <Button onClick={() => setIsManageRolesOpen(false)}>Close</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add Admin
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Admin</DialogTitle>
                          <DialogDescription>
                            Create a new administrative user for the platform.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Name
                            </Label>
                            <Input
                              id="name"
                              value={newAdmin.name}
                              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              value={newAdmin.email}
                              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                              Role
                            </Label>
                            <Select 
                                value={newAdmin.role} 
                                onValueChange={(val) => setNewAdmin({ ...newAdmin, role: val })}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Super Admin">Super Admin</SelectItem>
                                <SelectItem value="Finance/Admin">Finance/Admin</SelectItem>
                                <SelectItem value="Operations">Operations</SelectItem>
                                <SelectItem value="Content Admin">Content Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddAdmin}>Save User</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Edit Admin Dialog */}
                    <Dialog open={isEditAdminOpen} onOpenChange={setIsEditAdminOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Admin User</DialogTitle>
                          <DialogDescription>
                            Update the details for this administrative user.
                          </DialogDescription>
                        </DialogHeader>
                        {editingUser && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="edit-name"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="edit-email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-role" className="text-right">
                                Role
                              </Label>
                              <Select 
                                  value={editingUser.role} 
                                  onValueChange={(val) => setEditingUser({ ...editingUser, role: val })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                                  <SelectItem value="Finance/Admin">Finance/Admin</SelectItem>
                                  <SelectItem value="Operations">Operations</SelectItem>
                                  <SelectItem value="Content Admin">Content Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleUpdateAdmin}>Update User</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {adminUsers.map((user) => (
                     <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                       <div className="flex items-center gap-3">
                         <Avatar className="h-9 w-9">
                           <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                         </Avatar>
                         <div>
                           <p className="text-sm font-medium leading-none">{user.name}</p>
                           <p className="text-xs text-muted-foreground">{user.email}</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-4">
                         <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                           {user.role}
                         </Badge>
                         <div className="flex gap-1">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                             onClick={() => handleEditClick(user)}
                           >
                             <Edit className="w-4 h-4" />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                             onClick={() => removeAdmin(user.id)}
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
          )}

          {activeTab === "integrations" && (
             <Card className="border-none shadow-sm">
               <CardHeader>
                 <CardTitle>Integrations</CardTitle>
                 <CardDescription>Connect with external services.</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="grid gap-4">
                   {integrations.map((app) => (
                     <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                       <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg ${app.connected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                           <Database className="w-5 h-5" />
                         </div>
                         <div>
                           <p className="font-medium">{app.name}</p>
                           <p className="text-xs text-muted-foreground">
                             {app.connected ? `Synced: ${app.lastSync}` : 'Not connected'}
                           </p>
                         </div>
                       </div>
                       <Switch 
                         checked={app.connected} 
                         onCheckedChange={() => toggleIntegration(app.id)}
                       />
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>
          )}

          {activeTab === "notifications" && (
             <Card className="border-none shadow-sm">
               <CardHeader>
                 <CardTitle>Notification Settings</CardTitle>
                 <CardDescription>Configure email and system alerts.</CardDescription>
               </CardHeader>
               <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label className="text-base">Email Alerts</Label>
                     <p className="text-xs text-muted-foreground">Receive daily summaries via email</p>
                   </div>
                   <Switch 
                     checked={notifications.emailAlerts}
                     onCheckedChange={() => toggleNotification('emailAlerts')}
                   />
                 </div>
                 <Separator />
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label className="text-base">New Orders</Label>
                     <p className="text-xs text-muted-foreground">Notify when a new order is placed</p>
                   </div>
                   <Switch 
                     checked={notifications.newOrders}
                     onCheckedChange={() => toggleNotification('newOrders')}
                   />
                 </div>
                 <Separator />
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label className="text-base">System Updates</Label>
                     <p className="text-xs text-muted-foreground">Get notified about platform maintenance</p>
                   </div>
                   <Switch 
                     checked={notifications.systemUpdates}
                     onCheckedChange={() => toggleNotification('systemUpdates')}
                   />
                 </div>
                 <Separator />
                 <div className="flex items-center justify-between">
                   <div className="space-y-0.5">
                     <Label className="text-base">New Users</Label>
                     <p className="text-xs text-muted-foreground">Notify when a new user registers</p>
                   </div>
                   <Switch 
                     checked={notifications.newUsers}
                     onCheckedChange={() => toggleNotification('newUsers')}
                   />
                 </div>
               </CardContent>
             </Card>
          )}

        </div>
      </div>
    </div>
  );
}