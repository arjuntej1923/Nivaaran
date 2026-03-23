"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, Paperclip, Clock, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Status } from "@/lib/types";
import { cn } from "@/lib/utils";

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function calculateSLA(deadline: string): { text: string; urgent: boolean } {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 0) return { text: "SLA Breached", urgent: true };
  if (diffHours < 2) return { text: `${diffHours}h remaining`, urgent: true };
  if (diffHours < 24) return { text: `${diffHours}h remaining`, urgent: false };
  const diffDays = Math.floor(diffHours / 24);
  return { text: `${diffDays}d remaining`, urgent: false };
}

export function ActiveTicket() {
  const { selectedComplaint, updateComplaintStatus, addMessage, addNotification } = useAppStore();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedComplaint?.messages]);

  if (!selectedComplaint) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
          Select a complaint from the dashboard to view details
        </CardContent>
      </Card>
    );
  }

  const slaStatus = calculateSLA(selectedComplaint.slaDeadline);

  const handleStatusChange = (status: Status) => {
    updateComplaintStatus(selectedComplaint.id, status);
    addNotification({
      title: "Status Updated",
      message: `Complaint ${selectedComplaint.id} status changed to ${status}`,
      type: "success",
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    setSending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addMessage(selectedComplaint.id, {
      sender: "agent",
      senderName: "Rahul Sharma (You)",
      senderInitials: "RS",
      content: message,
      timestamp: new Date().toISOString(),
    });
    
    setMessage("");
    setSending(false);
    
    addNotification({
      title: "Message Sent",
      message: `Response sent to ${selectedComplaint.customer.name}`,
      type: "success",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/20 text-primary text-lg">
                {selectedComplaint.customer.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold text-card-foreground">
                  {selectedComplaint.customer.name}
                </CardTitle>
                <Badge className={cn(
                  selectedComplaint.priority === "high" 
                    ? "bg-destructive/20 text-destructive border-destructive/30"
                    : selectedComplaint.priority === "medium"
                    ? "bg-warning/20 text-warning border-warning/30"
                    : "bg-muted text-muted-foreground"
                )}>
                  {selectedComplaint.priority} Priority
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{selectedComplaint.id} | {selectedComplaint.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn(
              "border",
              slaStatus.urgent 
                ? "bg-destructive/20 text-destructive border-destructive/30" 
                : "bg-warning/20 text-warning border-warning/30"
            )}>
              <Clock className="h-3 w-3 mr-1" />
              SLA: {slaStatus.text}
            </Badge>
            <Select value={selectedComplaint.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-32 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Complaint Details */}
        <div className="rounded-lg bg-secondary/50 p-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Complaint Details</h4>
          <p className="text-sm text-muted-foreground">
            {selectedComplaint.description}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span>Received: {new Date(selectedComplaint.createdAt).toLocaleString()}</span>
            <span>|</span>
            <span>Channel: {selectedComplaint.channel.replace("-", " ")}</span>
            {selectedComplaint.amount && (
              <>
                <span>|</span>
                <span>Amount: Rs. {selectedComplaint.amount.toLocaleString()}</span>
              </>
            )}
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Conversation</h4>
          
          <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
            {selectedComplaint.messages.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                No messages yet. Start the conversation below.
              </div>
            ) : (
              selectedComplaint.messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className={cn(
                      "text-xs",
                      msg.sender === "customer" 
                        ? "bg-primary/20 text-primary" 
                        : "bg-chart-1 text-foreground"
                    )}>
                      {msg.senderInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "flex-1 rounded-lg p-3",
                    msg.sender === "customer" 
                      ? "bg-secondary" 
                      : "bg-primary/10 border border-primary/20"
                  )}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">{msg.senderName}</span>
                      <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Reply Box */}
        <div className="space-y-3">
          <Textarea
            placeholder="Type your response... (Press Enter to send, Shift+Enter for new line)"
            className="min-h-24 bg-secondary border-border resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
          />
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Paperclip className="h-4 w-4 mr-2" />
              Attach
            </Button>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="border-border"
                onClick={() => {
                  addNotification({
                    title: "Draft Saved",
                    message: "Your response has been saved as a draft",
                    type: "info",
                  });
                }}
              >
                Save Draft
              </Button>
              <Button onClick={handleSendMessage} disabled={sending || !message.trim()}>
                {sending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Response
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
