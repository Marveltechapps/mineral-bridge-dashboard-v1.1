import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video, 
  MoreHorizontal,
  CheckCheck,
  Check,
  Clock
} from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  isOwn: boolean;
}

interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
  role: 'buyer' | 'seller' | 'agent';
}

interface ChatInterfaceProps {
  participant: ChatParticipant;
  messages: ChatMessage[];
  onSendMessage?: (content: string) => void;
  onStartCall?: () => void;
  onStartVideo?: () => void;
}

const defaultMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: 'client1',
    senderName: 'Sarah Johnson',
    content: 'Hi! I\'m interested in the downtown apartment listing. Is it still available?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'text',
    status: 'read',
    isOwn: false
  },
  {
    id: '2',
    senderId: 'agent1',
    senderName: 'You',
    content: 'Hello Sarah! Yes, the apartment is still available. Would you like to schedule a viewing?',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    type: 'text',
    status: 'read',
    isOwn: true
  },
  {
    id: '3',
    senderId: 'client1',
    senderName: 'Sarah Johnson',
    content: 'That would be perfect! I\'m available this weekend. What times work for you?',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    type: 'text',
    status: 'read',
    isOwn: false
  },
  {
    id: '4',
    senderId: 'agent1',
    senderName: 'You',
    content: 'Great! I have openings on Saturday at 2 PM or Sunday at 11 AM. Which would you prefer?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'text',
    status: 'delivered',
    isOwn: true
  }
];

const defaultParticipant: ChatParticipant = {
  id: 'client1',
  name: 'Sarah Johnson',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
  status: 'online',
  role: 'buyer'
};

export function ChatInterface({ 
  participant = defaultParticipant, 
  messages = defaultMessages, 
  onSendMessage,
  onStartCall,
  onStartVideo 
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage?.(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending': return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent': return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'buyer': return 'bg-green-100 text-green-800';
      case 'seller': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickReplies = [
    "I'll call you back shortly",
    "Let me check the availability",
    "I can schedule that for you",
    "Thanks for your interest!"
  ];

  return (
    <Card className="h-[600px] flex flex-col bg-[var(--bio-sage-light)]/30">
      {/* Chat Header */}
      <CardHeader className="border-b bg-[var(--bio-green-light)]/50 border-[var(--bio-green)]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="bg-[var(--bio-green)] text-white">
                  {participant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <CardTitle className="text-sm">{participant.name}</CardTitle>
                <Badge className={`text-xs ${getRoleColor(participant.role)}`}>
                  {participant.role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {participant.status === 'online' ? 'Online now' : participant.lastSeen ? `Last seen ${participant.lastSeen.toLocaleTimeString()}` : 'Offline'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={onStartCall} className="hover:bg-[var(--bio-sky-light)]">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onStartVideo} className="hover:bg-[var(--bio-sky-light)]">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-1' : 'order-2'}`}>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-[var(--bio-green)] text-white rounded-br-sm'
                        : 'bg-white border border-[var(--bio-sage)]/20 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className={`flex items-center space-x-1 mt-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-xs text-muted-foreground">
                      {formatMessageTime(message.timestamp)}
                    </span>
                    {message.isOwn && getStatusIcon(message.status)}
                  </div>
                </div>
                
                {!message.isOwn && (
                  <Avatar className="h-6 w-6 order-1 mr-2">
                    <AvatarImage src={message.senderAvatar} />
                    <AvatarFallback className="text-xs bg-[var(--bio-sage)] text-white">
                      {message.senderName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      {/* Quick Replies */}
      <div className="border-t border-[var(--bio-sage)]/20 p-2">
        <div className="flex flex-wrap gap-1">
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setNewMessage(reply)}
              className="text-xs hover:bg-[var(--bio-moss-light)] hover:border-[var(--bio-moss)]"
            >
              {reply}
            </Button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-[var(--bio-sage)]/20 p-4 bg-white">
        <div className="flex items-end space-x-2">
          <Button variant="ghost" size="sm" className="hover:bg-[var(--bio-earth-light)]">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="border-[var(--bio-sage)]/30 focus:border-[var(--bio-green)] focus:ring-[var(--bio-green)]/20"
            />
          </div>
          <Button variant="ghost" size="sm" className="hover:bg-[var(--bio-earth-light)]">
            <Smile className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-[var(--bio-green)] hover:bg-[var(--bio-green)]/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}