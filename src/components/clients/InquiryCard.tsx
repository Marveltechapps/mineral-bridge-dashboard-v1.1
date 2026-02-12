import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  DollarSign,
  Home,
  Star
} from "lucide-react";

interface Inquiry {
  id: string;
  clientName: string;
  clientAvatar?: string;
  clientType: 'buyer' | 'seller' | 'renter';
  status: 'new' | 'in-progress' | 'pending' | 'closed';
  priority: 'low' | 'medium' | 'high';
  property: {
    title: string;
    location: string;
    price: string;
    type: string;
  };
  message: string;
  timestamp: Date;
  engagementLevel: number; // 1-5 stars
  lastActivity: string;
  unreadCount?: number;
}

interface InquiryCardProps {
  inquiry: Inquiry;
  onReply?: (inquiryId: string) => void;
  onCall?: (inquiryId: string) => void;
  onEmail?: (inquiryId: string) => void;
}

export function InquiryCard({ inquiry, onReply, onCall, onEmail }: InquiryCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const renderEngagementStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < level ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-[var(--bio-sage)]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={inquiry.clientAvatar} />
                <AvatarFallback className="bg-[var(--bio-green-light)] text-[var(--bio-green)]">
                  {inquiry.clientName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {inquiry.unreadCount && inquiry.unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {inquiry.unreadCount}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium truncate">{inquiry.clientName}</h4>
                <Badge className={`text-xs ${getClientTypeColor(inquiry.clientType)}`}>
                  {inquiry.clientType}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {renderEngagementStars(inquiry.engagementLevel)}
                </div>
                <span className="text-xs text-muted-foreground">engagement</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={`text-xs ${getStatusColor(inquiry.status)}`}>
              {inquiry.status.replace('-', ' ')}
            </Badge>
            <Badge variant="outline" className={`text-xs ${getPriorityColor(inquiry.priority)}`}>
              {inquiry.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Property Info */}
        <div className="bg-[var(--bio-sage-light)] border border-[var(--bio-sage)]/20 rounded-lg p-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Home className="h-4 w-4 text-[var(--bio-green)]" />
              <span className="font-medium text-sm text-[var(--bio-green)]">{inquiry.property.title}</span>
            </div>
            <Badge variant="secondary" className="text-xs">{inquiry.property.type}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{inquiry.property.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3" />
              <span>{inquiry.property.price}</span>
            </div>
          </div>
        </div>

        {/* Message Preview */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.message}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(inquiry.timestamp)}</span>
            </div>
            <span>{inquiry.lastActivity}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onReply?.(inquiry.id)}
            className="flex-1 gap-1 hover:bg-[var(--bio-green-light)] hover:border-[var(--bio-green)]"
          >
            <MessageCircle className="h-3 w-3" />
            Reply
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onCall?.(inquiry.id)}
            className="gap-1 hover:bg-[var(--bio-sky-light)] hover:border-[var(--bio-sky)]"
          >
            <Phone className="h-3 w-3" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEmail?.(inquiry.id)}
            className="gap-1 hover:bg-[var(--bio-earth-light)] hover:border-[var(--bio-earth)]"
          >
            <Mail className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}