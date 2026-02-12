import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Home, 
  Star,
  Edit,
  MessageCircle,
  FileText,
  TrendingUp
} from "lucide-react";

interface ClientProfile {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  location: string;
  clientType: 'buyer' | 'seller' | 'renter';
  status: 'active' | 'inactive' | 'potential';
  joinDate: Date;
  lastContact: Date;
  engagementScore: number; // 1-5
  budget?: {
    min: number;
    max: number;
  };
  preferences: {
    propertyTypes: string[];
    locations: string[];
    features: string[];
  };
  stats: {
    totalInquiries: number;
    propertiesViewed: number;
    totalSpent?: number;
    avgResponseTime: string;
  };
  notes: string[];
  tags: string[];
}

interface ProfileViewProps {
  profile: ClientProfile;
  onEdit?: () => void;
  onMessage?: () => void;
  onCall?: () => void;
}

const defaultProfile: ClientProfile = {
  id: 'client1',
  name: 'Sarah Johnson',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  email: 'sarah.johnson@email.com',
  phone: '+1 (555) 123-4567',
  location: 'Downtown, New York',
  clientType: 'buyer',
  status: 'active',
  joinDate: new Date('2024-01-15'),
  lastContact: new Date(Date.now() - 1000 * 60 * 60 * 2),
  engagementScore: 4,
  budget: {
    min: 2000,
    max: 3500
  },
  preferences: {
    propertyTypes: ['Apartment', 'Condo'],
    locations: ['Downtown', 'Midtown', 'Upper East Side'],
    features: ['Parking', 'Gym', 'Pool', 'Pet-friendly']
  },
  stats: {
    totalInquiries: 12,
    propertiesViewed: 8,
    avgResponseTime: '2h'
  },
  notes: [
    'Prefers modern apartments with natural light',
    'Works from home, needs dedicated office space',
    'Budget flexible for the right property'
  ],
  tags: ['High Priority', 'Quick Decision Maker', 'Referral Source']
};

export function ProfileView({ profile = defaultProfile, onEdit, onMessage, onCall }: ProfileViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'potential': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getClientTypeColor = (type: string) => {
    switch (type) {
      case 'buyer': return 'bg-green-100 text-green-800';
      case 'seller': return 'bg-blue-100 text-blue-800';
      case 'renter': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderEngagementStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < score ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatBudget = (budget: { min: number; max: number }) => {
    return `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-[var(--bio-green-light)] to-[var(--bio-sage-light)] border-[var(--bio-green)]/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-[var(--bio-green)] text-white text-lg">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-xl font-bold text-[var(--bio-green)]">{profile.name}</h2>
                  <Badge className={`${getClientTypeColor(profile.clientType)}`}>
                    {profile.clientType}
                  </Badge>
                  <Badge className={`${getStatusColor(profile.status)}`}>
                    {profile.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{profile.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-muted-foreground">Engagement:</span>
                  <div className="flex items-center">
                    {renderEngagementStars(profile.engagementScore)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onEdit} className="gap-2 hover:bg-white">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button variant="outline" onClick={onMessage} className="gap-2 hover:bg-[var(--bio-green-light)]">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
              <Button onClick={onCall} className="gap-2 bg-[var(--bio-green)] hover:bg-[var(--bio-green)]/90">
                <Phone className="h-4 w-4" />
                Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[var(--bio-green)]" />
              Client Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-[var(--bio-green-light)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--bio-green)]">{profile.stats.totalInquiries}</div>
                <div className="text-xs text-muted-foreground">Total Inquiries</div>
              </div>
              <div className="text-center p-3 bg-[var(--bio-sky-light)] rounded-lg">
                <div className="text-2xl font-bold text-[var(--bio-sky)]">{profile.stats.propertiesViewed}</div>
                <div className="text-xs text-muted-foreground">Properties Viewed</div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                <span className="text-sm font-medium">{profile.stats.avgResponseTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">{formatDate(profile.joinDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Contact</span>
                <span className="text-sm font-medium">{formatDate(profile.lastContact)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences & Budget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5 text-[var(--bio-green)]" />
              Preferences & Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.budget && (
              <div className="p-3 bg-[var(--bio-sage-light)] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Budget Range</span>
                  <DollarSign className="h-4 w-4 text-[var(--bio-green)]" />
                </div>
                <div className="text-lg font-bold text-[var(--bio-green)]">
                  {formatBudget(profile.budget)}
                </div>
              </div>
            )}
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Property Types</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.preferences.propertyTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Preferred Locations</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.preferences.locations.map((location, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Desired Features</h4>
                <div className="flex flex-wrap gap-1">
                  {profile.preferences.features.map((feature, index) => (
                    <Badge key={index} className="text-xs bg-[var(--bio-moss)] hover:bg-[var(--bio-moss)]/90">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes & Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[var(--bio-green)]" />
              Notes & Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {profile.tags.map((tag, index) => (
                  <Badge key={index} className="text-xs bg-[var(--bio-earth)] hover:bg-[var(--bio-earth)]/90">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Notes</h4>
              <div className="space-y-2">
                {profile.notes.map((note, index) => (
                  <div key={index} className="p-2 bg-[var(--bio-earth-light)] rounded text-xs">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}