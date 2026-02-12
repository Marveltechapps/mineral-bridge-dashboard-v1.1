import { useState } from "react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "../ui/sidebar";
import { Button } from "../ui/button";
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  HelpCircle,
  Menu,
  LogOut,
  Bell,
  ChevronDown,
  Moon,
  Sun,
  Gem as GemIcon,
  ShoppingCart,
  MessageSquare,
  DollarSign,
  Megaphone,
  LayoutDashboard,
  ShieldCheck,
  FileText,
  Gavel,
  Search
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
  { icon: Users, label: "Miner Dashboard (Mobile)", view: "miner-dashboard" },
  { icon: Users, label: "User Management", view: "users" },
  { icon: GemIcon, label: "Buy Management", view: "minerals" },
  { icon: GemIcon, label: "Sell Management", view: "sell-minerals" },
  { icon: ShoppingCart, label: "Orders & Settlements", view: "orders" },
  { icon: MessageSquare, label: "Enquiry & Support", view: "enquiries" },
  { icon: DollarSign, label: "Financial & Reporting", view: "finance" },
  { icon: Megaphone, label: "Content & Marketing", view: "content" },
  { icon: BarChart3, label: "Analytics & Insights", view: "analytics" },
  { icon: ShieldCheck, label: "Compliance & Verification", view: "compliance" },
  { icon: Gavel, label: "Disputes & Resolution", view: "disputes" },
  { 
    icon: Users, 
    label: "Partner & Vendor Management", 
    view: "partners", 
    badge: "NEW",
    subItems: [
      { label: "Testing & Certification", view: "partners" },
      { label: "Logistics", view: "logistics" },
      { label: "Insurance", view: "insurance" }
    ]
  },
  { icon: Settings, label: "Settings", view: "settings" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentView?: string;
  onViewChange?: (view: string) => void;
  onLogout?: () => void;
}

export function DashboardLayout({ children, currentView = "dashboard", onViewChange, onLogout }: DashboardLayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full ${isDarkMode ? 'dark' : ''}`}>
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="border-b border-border/50 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                <GemIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Mineral Bridge</h2>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <div className="flex flex-col">
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.view === currentView || (currentView === "sell-order-detail" && item.view === "sell-minerals") || (currentView === "buy-order-detail" && item.view === "minerals") || (currentView === "mineral-detail" && item.view === "minerals") || (currentView === "mineral-form" && item.view === "minerals")}
                      tooltip={item.label}
                      className={`
                        ${item.view === currentView 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }
                      `}
                    >
                      <button 
                        onClick={() => onViewChange?.(item.view)}
                        className={`flex items-center space-x-3 px-4 py-2.5 w-full text-left rounded-lg transition-all duration-200 ${
                          (item.view === currentView || (currentView === "sell-order-detail" && item.view === "sell-minerals") || (currentView === "buy-order-detail" && item.view === "minerals") || (currentView === "mineral-detail" && item.view === "minerals") || (currentView === "mineral-form" && item.view === "minerals"))
                            ? '!bg-emerald-600 !text-white shadow-md' 
                            : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                      >
                        <item.icon className={`h-4 w-4 transition-colors ${(item.view === currentView || (currentView === "sell-order-detail" && item.view === "sell-minerals") || (currentView === "buy-order-detail" && item.view === "minerals") || (currentView === "mineral-detail" && item.view === "minerals") || (currentView === "mineral-form" && item.view === "minerals")) ? '!text-white' : 'text-slate-400'}`} />
                        <span className={`text-sm font-medium transition-colors flex-1 truncate ${(item.view === currentView || (currentView === "sell-order-detail" && item.view === "sell-minerals") || (currentView === "buy-order-detail" && item.view === "minerals") || (currentView === "mineral-detail" && item.view === "minerals") || (currentView === "mineral-form" && item.view === "minerals")) ? '!text-white' : ''}`}>{item.label}</span>
                      </button>
                    </SidebarMenuButton>
                    
                    {item.subItems && (item.view === currentView || item.subItems.some(sub => sub.view === currentView)) && (
                      <div className="ml-9 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-800 pl-4 py-1">
                        {item.subItems.map((sub, subIdx) => (
                          <button
                            key={subIdx}
                            onClick={() => onViewChange?.(sub.view)}
                            className={`block w-full text-left text-xs py-2 px-3 rounded-md transition-colors ${
                              currentView === sub.view 
                                ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20' 
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-border/50 p-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 px-2">
                <Avatar className="w-9 h-9 border border-emerald-100 dark:border-emerald-900">
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-sm">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-slate-900 dark:text-slate-100">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@mineralbridge.com</p>
                </div>
              </div>
              {onLogout && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onLogout}
                  className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
          <header className="border-b border-border/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50">
            <div className="flex h-16 items-center px-6 gap-4">
              <SidebarTrigger className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </SidebarTrigger>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Overview</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>

              <div className="relative flex-1 max-w-md mx-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search orders, users, minerals..."
                  className="pl-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus-visible:ring-emerald-500/20"
                />
              </div>

              <div className="ml-auto flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-slate-500" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg relative hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => onViewChange?.('notifications')}
                >
                  <Bell className="h-4 w-4 text-slate-500" />
                  <Badge className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full p-0 bg-red-500 border-2 border-white dark:border-slate-900">
                    <span className="sr-only">Notifications</span>
                  </Badge>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 gap-2 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="bg-emerald-600 text-white text-xs">
                          AD
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">admin@mineralbridge.com</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onViewChange?.('settings')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewChange?.('enquiries')} className="cursor-pointer">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}