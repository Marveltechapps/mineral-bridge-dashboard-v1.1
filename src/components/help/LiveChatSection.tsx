import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { 
  MessageCircle,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Bot,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Minimize2,
  Maximize2
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot" | "agent";
  timestamp: Date;
  type: "text" | "quick-reply" | "file" | "system";
  read?: boolean;
  suggestions?: string[];
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I'm here to help you with any questions about the property management platform. What can I assist you with today?",
    sender: "bot",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: "text",
    suggestions: [
      "How to add a property listing",
      "Setting up client communications", 
      "Understanding analytics reports",
      "Managing user roles"
    ]
  }
];

const supportAgents = [
  {
    id: "agent1",
    name: "Sarah Johnson",
    role: "Senior Support Specialist",
    avatar: "",
    status: "online",
    responseTime: "< 2 min"
  },
  {
    id: "agent2", 
    name: "Mike Chen",
    role: "Technical Support",
    avatar: "",
    status: "online",
    responseTime: "< 5 min"
  },
  {
    id: "agent3",
    name: "Emily Davis", 
    role: "Account Manager",
    avatar: "",
    status: "busy",
    responseTime: "< 10 min"
  }
];

export function LiveChatSection() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<"bot" | "agent">("bot");
  const [selectedAgent, setSelectedAgent] = useState(supportAgents[0]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [satisfaction, setSatisfaction] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot/agent response
    setTimeout(() => {
      setIsTyping(false);
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(content),
        sender: chatMode,
        timestamp: new Date(),
        type: "text"
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("property") || input.includes("listing")) {
      return "To add a new property listing, go to the Properties section and click 'Add Property'. Fill in the details like address, price, photos, and amenities. Would you like me to walk you through the specific steps?";
    } else if (input.includes("client") || input.includes("communication")) {
      return "Our client communication tools are in the Clients section. You can send messages, schedule appointments, and track all interactions. Would you like to know about any specific feature?";
    } else if (input.includes("analytics") || input.includes("report")) {
      return "The Analytics dashboard provides comprehensive insights into your business performance. You can view sales trends, property metrics, and client engagement data. What specific analytics are you interested in?";
    } else if (input.includes("user") || input.includes("role")) {
      return "User roles and permissions can be managed in the Role Management section. You can create custom roles, assign permissions, and manage user access. Need help with a specific aspect?";
    } else {
      return "I'd be happy to help! Could you provide more details about what you're trying to accomplish? Or would you prefer to connect with a human agent for personalized assistance?";
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const switchToAgent = () => {
    setChatMode("agent");
    const systemMessage: Message = {
      id: Date.now().toString(),
      content: `You've been connected to ${selectedAgent.name}. They'll be with you shortly.`,
      sender: "bot",
      timestamp: new Date(),
      type: "system"
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="space-y-6">
      {/* Support Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Our Support Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportAgents.map((agent) => (
              <div key={agent.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={agent.avatar} />
                      <AvatarFallback>{getInitials(agent.name)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      agent.status === "online" ? "bg-green-500" : 
                      agent.status === "busy" ? "bg-yellow-500" : "bg-gray-400"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{agent.name}</h4>
                    <p className="text-sm text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant={agent.status === "online" ? "default" : "secondary"}>
                    {agent.status}
                  </Badge>
                  <span className="text-muted-foreground">{agent.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Chat Interface */}
      <Card className={`${isMinimized ? "h-16" : "h-[600px]"} flex flex-col transition-all`}>
        <CardHeader className="pb-3 border-b cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {chatMode === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
              </div>
              <div>
                <h3 className="font-medium">
                  {chatMode === "bot" ? "AI Assistant" : selectedAgent.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {chatMode === "bot" ? "Instant responses" : "Typically responds in < 2 minutes"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {!isMinimized && (
                <>
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm">
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Chat Mode Toggle */}
            <div className="p-3 border-b bg-muted/20">
              <div className="flex items-center gap-2">
                <Button
                  variant={chatMode === "bot" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChatMode("bot")}
                  className="gap-2"
                >
                  <Bot className="h-3 w-3" />
                  AI Assistant
                </Button>
                <Button
                  variant={chatMode === "agent" ? "default" : "outline"}
                  size="sm"
                  onClick={switchToAgent}
                  className="gap-2"
                >
                  <User className="h-3 w-3" />
                  Human Agent
                </Button>
                {chatMode === "bot" && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Instant responses
                  </Badge>
                )}
              </div>
            </div>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}>
                  {message.sender !== "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback>
                        {message.sender === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[70%] ${message.sender === "user" ? "order-first" : ""}`}>
                    {message.type === "system" ? (
                      <div className="text-center text-sm text-muted-foreground italic py-2">
                        {message.content}
                      </div>
                    ) : (
                      <>
                        <div className={`rounded-lg px-4 py-2 ${
                          message.sender === "user" 
                            ? "bg-blue-600 text-white ml-auto" 
                            : "bg-muted"
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        
                        <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.sender === "user" && (
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                          )}
                        </div>

                        {/* Quick Reply Suggestions */}
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-muted-foreground">Quick replies:</p>
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="text-xs mr-2 mb-2"
                                onClick={() => handleQuickReply(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        {/* Message Actions */}
                        {message.sender !== "user" && (
                          <div className="flex items-center gap-1 mt-2">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {chatMode === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Textarea
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputValue);
                      }
                    }}
                    className="min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                  />
                </div>
                <Button 
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim()}
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-6">
          <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-medium mb-2">Phone Support</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Call us for immediate assistance
          </p>
          <p className="font-medium text-blue-600">+1 (555) 123-4567</p>
          <p className="text-xs text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
        </Card>
        
        <Card className="text-center p-6">
          <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-medium mb-2">Email Support</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Get detailed help via email
          </p>
          <p className="font-medium text-green-600">support@company.com</p>
          <p className="text-xs text-muted-foreground">Response within 4 hours</p>
        </Card>
        
        <Card className="text-center p-6">
          <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-3" />
          <h3 className="font-medium mb-2">Emergency Support</h3>
          <p className="text-sm text-muted-foreground mb-3">
            24/7 support for critical issues
          </p>
          <p className="font-medium text-orange-600">+1 (555) 999-0000</p>
          <p className="text-xs text-muted-foreground">Available 24/7</p>
        </Card>
      </div>

      {/* Satisfaction Survey */}
      {messages.length > 4 && satisfaction === null && (
        <Card className="bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-6 text-center">
            <h3 className="font-medium mb-2">How was your experience?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your feedback helps us improve our support.
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSatisfaction(rating)}
                  className="hover:bg-yellow-100"
                >
                  <Star className={`h-5 w-5 ${
                    rating <= (satisfaction || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`} />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}