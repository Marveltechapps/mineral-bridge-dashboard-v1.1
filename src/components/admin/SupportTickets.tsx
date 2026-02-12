import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  MessageSquare,
  Search,
  Filter,
  UserPlus,
  Clock,
  AlertCircle,
  CheckCircle,
  Send,
  Paperclip,
  Bell,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Ticket {
  id: string;
  user: string;
  property: string;
  subject: string;
  message: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "new" | "in-progress" | "assigned" | "closed";
  assignedAgent?: string;
  timestamp: string;
  messages: Array<{
    sender: string;
    message: string;
    timestamp: string;
    isSupport: boolean;
  }>;
}

const mockTickets: Ticket[] = [
  {
    id: "T001",
    user: "Rajesh Kumar",
    property: "Skyline Towers - Unit 402",
    subject: "Property verification documents needed",
    message: "I need help uploading the property verification documents. The system is not accepting my PDF files.",
    priority: "high",
    status: "new",
    timestamp: "2024-11-08 10:30",
    messages: [
      {
        sender: "Rajesh Kumar",
        message: "I need help uploading the property verification documents. The system is not accepting my PDF files.",
        timestamp: "2024-11-08 10:30",
        isSupport: false,
      },
    ],
  },
  {
    id: "T002",
    user: "Priya Sharma",
    property: "Green Valley Villa",
    subject: "Payment confirmation delay",
    message: "The payment was made 3 days ago but still showing pending in my dashboard.",
    priority: "urgent",
    status: "in-progress",
    assignedAgent: "Sarah Mitchell",
    timestamp: "2024-11-07 14:15",
    messages: [
      {
        sender: "Priya Sharma",
        message: "The payment was made 3 days ago but still showing pending in my dashboard.",
        timestamp: "2024-11-07 14:15",
        isSupport: false,
      },
      {
        sender: "Sarah Mitchell",
        message: "Hi Priya, I'm looking into this issue. Can you please share your transaction reference number?",
        timestamp: "2024-11-07 15:30",
        isSupport: true,
      },
    ],
  },
  {
    id: "T003",
    user: "Ahmed Al-Rashid",
    property: "Marina Bay Apartment",
    subject: "Property inspection scheduling",
    message: "Would like to schedule a property inspection for next week. Please advise on available time slots.",
    priority: "medium",
    status: "assigned",
    assignedAgent: "John Davis",
    timestamp: "2024-11-06 09:45",
    messages: [
      {
        sender: "Ahmed Al-Rashid",
        message: "Would like to schedule a property inspection for next week. Please advise on available time slots.",
        timestamp: "2024-11-06 09:45",
        isSupport: false,
      },
    ],
  },
  {
    id: "T004",
    user: "Sanya Malhotra",
    property: "Riverside Penthouse",
    subject: "Thank you for smooth transaction",
    message: "Everything went smoothly. Great service!",
    priority: "low",
    status: "closed",
    assignedAgent: "David Kumar",
    timestamp: "2024-11-05 16:20",
    messages: [
      {
        sender: "Sanya Malhotra",
        message: "Everything went smoothly. Great service!",
        timestamp: "2024-11-05 16:20",
        isSupport: false,
      },
      {
        sender: "David Kumar",
        message: "Thank you for your feedback! We're happy to help.",
        timestamp: "2024-11-05 16:45",
        isSupport: true,
      },
    ],
  },
];

const mockAgents = [
  "Sarah Mitchell",
  "John Davis",
  "Lisa Anderson",
  "Emma Wilson",
  "David Kumar",
];

