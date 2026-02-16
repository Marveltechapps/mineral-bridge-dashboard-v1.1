import { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  MessageSquare,
  Paperclip,
  Send,
  MoreHorizontal,
  Archive,
  Phone
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { StatusBadge } from "../ui/status-badge";
import { useDashboardStore, getRegistryUserName } from "../../store/dashboardStore";
import { toast } from "sonner";

export interface EnquirySupportManagementProps {
  initialUserId?: string;
}

type TicketFilter = "all" | "Open" | "Resolved" | "Callback";

export function EnquirySupportManagement({ initialUserId }: EnquirySupportManagementProps = {}) {
  const { state, dispatch } = useDashboardStore();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [typeFilter, setTypeFilter] = useState<TicketFilter>("all");

  useEffect(() => {
    if (!initialUserId) return;
    const first = state.enquiries.find((e) => e.userId === initialUserId);
    if (first) setSelectedTicket(first.id);
  }, [initialUserId, state.enquiries]);

  const selectedEnquiry = useMemo(
    () => (selectedTicket ? state.enquiries.find((e) => e.id === selectedTicket) : null),
    [state.enquiries, selectedTicket]
  );

  const callbackCount = useMemo(
    () => state.enquiries.filter((e) => e.type === "Callback" && e.status !== "Resolved").length,
    [state.enquiries]
  );

  const tickets = useMemo(
    () =>
      state.enquiries
        .filter((e) => {
          if (typeFilter === "all") return true;
          if (typeFilter === "Callback") return e.type === "Callback";
          return e.status === typeFilter;
        })
        .map((e) => ({
          id: e.id,
          user: getRegistryUserName(state.registryUsers, e.userId) || "—",
          subject: e.subject,
          preview: e.preview,
          status: e.status,
          priority: e.priority,
          time: e.time,
          type: e.type,
        })),
    [state.enquiries, state.registryUsers, typeFilter]
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Ticket List Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-r border-border/50 bg-white dark:bg-slate-900 flex flex-col">
        <div className="p-4 border-b border-border/50">
          <h2 className="text-lg font-semibold mb-4">Support Tickets</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-9 bg-slate-50 dark:bg-slate-950"
            />
          </div>
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            <Badge
              variant={typeFilter === "all" ? "secondary" : "outline"}
              className={`cursor-pointer ${typeFilter === "all" ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800" : ""}`}
              onClick={() => setTypeFilter("all")}
            >
              All
            </Badge>
            <Badge
              variant={typeFilter === "Open" ? "secondary" : "outline"}
              className={`cursor-pointer ${typeFilter === "Open" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
              onClick={() => setTypeFilter("Open")}
            >
              Open
            </Badge>
            <Badge
              variant={typeFilter === "Resolved" ? "secondary" : "outline"}
              className={`cursor-pointer ${typeFilter === "Resolved" ? "bg-slate-100 dark:bg-slate-800" : ""}`}
              onClick={() => setTypeFilter("Resolved")}
            >
              Resolved
            </Badge>
            <Badge
              variant={typeFilter === "Callback" ? "secondary" : "outline"}
              className={`cursor-pointer gap-1 ${typeFilter === "Callback" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" : ""}`}
              onClick={() => setTypeFilter("Callback")}
            >
              <Phone className="w-3 h-3" />
              Callback {callbackCount > 0 && `(${callbackCount})`}
            </Badge>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="divide-y divide-border/50">
            {tickets.map((ticket) => (
              <div 
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                  selectedTicket === ticket.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm truncate pr-2">{ticket.user}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{ticket.time}</span>
                </div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                  {ticket.type === "Callback" && <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" title="Request callback from app" />}
                  {ticket.subject}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{ticket.preview}</p>
                <div className="flex gap-2">
                  <StatusBadge status={ticket.status} className="h-5 px-1.5 text-[10px]" />
                  <Badge variant="outline" className={`text-[10px] h-5 px-1.5 ${ticket.type === "Callback" ? "border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400" : ""}`}>
                    {ticket.type === "Callback" ? "Request callback" : ticket.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Ticket Detail View */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">
        {selectedEnquiry ? (
          <>
            <div className="p-6 border-b border-border/50 bg-white dark:bg-slate-900 flex justify-between items-start">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {(getRegistryUserName(state.registryUsers, selectedEnquiry.userId) || "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedEnquiry.type === "Callback" && <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400" title="Request callback from app" />}
                    {selectedEnquiry.subject}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm text-muted-foreground">Ticket #{selectedEnquiry.id}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{getRegistryUserName(state.registryUsers, selectedEnquiry.userId) || "—"}</span>
                    {selectedEnquiry.type === "Callback" && (
                      <>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">Request callback from app</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    dispatch({ type: "UPDATE_ENQUIRY", payload: { ...selectedEnquiry, status: "Resolved" } });
                    setSelectedTicket(null);
                    toast.success("Ticket closed", { description: "Status updated to Resolved." });
                  }}
                  disabled={selectedEnquiry.status === "Resolved"}
                >
                  <Archive className="w-4 h-4" />
                  Close Ticket
                </Button>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6 max-w-3xl mx-auto">
                {/* User Message */}
                <div className="flex gap-4">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-slate-100 text-slate-600">
                      {(getRegistryUserName(state.registryUsers, selectedEnquiry.userId) || "?").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">{getRegistryUserName(state.registryUsers, selectedEnquiry.userId) || "—"}</span>
                      <span className="text-xs text-muted-foreground">{selectedEnquiry.time}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-lg rounded-tl-none shadow-sm border border-border/50 text-sm">
                      <p>{selectedEnquiry.preview}</p>
                    </div>
                  </div>
                </div>

                {/* AI Suggestion Card */}
                <Card className="bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <MessageSquare className="w-4 h-4" />
                      AI Suggested Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-4 pb-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                      Based on the order status, the seller has uploaded documents but they are pending blockchain verification.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white">Use Response</Button>
                      <Button size="sm" variant="outline" className="h-8 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400">Dismiss</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Replies */}
                {(selectedEnquiry.replies ?? []).map((r, i) => (
                  <div key={i} className="flex gap-4 flex-row-reverse">
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-emerald-600 text-white">AD</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2 justify-end">
                        <span className="font-semibold text-sm">{r.admin}</span>
                        <span className="text-xs text-muted-foreground">{r.at}</span>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg rounded-tr-none shadow-sm border border-emerald-100 dark:border-emerald-900/30 text-sm">
                        <p className="whitespace-pre-wrap">{r.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border/50 bg-white dark:bg-slate-900">
              <div className="max-w-3xl mx-auto space-y-3">
                <Textarea
                  placeholder="Type your reply..."
                  className="min-h-[100px] resize-none"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                    onClick={() => {
                      if (!replyText.trim()) return;
                      const newReply = { admin: "Admin", text: replyText.trim(), at: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) };
                      const updated: typeof selectedEnquiry = {
                        ...selectedEnquiry,
                        status: selectedEnquiry.status === "Open" ? "In Progress" : selectedEnquiry.status,
                        replies: [...(selectedEnquiry.replies ?? []), newReply],
                      };
                      dispatch({ type: "UPDATE_ENQUIRY", payload: updated });
                      dispatch({
                        type: "ADD_APP_ACTIVITY",
                        payload: {
                          id: `act-${Date.now()}`,
                          userId: "1",
                          type: "enquiry_replied",
                          description: `Reply sent for enquiry: ${selectedEnquiry.subject}`,
                          at: new Date().toISOString(),
                          metadata: { enquiryId: selectedEnquiry.id, ...(selectedEnquiry.userId && { userId: selectedEnquiry.userId }) },
                        },
                      });
                      setReplyText("");
                      toast.success("Reply sent", { description: "Your reply has been added." });
                    }}
                    disabled={!replyText.trim() || selectedEnquiry.status === "Resolved"}
                  >
                    <Send className="w-4 h-4" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a ticket to view conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}