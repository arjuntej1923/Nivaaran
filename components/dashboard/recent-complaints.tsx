"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronRight, Eye, Clock, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { Complaint, Status } from "@/lib/types";
import Link from "next/link";

const priorityColors = {
  high: "bg-destructive/20 text-destructive border-destructive/30",
  medium: "bg-warning/20 text-warning border-warning/30",
  low: "bg-muted text-muted-foreground border-border",
};

const statusColors = {
  open: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  "in-progress": "bg-chart-2/20 text-chart-2 border-chart-2/30",
  escalated: "bg-destructive/20 text-destructive border-destructive/30",
  resolved: "bg-success/20 text-success border-success/30",
  pending: "bg-warning/20 text-warning border-warning/30",
};

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export function RecentComplaints() {
  const { complaints, updateComplaintStatus, selectComplaint, addNotification } = useAppStore();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStatusChange = (complaintId: string, newStatus: Status) => {
    updateComplaintStatus(complaintId, newStatus);
    addNotification({
      title: "Status Updated",
      message: `Complaint ${complaintId} status changed to ${newStatus}`,
      type: "success",
    });
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setDialogOpen(true);
  };

  const handleOpenInAgent = (complaint: Complaint) => {
    selectComplaint(complaint);
    setDialogOpen(false);
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Recent Complaints
          </CardTitle>
          <Link href="/genome">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complaints.slice(0, 5).map((complaint) => (
              <div
                key={complaint.id}
                className="flex items-center gap-4 rounded-lg border border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary group"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {complaint.customer.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{complaint.customer.name}</span>
                    <span className="text-xs text-muted-foreground">{complaint.id}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{complaint.summary}</p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", priorityColors[complaint.priority])}
                    >
                      {complaint.priority}
                    </Badge>
                    <Select
                      value={complaint.status}
                      onValueChange={(value: Status) => handleStatusChange(complaint.id, value)}
                    >
                      <SelectTrigger 
                        className={cn(
                          "h-6 w-auto text-xs border px-2",
                          statusColors[complaint.status]
                        )}
                      >
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
                    <span className="text-xs text-muted-foreground">{complaint.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(complaint.createdAt)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleViewDetails(complaint)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {selectedComplaint.customer.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <DialogTitle>{selectedComplaint.customer.name}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        {selectedComplaint.id} | {selectedComplaint.category}
                      </DialogDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={cn(priorityColors[selectedComplaint.priority])}>
                      {selectedComplaint.priority}
                    </Badge>
                    <Badge variant="outline" className={cn(statusColors[selectedComplaint.status])}>
                      {selectedComplaint.status}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Complaint Details</h4>
                  <p className="text-sm text-muted-foreground">{selectedComplaint.description}</p>
                  {selectedComplaint.amount && (
                    <p className="text-sm text-foreground mt-2">
                      Amount: <span className="font-semibold">Rs. {selectedComplaint.amount.toLocaleString()}</span>
                    </p>
                  )}
                  {selectedComplaint.transactionId && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Transaction ID: {selectedComplaint.transactionId}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Customer Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {selectedComplaint.customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {selectedComplaint.customer.phone}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">SLA Status</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-muted-foreground">
                        Deadline: {new Date(selectedComplaint.slaDeadline).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Assigned to: {selectedComplaint.assignedTo}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                  <Link href="/agent">
                    <Button onClick={() => handleOpenInAgent(selectedComplaint)}>
                      Open in Agent Assist
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
