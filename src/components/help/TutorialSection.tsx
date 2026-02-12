import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Progress } from "../ui/progress";
import { 
  Play,
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Bookmark,
  Eye
} from "lucide-react";

const tutorialCategories = [
  "All Categories",
  "Getting Started",
  "Property Management", 
  "Client Relations",
  "Analytics & Reports",
  "Settings & Configuration",
  "Advanced Features"
];

const tutorialData = [
  {
    id: "1",
    title: "Getting Started: Your First Property Listing",
    description: "Learn how to create your first property listing with photos, details, and pricing.",
    duration: "8:45",
    difficulty: "Beginner",
    category: "Getting Started",
    thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=225&fit=crop&crop=center",
    views: 1250,
    rating: 4.8,
    featured: true,
    completed: false
  },
  {
    id: "2", 
    title: "Client Communication Best Practices",
    description: "Master the art of client communication using our integrated messaging system.",
    duration: "12:30",
    difficulty: "Intermediate",
    category: "Client Relations",
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=225&fit=crop&crop=center",
    views: 890,
    rating: 4.9,
    featured: false,
    completed: true
  },
  {
    id: "3",
    title: "Advanced Analytics Dashboard Setup",
    description: "Configure custom analytics dashboards to track your most important metrics.",
    duration: "15:20",
    difficulty: "Advanced",
    category: "Analytics & Reports",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop&crop=center",
    views: 672,
    rating: 4.7,
    featured: true,
    completed: false
  },
  {
    id: "4",
    title: "Role Management and Security",
    description: "Set up user roles, permissions, and security features to protect your data.",
    duration: "10:15",
    difficulty: "Intermediate", 
    category: "Settings & Configuration",
    thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center",
    views: 543,
    rating: 4.6,
    featured: false,
    completed: false
  },
  {
    id: "5",
    title: "Property Photography Tips",
    description: "Professional techniques for capturing stunning property photos that sell.",
    duration: "6:30",
    difficulty: "Beginner",
    category: "Property Management",
    thumbnail: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=225&fit=crop&crop=center",
    views: 1456,
    rating: 4.9,
    featured: true,
    completed: false
  },
  {
    id: "6",
    title: "Integrating Third-Party Services",
    description: "Connect external tools like Google Calendar, CRM systems, and payment processors.",
    duration: "13:45",
    difficulty: "Advanced",
    category: "Advanced Features",
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=225&fit=crop&crop=center",
    views: 324,
    rating: 4.5,
    featured: false,
    completed: false
  }
];

export function TutorialSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");

  const filteredTutorials = tutorialData
    .filter(tutorial => {
      const matchesSearch = tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutorial.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || tutorial.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case "rating":
          return b.rating - a.rating;
        case "views":
          return b.views - a.views;
        case "duration":
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-300";
      case "Intermediate": return "bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-950/20 dark:text-gray-300";
    }
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  const formatViews = (views: number) => {
    return views > 999 ? `${(views / 1000).toFixed(1)}k` : views.toString();
  };

  return (
    <div className="space-y-6">
      {/* Learning Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Your Learning Progress</h3>
              <p className="text-sm text-muted-foreground">Complete tutorials to unlock advanced features</p>
            </div>
            <Badge variant="secondary" className="gap-1">
              <BookOpen className="h-3 w-3" />
              1 of 6 completed
            </Badge>
          </div>
          <Progress value={16.7} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Beginner</span>
            <span>16% Complete</span>
            <span>Advanced</span>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Find Tutorials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tutorials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tutorialCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Tutorials */}
      {selectedCategory === "All Categories" && !searchTerm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Featured Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tutorialData.filter(t => t.featured).map((tutorial) => (
                <div key={tutorial.id} className="group cursor-pointer">
                  <div className="relative aspect-video mb-3 rounded-lg overflow-hidden">
                    <img 
                      src={tutorial.thumbnail} 
                      alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 text-black ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="text-xs">
                        {tutorial.duration}
                      </Badge>
                    </div>
                    {tutorial.completed && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-green-600 text-white text-xs">
                          Completed
                        </Badge>
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium mb-1 group-hover:text-blue-600">{tutorial.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                      {tutorial.difficulty}
                    </Badge>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatViews(tutorial.views)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {tutorial.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tutorial Grid/List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {searchTerm ? `Search Results (${filteredTutorials.length})` : 
               selectedCategory === "All Categories" ? "All Tutorials" : selectedCategory}
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTutorials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tutorials found matching your criteria.</p>
              <p className="text-sm">Try different keywords or categories.</p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? 
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : 
              "space-y-4"
            }>
              {filteredTutorials.map((tutorial) => (
                <div key={tutorial.id} className={`group cursor-pointer ${
                  viewMode === "list" ? "flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow" : ""
                }`}>
                  <div className={`relative ${
                    viewMode === "grid" ? "aspect-video mb-3" : "w-48 aspect-video flex-shrink-0"
                  } rounded-lg overflow-hidden`}>
                    <img 
                      src={tutorial.thumbnail} 
                      alt={tutorial.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="h-4 w-4 text-black ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        {tutorial.duration}
                      </Badge>
                    </div>
                    {tutorial.completed && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-600 text-white text-xs">
                          Completed
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className={viewMode === "list" ? "flex-1" : ""}>
                    <div className={`flex items-start justify-between ${viewMode === "list" ? "mb-2" : "mb-1"}`}>
                      <h4 className="font-medium group-hover:text-blue-600 flex-1 leading-tight">
                        {tutorial.title}
                      </h4>
                      <Button variant="ghost" size="sm" className="ml-2 opacity-0 group-hover:opacity-100">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {viewMode === "list" && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {tutorial.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>
                        {tutorial.difficulty}
                      </Badge>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatViews(tutorial.views)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {tutorial.rating}
                      </span>
                      {viewMode === "list" && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {tutorial.duration}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {viewMode === "list" && (
                      <div className="flex items-center gap-2 mt-3">
                        <Button size="sm" className="gap-2">
                          <Play className="h-3 w-3" />
                          {tutorial.completed ? "Watch Again" : "Start Tutorial"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bookmark className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Path Suggestion */}
      <Card className="bg-purple-50 dark:bg-purple-950/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-950/40 rounded-full">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-1">Recommended Learning Path</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Follow our curated sequence of tutorials to master the platform efficiently.
              </p>
              <Button variant="outline" className="gap-2">
                <Play className="h-4 w-4" />
                Start Learning Path
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}