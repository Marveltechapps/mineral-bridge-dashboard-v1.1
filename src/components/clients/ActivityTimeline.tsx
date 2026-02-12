import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Home,
  Clock
} from "lucide-react";

interface TimelineActivity {
  id: string;
  type: 'message' | 'call' | 'email' | 'meeting' | 'document' | 'viewing';
  title: string;
  description: string;
  timestamp: Date;
  avatar?: string;
  status?: 'completed' | 'pending' | 'cancelled';
}

interface ActivityTimelineProps {
  activities: TimelineActivity[];
  maxItems?: number;
}

const defaultActivities: TimelineActivity[] = [
  {
    id: '1',
    type: 'message',
    title: 'New message received',
    description: 'Interested in scheduling a viewing for the downtown apartment',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    status: 'pending'
  },
  {
    id: '2',
    type: 'call',
    title: 'Phone call completed',
    description: 'Discussed property details and financing options',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    status: 'completed'
  },
  {
    id: '3',
    type: 'viewing',
    title: 'Property viewing scheduled',
    description: 'Villa tour at 123 Oak Street - Tomorrow 2:00 PM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    status: 'pending'
  },
  {
    id: '4',
    type: 'email',
    title: 'Contract documents sent',
    description: 'Purchase agreement and disclosure forms sent for review',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'completed'
  },
  {
    id: '5',
    type: 'meeting',
    title: 'Client consultation',
    description: 'Initial meeting to discuss requirements and budget',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    status: 'completed'
  }
];

export function ActivityTimeline({ activities = defaultActivities, maxItems = 10 }: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message': return MessageCircle;
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Calendar;
      case 'document': return FileText;
      case 'viewing': return Home;
      default: return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'message': return 'text-blue-600 bg-blue-50';
      case 'call': return 'text-green-600 bg-green-50';
      case 'email': return 'text-purple-600 bg-purple-50';
      case 'meeting': return 'text-orange-600 bg-orange-50';
      case 'document': return 'text-gray-600 bg-gray-50';
      case 'viewing': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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

  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h3 className="font-medium mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {displayActivities.map((activity, index) => {
            const IconComponent = getActivityIcon(activity.type);
            const isLast = index === displayActivities.length - 1;
            
            return (
              <div key={activity.id} className="relative flex items-start space-x-3">
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200" />
                )}
                
                {/* Activity icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                {/* Activity content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        {activity.status && (
                          <Badge variant="secondary" className={`text-xs ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {activity.avatar && (
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={activity.avatar} />
                            <AvatarFallback className="text-xs">U</AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {activities.length > maxItems && (
          <div className="text-center mt-4">
            <button className="text-sm text-primary hover:underline">
              View all activities ({activities.length})
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}