export function SupportTickets() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [newMessage, setNewMessage] = useState("");

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
      medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      urgent: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[priority as keyof typeof colors];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      "in-progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      assigned: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      closed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return colors[status as keyof typeof colors];
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSheetOpen(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          sender: "Support Team",
          message: newMessage,
          timestamp: new Date().toLocaleString(),
          isSupport: true,
        },
      ],
    };

    setTickets(
      tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t))
    );
    setSelectedTicket(updatedTicket);
    setNewMessage("");
    toast.success("Message sent successfully");
  };

  const handleAssignAgent = (ticketId: string, agent: string) => {
    setTickets(
      tickets.map((t) =>
        t.id === ticketId
          ? { ...t, assignedAgent: agent, status: "assigned" }
          : t
      )
    );
    toast.success(`Ticket assigned to ${agent}`);
  };

  const handleCloseTicket = (ticketId: string) => {
    setTickets(
      tickets.map((t) =>
        t.id === ticketId ? { ...t, status: "closed" } : t
      )
    );
    setSheetOpen(false);
    toast.success("Ticket closed successfully");
  };

  const ticketCounts = {
    total: tickets.length,
    new: tickets.filter((t) => t.status === "new").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    assigned: tickets.filter((t) => t.status === "assigned").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Support Tickets</h1>
          <p className="text-muted-foreground">
            Manage customer support requests and enquiries
          </p>
        </div>
        <Button className="gap-2">
          <MessageSquare className="h-4 w-4" />
          New Ticket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl">{ticketCounts.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-2xl">{ticketCounts.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl">{ticketCounts.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <UserPlus className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assigned</p>
                <p className="text-2xl">{ticketCounts.assigned}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Closed</p>
                <p className="text-2xl">{ticketCounts.closed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets by user, property, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.map((ticket) => (
          <Card
            key={ticket.id}
            className="border-border/50 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleViewTicket(ticket)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm text-muted-foreground">
                      {ticket.id}
                    </span>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                  </div>
                  <h3 className="font-medium mb-2">{ticket.subject}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span>{ticket.user}</span>
                    <span>•</span>
                    <span>{ticket.property}</span>
                    <span>•</span>
                    <span>{ticket.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticket.message}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {ticket.assignedAgent ? (
                    <Badge variant="outline" className="gap-1">
                      <UserPlus className="h-3 w-3" />
                      {ticket.assignedAgent}
                    </Badge>
                  ) : (
                    <Select
                      onValueChange={(agent) => handleAssignAgent(ticket.id, agent)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Assign Agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAgents.map((agent) => (
                          <SelectItem key={agent} value={agent}>
                            {agent}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    View Thread
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ticket Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-[800px] overflow-y-auto">
          {selectedTicket && (
            <>
              <SheetHeader>
                <SheetTitle>Ticket Details - {selectedTicket.id}</SheetTitle>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Ticket Info */}
                <Card className="border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(selectedTicket.priority)}>
                        {selectedTicket.priority}
                      </Badge>
                      <Badge className={getStatusColor(selectedTicket.status)}>
                        {selectedTicket.status}
                      </Badge>
                    </div>
                    <h3 className="font-medium">{selectedTicket.subject}</h3>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">User:</span> {selectedTicket.user}</p>
                      <p><span className="text-muted-foreground">Property:</span> {selectedTicket.property}</p>
                      <p><span className="text-muted-foreground">Submitted:</span> {selectedTicket.timestamp}</p>
                      {selectedTicket.assignedAgent && (
                        <p><span className="text-muted-foreground">Assigned to:</span> {selectedTicket.assignedAgent}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Message Thread */}
                <div className="space-y-4">
                  <h4 className="font-medium">Message Thread</h4>
                  <div className="space-y-3">
                    {selectedTicket.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg ${
                          msg.isSupport
                            ? "bg-blue-50 dark:bg-blue-950/20 ml-8"
                            : "bg-muted/50 mr-8"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{msg.sender}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp}
                          </span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reply Section */}
                {selectedTicket.status !== "closed" && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Send Reply</h4>
                    <Textarea
                      placeholder="Type your message..."
                      rows={4}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <Button className="gap-2" onClick={handleSendMessage}>
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Paperclip className="h-4 w-4" />
                        Attach File
                      </Button>
                      <Button variant="outline" className="gap-2 ml-auto">
                        <Bell className="h-4 w-4" />
                        Add Reminder
                      </Button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  {selectedTicket.status !== "closed" && (
                    <Button
                      variant="outline"
                      onClick={() => handleCloseTicket(selectedTicket.id)}
                      className="flex-1"
                    >
                      Close Ticket
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    Auto-Reply Template
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
