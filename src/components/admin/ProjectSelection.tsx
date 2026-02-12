import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Building2,
  Users,
  Home,
  TrendingUp,
  Plus,
  Search,
  LogOut,
  Settings,
  ArrowRight,
  Bell,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Project {
  id: string;
  name: string;
  logo?: string;
  description: string;
  totalProperties: number;
  activeUsers: number;
  status: "active" | "inactive";
  type: string;
}

const mockProjects: Project[] = [
  {
    id: "P001",
    name: "Mumbai Central Marketplace",
    description: "Premium residential and commercial properties in Mumbai",
    totalProperties: 324,
    activeUsers: 1248,
    status: "active",
    type: "Public Marketplace",
  },
  {
    id: "P002",
    name: "Builder XYZ Portfolio",
    description: "Exclusive builder properties across multiple cities",
    totalProperties: 156,
    activeUsers: 542,
    status: "active",
    type: "Builder Network",
  },
  {
    id: "P003",
    name: "Private Exchange Network",
    description: "Members-only property exchange platform",
    totalProperties: 89,
    activeUsers: 234,
    status: "active",
    type: "Exchange Only",
  },
  {
    id: "P004",
    name: "Bangalore Tech Hub",
    description: "Co-working spaces and tech office properties",
    totalProperties: 67,
    activeUsers: 456,
    status: "active",
    type: "Commercial",
  },
  {
    id: "P005",
    name: "Goa Resorts & Villas",
    description: "Luxury vacation homes and resort properties",
    totalProperties: 43,
    activeUsers: 189,
    status: "active",
    type: "Vacation Rentals",
  },
  {
    id: "P006",
    name: "Delhi NCR Mega Projects",
    description: "Large-scale residential and mixed-use developments",
    totalProperties: 201,
    activeUsers: 892,
    status: "active",
    type: "Developer Network",
  },
];

interface ProjectSelectionProps {
  onSelectProject: (projectId: string) => void;
  onLogout: () => void;
}

export function ProjectSelection({ onSelectProject, onLogout }: ProjectSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Top Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl">BuiltGlory Admin</h1>
                <p className="text-xs text-muted-foreground">Project Management</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl mb-2">Select a Project</h2>
            <p className="text-muted-foreground">
              Choose a marketplace to manage or create a new project
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border/50 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl">{mockProjects.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Home className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Properties</p>
                    <p className="text-2xl">
                      {mockProjects.reduce((acc, p) => acc + p.totalProperties, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl">
                      {mockProjects.reduce((acc, p) => acc + p.activeUsers, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Projects</p>
                    <p className="text-2xl">
                      {mockProjects.filter((p) => p.status === "active").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Create */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name, type, or description..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4" />
              Create New Project
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="border-border/50 hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden"
              onClick={() => onSelectProject(project.id)}
            >
              <CardContent className="p-0">
                {/* Project Header with Gradient */}
                <div className="h-24 bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                    {project.type}
                  </Badge>
                </div>

                {/* Project Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg mb-1 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{project.totalProperties}</span>
                      <span className="text-muted-foreground">Properties</span>
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{project.activeUsers}</span>
                      <span className="text-muted-foreground">Users</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                    Manage Project
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl mb-2">No projects found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Try adjusting your search criteria or create a new project
            </p>
            <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4" />
              Create New Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
