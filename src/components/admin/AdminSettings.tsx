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
  FileText,
  CreditCard,
  Mail,
  MessageSquare,
  BarChart2,
  ExternalLink
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
import { useRoleOptional } from "../../contexts/RoleContext";
import type { StoredAdmin } from "../../contexts/RoleContext";
import { ADMIN_ROLES } from "../../lib/permissions";
import { toast } from "sonner";
import { useEffect } from "react";

const ADMIN_ROLE_LABELS = ADMIN_ROLES.map((r) => ({ value: r.value, label: r.label }));

const INTEGRATIONS_STORAGE_KEY = "mineral_bridge_integrations";

const DEFAULT_INTEGRATIONS = [
  { id: "stripe", name: "Stripe Payments", connected: false, lastSync: "-", icon: CreditCard },
  { id: "sendgrid", name: "SendGrid Email", connected: true, lastSync: "1 day ago", icon: Mail },
  { id: "slack", name: "Slack Notifications", connected: false, lastSync: "-", icon: MessageSquare },
  { id: "analytics", name: "Google Analytics", connected: true, lastSync: "5 mins ago", icon: BarChart2 },
];

function loadIntegrations(): typeof DEFAULT_INTEGRATIONS {
  try {
    const raw = localStorage.getItem(INTEGRATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 4) {
        return parsed.map((p: { id: string; name: string; connected: boolean; lastSync: string }) => ({
          ...p,
          icon: DEFAULT_INTEGRATIONS.find((d) => d.id === p.id)?.icon ?? Database,
        }));
      }
    }
  } catch (_) {}
  return DEFAULT_INTEGRATIONS;
}

function saveIntegrations(integrations: typeof DEFAULT_INTEGRATIONS) {
  const toSave = integrations.map(({ icon: _, ...rest }) => rest);
  localStorage.setItem(INTEGRATIONS_STORAGE_KEY, JSON.stringify(toSave));
}

