import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  Bell, 
  Home, 
  Mail, 
  Phone, 
  MessageSquare, 
  Eye, 
  Check,
  Filter,
  Search,
  MapPin,
  Calendar,
  Clock,
  Send,
  X
} from "lucide-react";
import { Input } from "../ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";

interface Notification {
  id: string;
  type: "enquiry" | "viewing" | "offer" | "general";
  propertyName: string;
  propertyLocation: string;
  propertyPrice: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

// Mock notification data
const generateMockNotifications = (): Notification[] => {
  const now = new Date();
  const today = new Date(now);
  const yesterday = new Date(now.setDate(now.getDate() - 1));
  const thisWeek = new Date(now.setDate(now.getDate() - 3));
  const earlier = new Date(now.setDate(now.getDate() - 10));

  return [
    {
      id: "1",
      type: "enquiry",
      propertyName: "Modern Downtown Loft",
      propertyLocation: "123 Main Street, Downtown",
      propertyPrice: "$450,000",
      contactName: "Sarah Johnson",
      contactEmail: "sarah.j@email.com",
      contactPhone: "+1 (555) 123-4567",
      message: "I'm interested in scheduling a viewing for this property. Is it available this weekend?",
      timestamp: new Date(today.setHours(10, 30)),
      isRead: false,
    },
    {
      id: "2",
      type: "viewing",
      propertyName: "Luxury Waterfront Villa",
      propertyLocation: "789 Ocean Drive, Beachside",
      propertyPrice: "$1,250,000",
      contactName: "Michael Chen",
      contactEmail: "m.chen@email.com",
      contactPhone: "+1 (555) 234-5678",
      message: "Would like to confirm the viewing appointment scheduled for tomorrow at 2 PM.",
      timestamp: new Date(today.setHours(14, 15)),
      isRead: false,
    },
    {
      id: "3",
      type: "enquiry",
      propertyName: "Suburban Family Home",
      propertyLocation: "456 Oak Avenue, Suburbs",
      propertyPrice: "$625,000",
      contactName: "Emily Rodriguez",
      contactEmail: "emily.r@email.com",
      contactPhone: "+1 (555) 345-6789",
      message: "Can you provide more details about the school district and nearby amenities?",
      timestamp: new Date(yesterday.setHours(16, 45)),
      isRead: true,
    },
    {
      id: "4",
      type: "offer",
      propertyName: "Historic Townhouse",
      propertyLocation: "321 Heritage Lane, Old Town",
      propertyPrice: "$875,000",
      contactName: "David Wilson",
      contactEmail: "d.wilson@email.com",
      contactPhone: "+1 (555) 456-7890",
      message: "I would like to submit an offer for this property. Please contact me to discuss terms.",
      timestamp: new Date(yesterday.setHours(9, 20)),
      isRead: false,
    },
    {
      id: "5",
      type: "enquiry",
      propertyName: "Cozy Garden Cottage",
      propertyLocation: "567 Flower Street, Garden District",
      propertyPrice: "$385,000",
      contactName: "Lisa Anderson",
      contactEmail: "lisa.a@email.com",
      contactPhone: "+1 (555) 567-8901",
      message: "Is the property pet-friendly? I have two small dogs.",
      timestamp: new Date(thisWeek.setHours(11, 10)),
      isRead: true,
    },
    {
      id: "6",
      type: "enquiry",
      propertyName: "Penthouse Suite",
      propertyLocation: "999 Skyline Boulevard, Uptown",
      propertyPrice: "$2,100,000",
      contactName: "Robert Taylor",
      contactEmail: "r.taylor@email.com",
      contactPhone: "+1 (555) 678-9012",
      message: "Interested in learning more about the building amenities and HOA fees.",
      timestamp: new Date(thisWeek.setHours(15, 30)),
      isRead: false,
    },
    {
      id: "7",
      type: "viewing",
      propertyName: "Mountain View Cabin",
      propertyLocation: "234 Pine Ridge Road, Mountains",
      propertyPrice: "$525,000",
      contactName: "Jennifer Martinez",
      contactEmail: "j.martinez@email.com",
      contactPhone: "+1 (555) 789-0123",
      message: "Would like to schedule a viewing for next week. Tuesday or Wednesday preferred.",
      timestamp: new Date(earlier.setHours(13, 45)),
      isRead: true,
    },
    {
      id: "8",
      type: "enquiry",
      propertyName: "Urban Studio Apartment",
      propertyLocation: "888 City Center, Metro Area",
      propertyPrice: "$275,000",
      contactName: "James Brown",
      contactEmail: "j.brown@email.com",
      contactPhone: "+1 (555) 890-1234",
      message: "What is the monthly HOA fee? Also, is parking included?",
      timestamp: new Date(earlier.setHours(10, 15)),
      isRead: true,
    },
  ];
};

export function Notifications() {
  const [notifications, setNotifications] = useState(generateMockNotifications());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "read">("all");
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [responseSubject, setResponseSubject] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "enquiry":
        return "bg-blue-100 text-blue-700";
      case "viewing":
        return "bg-green-100 text-green-700";
      case "offer":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTimeCategory = (timestamp: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - timestamp.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays <= 7) return "This Week";
    return "Earlier";
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: Date) => {
    return timestamp.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, isRead: true })));
  };

  const handleRespond = (notification: Notification) => {
    setSelectedNotification(notification);
    setResponseSubject(`Re: Enquiry for ${notification.propertyName}`);
    setResponseMessage(`Dear ${notification.contactName},\n\nThank you for your interest in ${notification.propertyName}.\n\n`);
    setRespondDialogOpen(true);
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setDetailsSheetOpen(true);
  };

  const handleSendResponse = () => {
    // Here you would typically send the email via an API
    console.log("Sending response:", {
      to: selectedNotification?.contactEmail,
      subject: responseSubject,
      message: responseMessage,
    });
    
    // Show success message
    alert(`Response sent to ${selectedNotification?.contactName}!`);
    
    // Mark notification as read
    if (selectedNotification) {
      markAsRead(selectedNotification.id);
    }
    
    // Close dialog and reset
    setRespondDialogOpen(false);
    setResponseSubject("");
    setResponseMessage("");
    setSelectedNotification(null);
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch = 
      notif.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.propertyLocation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter =
      filterTab === "all" ||
      (filterTab === "unread" && !notif.isRead) ||
      (filterTab === "read" && notif.isRead);

    return matchesSearch && matchesFilter;
  });

  // Group notifications by time category
  const groupedNotifications = filteredNotifications.reduce((acc, notif) => {
    const category = getTimeCategory(notif.timestamp);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(notif);
    return acc;
  }, {} as Record<string, Notification[]>);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <div className="flex items-center gap-3">
            <h1>Notifications</h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Stay updated with property enquiries and viewing requests
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <Check className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications by property, contact, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as any)}>
          <TabsList className="h-10 bg-slate-100 dark:bg-slate-800 p-1 gap-1 rounded-lg">
            <TabsTrigger value="all" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="read" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-emerald-400">
              Read ({notifications.length - unreadCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notifications List */}
      <div className="space-y-6">
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3>No notifications found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "You're all caught up!"}
            </p>
          </div>
        ) : (
          ["Today", "Yesterday", "This Week", "Earlier"].map((category) => {
            const categoryNotifications = groupedNotifications[category];
            if (!categoryNotifications || categoryNotifications.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <h3 className="text-muted-foreground">{category}</h3>
                <div className="space-y-3">
                  {categoryNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-card rounded-lg border p-4 transition-colors ${
                        !notification.isRead ? "border-l-4 border-l-blue-500 bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant="secondary"
                                  className={`capitalize ${getNotificationTypeColor(
                                    notification.type
                                  )}`}
                                >
                                  {notification.type}
                                </Badge>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <h4 className="flex items-center gap-2">
                                <Home className="h-4 w-4 text-muted-foreground" />
                                {notification.propertyName}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {notification.propertyLocation}
                                </span>
                                <span className="font-medium text-foreground">
                                  {notification.propertyPrice}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground text-right">
                              <div className="flex items-center gap-1 justify-end">
                                <Clock className="h-3 w-3" />
                                {formatTime(notification.timestamp)}
                              </div>
                              <div className="flex items-center gap-1 justify-end mt-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(notification.timestamp)}
                              </div>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="bg-muted/50 rounded-md p-3 space-y-2">
                            <p className="text-sm">
                              <strong>Contact:</strong> {notification.contactName}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {notification.contactEmail}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {notification.contactPhone}
                              </span>
                            </div>
                          </div>

                          {/* Message */}
                          <div className="bg-background rounded-md p-3 border">
                            <p className="text-sm flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                              <span>{notification.message}</span>
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button 
                              size="sm" 
                              className="gap-2"
                              onClick={() => handleRespond(notification)}
                            >
                              <Mail className="h-3 w-3" />
                              Respond
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="gap-2"
                              onClick={() => handleViewDetails(notification)}
                            >
                              <Eye className="h-3 w-3" />
                              View Details
                            </Button>
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="gap-2"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3" />
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Respond Dialog */}
      <Dialog open={respondDialogOpen} onOpenChange={setRespondDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Response</DialogTitle>
            <DialogDescription>
              Compose a response to {selectedNotification?.contactName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">To</Label>
              <Input
                id="recipient"
                value={selectedNotification?.contactEmail || ""}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={responseSubject}
                onChange={(e) => setResponseSubject(e.target.value)}
                placeholder="Enter subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Type your response here..."
                rows={10}
              />
            </div>

            {selectedNotification && (
              <div className="bg-muted/50 rounded-md p-3 space-y-2 text-sm">
                <p><strong>Property:</strong> {selectedNotification.propertyName}</p>
                <p><strong>Original Message:</strong></p>
                <p className="text-muted-foreground italic">{selectedNotification.message}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRespondDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendResponse} className="gap-2">
              <Send className="h-4 w-4" />
              Send Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Sheet */}
      <Sheet open={detailsSheetOpen} onOpenChange={setDetailsSheetOpen}>
        <SheetContent className="w-full sm:max-w-[800px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Enquiry Details</SheetTitle>
            <SheetDescription>
              Complete information about this enquiry
            </SheetDescription>
          </SheetHeader>

          {selectedNotification && (
            <div className="space-y-6 py-6">
              {/* Property Information */}
              <div className="space-y-3">
                <h3>Property Information</h3>
                <div className="bg-card rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        {selectedNotification.propertyName}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {selectedNotification.propertyLocation}
                      </p>
                    </div>
                    <Badge className={getNotificationTypeColor(selectedNotification.type)}>
                      {selectedNotification.type}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">{selectedNotification.propertyPrice}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h3>Contact Information</h3>
                <div className="bg-card rounded-lg border p-4 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedNotification.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {selectedNotification.contactEmail}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selectedNotification.contactPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Enquiry Message */}
              <div className="space-y-3">
                <h3>Enquiry Message</h3>
                <div className="bg-card rounded-lg border p-4">
                  <p className="text-sm whitespace-pre-wrap">{selectedNotification.message}</p>
                </div>
              </div>

              {/* Timestamp */}
              <div className="space-y-3">
                <h3>Received</h3>
                <div className="bg-card rounded-lg border p-4 space-y-2">
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {formatDate(selectedNotification.timestamp)}
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {formatTime(selectedNotification.timestamp)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {getTimeCategory(selectedNotification.timestamp)}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <h3>Status</h3>
                <div className="bg-card rounded-lg border p-4">
                  <Badge variant={selectedNotification.isRead ? "secondary" : "destructive"}>
                    {selectedNotification.isRead ? "Read" : "Unread"}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button 
                  className="gap-2 flex-1"
                  onClick={() => {
                    setDetailsSheetOpen(false);
                    handleRespond(selectedNotification);
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Respond to Enquiry
                </Button>
                {!selectedNotification.isRead && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      markAsRead(selectedNotification.id);
                    }}
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Mark as Read
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
