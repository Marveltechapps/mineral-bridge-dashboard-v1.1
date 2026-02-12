import { ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  LayoutDashboard,
  Home,
  Users,
  TrendingUp,
  MessageSquare,
  CreditCard,
  Shield,
  Settings,
  Building2,
  Search,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  ArrowLeftRight,
  DollarSign,
  FileText,
  RefreshCw,
  Receipt,
  BarChart3,
  Wallet,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
  onSwitchProject: () => void;
  currentProject?: {
    id: string;
    name: string;
  };
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "properties", label: "Properties", icon: Home },
  { id: "users", label: "Users", icon: Users },
  { id: "marketplace", label: "Buy / Sell / Exchange", icon: TrendingUp },
  { id: "enquiries", label: "Enquiries & Support", icon: MessageSquare },
  { id: "payments", label: "Payments & Reports", icon: CreditCard },
  { id: "roles", label: "Roles & Permissions", icon: Shield },
  { id: "settings", label: "Settings", icon: Settings },
];

const financeMenuItems = [
  { id: "finance", label: "Overview", icon: DollarSign },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "commissions", label: "Commissions", icon: TrendingUp },
  { id: "refunds", label: "Refunds & Disputes", icon: RefreshCw },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "reports", label: "Reports & GST", icon: BarChart3 },
  { id: "gateways", label: "Payment Gateways", icon: Wallet },
];

export function AdminLayout({
  children,
  currentPage,
  onPageChange,
  onLogout,
  onSwitchProject,
  currentProject,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [financeExpanded, setFinanceExpanded] = useState(
    financeMenuItems.some((item) => item.id === currentPage)
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Header */}
      <header className="h-16 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="h-full px-4 flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="hidden lg:flex"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="hidden md:block font-medium">BuiltGlory</span>
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties, users, transactions..."
                className="pl-10 bg-muted/30"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="hidden md:flex"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-3 border-b border-border">
                  <p className="font-medium">Notifications</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {[
                    {
                      title: "New property listing",
                      desc: "Skyline Towers - Unit 402 added",
                      time: "2 min ago",
                    },
                    {
                      title: "Payment received",
                      desc: "₹2.5 Cr from Ahmed Al-Rashid",
                      time: "15 min ago",
                    },
                    {
                      title: "New enquiry",
                      desc: "Buy request for Marina Bay Apartment",
                      time: "1 hour ago",
                    },
                  ].map((notif, i) => (
                    <div
                      key={i}
                      className="p-3 hover:bg-muted/50 cursor-pointer border-b border-border/50 last:border-0"
                    >
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-muted-foreground">{notif.desc}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
                    AD
                  </div>
                  <span className="hidden md:block">Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@builtglory.com</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } hidden lg:block border-r border-border/50 bg-background transition-all duration-300 overflow-y-auto`}
        >
          <div className="p-4 space-y-2">
            {/* Project Switcher */}
            <Button
              variant="outline"
              className={`w-full ${
                sidebarOpen ? "justify-between" : "justify-center"
              } mb-4`}
              onClick={onSwitchProject}
            >
              {sidebarOpen ? (
                <>
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">
                      {currentProject?.name || "Select Project"}
                    </span>
                  </div>
                  <ArrowLeftRight className="h-4 w-4 flex-shrink-0" />
                </>
              ) : (
                <Building2 className="h-4 w-4" />
              )}
            </Button>

            {/* Menu Items */}
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full ${
                    sidebarOpen ? "justify-start" : "justify-center"
                  } ${isActive ? "" : "hover:bg-muted"}`}
                  onClick={() => {
                    onPageChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </Button>
              );
            })}

            {/* Finance Menu */}
            <Button
              variant="ghost"
              className={`w-full ${
                sidebarOpen ? "justify-between" : "justify-center"
              } ${financeExpanded ? "bg-muted/50" : ""}`}
              onClick={() => setFinanceExpanded(!financeExpanded)}
            >
              {sidebarOpen ? (
                <>
                  <div className="flex items-center gap-2 truncate">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">Finance</span>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                </>
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
            </Button>

            {financeExpanded &&
              financeMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full ${
                      sidebarOpen ? "justify-start" : "justify-center"
                    } ${isActive ? "" : "hover:bg-muted"}`}
                    onClick={() => {
                      onPageChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  </Button>
                );
              })}
          </div>
        </aside>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-40 lg:hidden">
            <div className="p-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between mb-4"
                onClick={onSwitchProject}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate text-sm">
                    {currentProject?.name || "Select Project"}
                  </span>
                </div>
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      onPageChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                );
              })}

              {/* Finance Menu */}
              <Button
                variant="ghost"
                className={`w-full ${
                  sidebarOpen ? "justify-between" : "justify-center"
                } ${financeExpanded ? "bg-muted/50" : ""}`}
                onClick={() => setFinanceExpanded(!financeExpanded)}
              >
                {sidebarOpen ? (
                  <>
                    <div className="flex items-center gap-2 truncate">
                      <DollarSign className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-sm">Finance</span>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0" />
                  </>
                ) : (
                  <DollarSign className="h-4 w-4" />
                )}
              </Button>

              {financeExpanded &&
                financeMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "ghost"}
                      className={`w-full ${
                        sidebarOpen ? "justify-start" : "justify-center"
                      } ${isActive ? "" : "hover:bg-muted"}`}
                      onClick={() => {
                        onPageChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {sidebarOpen && <span className="ml-3">{item.label}</span>}
                    </Button>
                  );
                })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}