export function AdminSettings() {
  const { state } = useDashboardStore();
  const roleContext = useRoleOptional();
  const currentRole = roleContext?.role ?? "ceo";
  const isCeo = currentRole === "ceo";
  const adminUsers = roleContext?.adminRegistry ?? [];
  const [activeTab, setActiveTab] = useState("general");

  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isManageRolesOpen, setIsManageRolesOpen] = useState(false);
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "Operations Manager" });
  const [editingUser, setEditingUser] = useState<StoredAdmin | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");

  // Role Permissions Data – 4-level hierarchy
  const [roles, setRoles] = useState([
    { name: "CEO / Super Admin", description: "Full system access: all modules, user management, billing, system config", permissions: { financials: { view: true, edit: true, delete: true }, operations: { view: true, edit: true, delete: true }, content: { view: true, edit: true, delete: true }, users: { view: true, edit: true, delete: true } } },
    { name: "Operations Manager", description: "Orders, Financial & Reporting, Transport; view Enquiry/User Mgmt", permissions: { financials: { view: true, edit: true, delete: false }, operations: { view: true, edit: true, delete: false }, content: { view: false, edit: false, delete: false }, users: { view: true, edit: false, delete: false } } },
    { name: "Support Agent", description: "Enquiry & Support, User Mgmt (basic); view Orders read-only", permissions: { financials: { view: false, edit: false, delete: false }, operations: { view: true, edit: false, delete: false }, content: { view: false, edit: false, delete: false }, users: { view: true, edit: false, delete: false } } },
    { name: "Data Entry Clerk", description: "View Orders, log calls, basic status; no money, LC, Analytics, User Mgmt", permissions: { financials: { view: false, edit: false, delete: false }, operations: { view: true, edit: false, delete: false }, content: { view: false, edit: false, delete: false }, users: { view: false, edit: false, delete: false } } },
  ]);

  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState("CEO / Super Admin");
  /** Dynamic permission column names (View, Edit, Delete + any added). */
  const [permissionColumns, setPermissionColumns] = useState(["view", "edit", "delete"]);
  const [newColumnName, setNewColumnName] = useState("");
  const [newModuleName, setNewModuleName] = useState("");
  const [editingModuleKey, setEditingModuleKey] = useState<string | null>(null);
  const [editingModuleLabel, setEditingModuleLabel] = useState("");

  // Notifications State
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    newOrders: true,
    newUsers: false,
    systemUpdates: true,
    marketing: false
  });

  // Integrations State (persisted in localStorage)
  const [integrations, setIntegrations] = useState(() => loadIntegrations());
  const [configuringId, setConfiguringId] = useState<string | null>(null);
  const [configForm, setConfigForm] = useState<Record<string, string>>({});

  useEffect(() => {
    saveIntegrations(integrations);
  }, [integrations]);

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleIntegration = (id: string) => {
    setIntegrations(integrations.map(int =>
      int.id === id
        ? { ...int, connected: !int.connected, lastSync: int.connected ? "-" : int.lastSync }
        : int
    ));
  };

  const openConfigure = (id: string) => {
    setConfiguringId(id);
    setConfigForm({});
  };

  const saveIntegrationConfig = () => {
    if (!configuringId) return;
    setIntegrations(integrations.map(int =>
      int.id === configuringId
        ? { ...int, connected: true, lastSync: "Just now" }
        : int
    ));
    toast.success("Integration connected", { description: "Settings saved. In production, these would be sent to your backend." });
    setConfiguringId(null);
    setConfigForm({});
  };

  const removeAdmin = (id: string) => {
    roleContext?.removeAdmin(id);
  };

  const handleAddAdmin = () => {
    const roleValue = ADMIN_ROLES.find((r) => r.label === newAdmin.role)?.value ?? "data_clerk";
    if (!newAdmin.name?.trim() || !newAdmin.email?.trim()) return;
    if (newAdmin.password.length < 4) return;
    if (newAdmin.password !== newAdmin.confirmPassword) return;
    roleContext?.addAdmin({
      name: newAdmin.name.trim(),
      email: newAdmin.email.trim().toLowerCase(),
      password: newAdmin.password,
      role: roleValue,
    });
    setNewAdmin({ name: "", email: "", password: "", confirmPassword: "", role: "Operations Manager" });
    setIsAddAdminOpen(false);
  };

  const handleEditClick = (user: StoredAdmin) => {
    setEditingUser(user);
    setEditPassword("");
    setEditConfirmPassword("");
    setIsEditAdminOpen(true);
  };

  const handleUpdateAdmin = () => {
    if (!editingUser || !editingUser.name?.trim() || !editingUser.email?.trim()) return;
    if (editPassword && editPassword !== editConfirmPassword) return;
    roleContext?.updateAdmin(editingUser.id, {
      name: editingUser.name.trim(),
      email: editingUser.email.trim().toLowerCase(),
      role: editingUser.role,
      status: editingUser.status,
      ...(editPassword ? { password: editPassword } : {}),
    });
    setIsEditAdminOpen(false);
    setEditingUser(null);
    setEditPassword("");
    setEditConfirmPassword("");
  };

  // Helper to get current role permissions for the dialog
  const currentRoleForEdit = roles.find(r => r.name === selectedRoleForEdit) || roles[0];

  const togglePermission = (module: string, type: string) => {
    setRoles(roles.map(role => {
      if (role.name === selectedRoleForEdit) {
        const perms = role.permissions[module] ?? {};
        return {
          ...role,
          permissions: {
            ...role.permissions,
            [module]: { ...perms, [type]: !(perms as Record<string, boolean>)[type] }
          }
        };
      }
      return role;
    }));
  };

  const handleAddColumn = () => {
    const col = newColumnName.trim().toLowerCase().replace(/\s+/g, "_");
    if (!col || permissionColumns.includes(col)) return;
    setPermissionColumns((prev) => [...prev, col]);
    setRoles(roles.map((role) => ({
      ...role,
      permissions: Object.fromEntries(
        Object.entries(role.permissions).map(([mod, perms]) => [
          mod,
          { ...(perms as Record<string, boolean>), [col]: role.name === "CEO / Super Admin" }
        ])
      )
    })));
    setNewColumnName("");
  };

  const handleAddModule = () => {
    const key = newModuleName.trim().toLowerCase().replace(/\s+/g, "_");
    if (!key) return;
    const hasAlready = roles.some((r) => key in r.permissions);
    if (hasAlready) return;
    setRoles(roles.map((role) => ({
      ...role,
      permissions: {
        ...role.permissions,
        [key]: Object.fromEntries(
          permissionColumns.map((c) => [c, role.name === "CEO / Super Admin"])
        ) as Record<string, boolean>
      }
    })));
    setNewModuleName("");
  };

  const handleRenameModule = (oldKey: string, newKey: string) => {
    const key = newKey.trim().toLowerCase().replace(/\s+/g, "_");
    if (!key || key === oldKey) {
      setEditingModuleKey(null);
      return;
    }
    setRoles(roles.map((role) => {
      const perms = { ...role.permissions };
      if (perms[oldKey]) {
        perms[key] = perms[oldKey];
        delete perms[oldKey];
      }
      return { ...role, permissions: perms };
    }));
    setEditingModuleKey(null);
  };

  const handleRemoveModule = (moduleKey: string) => {
    setRoles(roles.map((role) => {
      const perms = { ...role.permissions };
      delete perms[moduleKey];
      return { ...role, permissions: perms };
    }));
  };

  const handleRemoveColumn = (col: string) => {
    if (permissionColumns.length <= 1) return;
    setPermissionColumns((prev) => prev.filter((c) => c !== col));
    setRoles(roles.map((role) => ({
      ...role,
      permissions: Object.fromEntries(
        Object.entries(role.permissions).map(([mod, perms]) => {
          const p = { ...(perms as Record<string, boolean>) };
          delete p[col];
          return [mod, p];
        })
      )
    })));
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
                      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                        <DialogHeader>
                          <DialogTitle>Role Permissions</DialogTitle>
                          <DialogDescription>
                            Configure granular access levels for each administrative role. Add new columns or modules below.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Tabs defaultValue="CEO / Super Admin" value={selectedRoleForEdit} onValueChange={setSelectedRoleForEdit} className="w-full flex-1 min-h-0 flex flex-col">
                           <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg w-full justify-start overflow-x-auto shrink-0">
                              {roles.map(r => (
                                <TabsTrigger key={r.name} value={r.name} className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">{r.name}</TabsTrigger>
                              ))}
                           </TabsList>
                           <div className="mt-4 flex-1 min-h-0 overflow-auto">
                             <div className="mb-4">
                               <h4 className="font-semibold text-sm">{currentRoleForEdit.name}</h4>
                               <p className="text-xs text-muted-foreground">{currentRoleForEdit.description}</p>
                             </div>

                             {/* Add new column */}
                             <div className="flex flex-wrap items-center gap-2 mb-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                               <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">Add permission column</Label>
                               <Input
                                 placeholder="e.g. Export, Approve"
                                 value={newColumnName}
                                 onChange={(e) => setNewColumnName(e.target.value)}
                                 onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddColumn())}
                                 className="h-8 w-40 text-sm"
                               />
                               <Button type="button" size="sm" variant="secondary" className="h-8" onClick={handleAddColumn} disabled={!newColumnName.trim()}>
                                 Add column
                               </Button>
                             </div>

                             <Table>
                               <TableHeader>
                                 <TableRow>
                                   <TableHead className="w-[180px]">Module</TableHead>
                                   {permissionColumns.map((col) => (
                                     <TableHead key={col} className="text-center min-w-[80px]">
                                       <span className="capitalize">{col.replace(/_/g, " ")}</span>
                                       {permissionColumns.length > 1 && (
                                         <button
                                           type="button"
                                           className="ml-1 text-slate-400 hover:text-red-500 text-xs"
                                           onClick={() => handleRemoveColumn(col)}
                                           aria-label={`Remove ${col}`}
                                         >
                                           ×
                                         </button>
                                       )}
                                     </TableHead>
                                   ))}
                                 </TableRow>
                               </TableHeader>
                               <TableBody>
                                 {Object.entries(currentRoleForEdit.permissions).map(([moduleKey, perms]) => (
                                   <TableRow key={moduleKey}>
                                     <TableCell className="p-1 align-middle">
                                       {editingModuleKey === moduleKey ? (
                                         <Input
                                           className="h-8 text-sm font-medium"
                                           value={editingModuleLabel}
                                           onChange={(e) => setEditingModuleLabel(e.target.value)}
                                           onBlur={() => handleRenameModule(moduleKey, editingModuleLabel)}
                                           onKeyDown={(e) => {
                                             if (e.key === "Enter") handleRenameModule(moduleKey, editingModuleLabel);
                                             if (e.key === "Escape") setEditingModuleKey(null);
                                           }}
                                           autoFocus
                                         />
                                       ) : (
                                         <div className="flex items-center gap-1">
                                           <span className="font-medium capitalize text-sm">{moduleKey === "users" ? "User Management" : moduleKey.replace(/_/g, " ")}</span>
                                           <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-slate-400" onClick={() => { setEditingModuleKey(moduleKey); setEditingModuleLabel(moduleKey); }} aria-label="Rename module">
                                             <Edit className="h-3 w-3" />
                                           </Button>
                                           <Button type="button" variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600" onClick={() => handleRemoveModule(moduleKey)} aria-label="Remove module">
                                             <Trash2 className="h-3 w-3" />
                                           </Button>
                                         </div>
                                       )}
                                     </TableCell>
                                     {permissionColumns.map((col) => (
                                       <TableCell key={col} className="text-center p-1">
                                         <Checkbox
                                           checked={!!(perms as Record<string, boolean>)[col]}
                                           onCheckedChange={() => togglePermission(moduleKey, col)}
                                           disabled={currentRoleForEdit.name === "CEO / Super Admin"}
                                         />
                                       </TableCell>
                                     ))}
                                   </TableRow>
                                 ))}
                                 <TableRow className="bg-slate-50/50 dark:bg-slate-800/30">
                                   <TableCell colSpan={permissionColumns.length + 1} className="p-2">
                                     <div className="flex flex-wrap items-center gap-2">
                                       <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">Add module row</Label>
                                       <Input
                                         placeholder="e.g. Reports, Analytics"
                                         value={newModuleName}
                                         onChange={(e) => setNewModuleName(e.target.value)}
                                         onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddModule())}
                                         className="h-8 w-40 text-sm"
                                       />
                                       <Button type="button" size="sm" variant="secondary" className="h-8" onClick={handleAddModule} disabled={!newModuleName.trim()}>
                                         Add module
                                       </Button>
                                     </div>
                                   </TableCell>
                                 </TableRow>
                               </TableBody>
                             </Table>
                           </div>
                        </Tabs>

                        <DialogFooter>
                          <Button onClick={() => setIsManageRolesOpen(false)}>Close</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {isCeo && (
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
                            <Label htmlFor="password" className="text-right">
                              Password
                            </Label>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Min 4 characters"
                              value={newAdmin.password}
                              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="confirmPassword" className="text-right">
                              Confirm password
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="Re-enter password"
                              value={newAdmin.confirmPassword}
                              onChange={(e) => setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })}
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
                                {ADMIN_ROLE_LABELS.map((r) => (
                                  <SelectItem key={r.value} value={r.label}>{r.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleAddAdmin} disabled={!newAdmin.password || newAdmin.password !== newAdmin.confirmPassword || newAdmin.password.length < 4}>Save User</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    )}

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
                                  value={roleContext?.getRoleLabel(editingUser.role) ?? editingUser.role} 
                                  onValueChange={(val) => setEditingUser({ ...editingUser, role: ADMIN_ROLES.find((r) => r.label === val)?.value ?? editingUser.role })}
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ADMIN_ROLE_LABELS.map((r) => (
                                    <SelectItem key={r.value} value={r.label}>{r.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-password" className="text-right">
                                New password
                              </Label>
                              <Input
                                id="edit-password"
                                type="password"
                                placeholder="Leave blank to keep current"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-confirmPassword" className="text-right">
                                Confirm new password
                              </Label>
                              <Input
                                id="edit-confirmPassword"
                                type="password"
                                placeholder="Re-enter to change"
                                value={editConfirmPassword}
                                onChange={(e) => setEditConfirmPassword(e.target.value)}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button onClick={handleUpdateAdmin} disabled={editPassword !== "" && (editPassword.length < 4 || editPassword !== editConfirmPassword)}>Update User</Button>
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
                           {roleContext?.getRoleLabel(user.role) ?? user.role}
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
                           {isCeo && (
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                             onClick={() => removeAdmin(user.id)}
                           >
                             <Trash2 className="w-4 h-4" />
                           </Button>
                           )}
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
                 <CardDescription>Connect with external services. Enter placeholders below; in production these would be sent to your backend.</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="grid gap-4">
                   {integrations.map((app) => {
                     const Icon = app.icon ?? Database;
                     return (
                       <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                         <div className="flex items-center gap-4">
                           <div className={`p-2 rounded-lg ${app.connected ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}>
                             <Icon className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="font-medium">{app.name}</p>
                             <p className="text-xs text-muted-foreground">
                               {app.connected ? `Synced: ${app.lastSync}` : "Not connected"}
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                           <Button variant="outline" size="sm" onClick={() => openConfigure(app.id)}>
                             {app.connected ? "Configure" : "Connect"}
                           </Button>
                           <Switch
                             checked={app.connected}
                             onCheckedChange={() => toggleIntegration(app.id)}
                           />
                         </div>
                       </div>
                     );
                   })}
                 </div>
                 <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                   <ExternalLink className="h-3 w-3" />
                   Frontend-only: credentials are not sent anywhere. Wire to your backend when ready.
                 </p>
               </CardContent>
             </Card>
          )}

          {/* Configure Integration Dialog */}
          <Dialog open={!!configuringId} onOpenChange={(open) => !open && setConfiguringId(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {configuringId === "stripe" && "Connect Stripe Payments"}
                  {configuringId === "sendgrid" && "Connect SendGrid Email"}
                  {configuringId === "slack" && "Connect Slack Notifications"}
                  {configuringId === "analytics" && "Connect Google Analytics"}
                </DialogTitle>
                <DialogDescription>
                  Enter your credentials (frontend demo only; not sent to any server). In production, use environment variables or a secure backend.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {configuringId === "stripe" && (
                  <>
                    <div className="space-y-2">
                      <Label>Publishable key</Label>
                      <Input
                        placeholder="pk_live_..."
                        value={configForm.publishableKey ?? ""}
                        onChange={(e) => setConfigForm((f) => ({ ...f, publishableKey: e.target.value }))}
                        type="password"
                        autoComplete="off"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Secret key</Label>
                      <Input
                        placeholder="sk_live_..."
                        value={configForm.secretKey ?? ""}
                        onChange={(e) => setConfigForm((f) => ({ ...f, secretKey: e.target.value }))}
                        type="password"
                        autoComplete="off"
                      />
                    </div>
                  </>
                )}
                {configuringId === "sendgrid" && (
                  <div className="space-y-2">
                    <Label>SendGrid API key</Label>
                    <Input
                      placeholder="SG...."
                      value={configForm.apiKey ?? ""}
                      onChange={(e) => setConfigForm((f) => ({ ...f, apiKey: e.target.value }))}
                      type="password"
                      autoComplete="off"
                    />
                  </div>
                )}
                {configuringId === "slack" && (
                  <div className="space-y-2">
                    <Label>Slack Incoming Webhook URL</Label>
                    <Input
                      placeholder="https://hooks.slack.com/services/..."
                      value={configForm.webhookUrl ?? ""}
                      onChange={(e) => setConfigForm((f) => ({ ...f, webhookUrl: e.target.value }))}
                      type="url"
                      autoComplete="off"
                    />
                  </div>
                )}
                {configuringId === "analytics" && (
                  <div className="space-y-2">
                    <Label>GA4 Measurement ID</Label>
                    <Input
                      placeholder="G-XXXXXXXXXX"
                      value={configForm.measurementId ?? ""}
                      onChange={(e) => setConfigForm((f) => ({ ...f, measurementId: e.target.value }))}
                      autoComplete="off"
                    />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfiguringId(null)}>Cancel</Button>
                <Button onClick={saveIntegrationConfig} className="bg-emerald-600 hover:bg-emerald-700">Save & connect</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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