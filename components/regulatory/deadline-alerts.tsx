"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, ArrowRight, CheckCircle2, User, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

const agents = [
  { id: "1", name: "Rahul Sharma" },
  { id: "2", name: "Priya Verma" },
  { id: "3", name: "Amit Patel" },
  { id: "4", name: "Meera Tiwari" },
];

export function DeadlineAlerts() {
  const { complianceDeadlines, complaints, selectComplaint, addNotification } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<typeof complianceDeadlines[0] | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const urgentCount = complianceDeadlines.filter(d => d.status === "at-risk" || d.hoursRemaining <= 4).length;

  const getStatusStyle = (deadline: typeof complianceDeadlines[0]) => {
    if (deadline.status === "breached") {
      return {
        badge: "bg-destructive text-destructive-foreground",
        bg: "bg-destructive/10",
        border: "border-l-destructive",
      };
    }
    if (deadline.status === "at-risk" || deadline.hoursRemaining <= 4) {
      return {
        badge: "bg-warning text-foreground",
        bg: "bg-warning/10",
        border: "border-l-warning",
      };
    }
    return {
      badge: "bg-chart-2 text-foreground",
      bg: "bg-chart-2/10",
      border: "border-l-chart-2",
    };
  };

  const handleOpenDetails = (deadline: typeof complianceDeadlines[0]) => {
    setSelectedDeadline(deadline);
    setDialogOpen(true);
  };

  const handleAssign = async (deadlineId: string, agentId: string) => {
    setAssigning(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const agent = agents.find(a => a.id === agentId);
    setAssignments(prev => ({ ...prev, [deadlineId]: agent?.name || "" }));
    setAssigning(false);
    
    addNotification({
      title: "Agent Assigned",
      message: `${agent?.name} has been assigned to complaint ${deadlineId}`,
      type: "success",
    });
  };

  const handleOpenInAgent = (deadline: typeof complianceDeadlines[0]) => {
    const complaint = complaints.find(c => c.id === deadline.complaintId);
    if (complaint) {
      selectComplaint(complaint);
      setDialogOpen(false);
    }
  };

  const sortedDeadlines = [...complianceDeadlines].sort((a, b) => a.hoursRemaining - b.hoursRemaining);

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Approaching Deadlines
          </CardTitle>
          {urgentCount > 0 && (
            <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30 animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {urgentCount} urgent
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {complianceDeadlines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-sm">No approaching deadlines</p>
              <p className="text-xs">All complaints are within SLA</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedDeadlines.map((deadline) => {
                const styles = getStatusStyle(deadline);
                const currentAssignment = assignments[deadline.id] || deadline.assignedTo;
                
                return (
                  <div
                    key={deadline.id}
                    className={cn(
                      "rounded-lg border border-border border-l-4 p-3 cursor-pointer transition-colors hover:bg-secondary/50",
                      styles.bg,
                      styles.border
                    )}
                    onClick={() => handleOpenDetails(deadline)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">{deadline.customerName}</span>
                          <span className="text-xs text-muted-foreground">{deadline.complaintId}</span>
                          <Badge className={cn("text-xs", styles.badge)}>
                            {deadline.hoursRemaining <= 0 ? "Breached" : `${deadline.hoursRemaining}h left`}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span>{deadline.category}</span>
                          <span>|</span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {currentAssignment}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedDeadline && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Clock className={cn(
                    "h-5 w-5",
                    selectedDeadline.status === "at-risk" ? "text-warning" : "text-chart-2"
                  )} />
                  <DialogTitle>Deadline Details</DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Complaint</span>
                    <span className="text-sm font-medium text-foreground">{selectedDeadline.complaintId}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Customer</span>
                    <span className="text-sm font-medium text-foreground">{selectedDeadline.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm text-foreground">{selectedDeadline.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Deadline</span>
                    <Badge className={cn("text-xs", getStatusStyle(selectedDeadline).badge)}>
                      {selectedDeadline.hoursRemaining <= 0 
                        ? "Breached" 
                        : `${selectedDeadline.hoursRemaining}h remaining`
                      }
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-3">Assigned Agent</h4>
                  <Select
                    value={agents.find(a => a.name === (assignments[selectedDeadline.id] || selectedDeadline.assignedTo))?.id}
                    onValueChange={(value) => handleAssign(selectedDeadline.id, value)}
                    disabled={assigning}
                  >
                    <SelectTrigger className="w-full bg-secondary border-border">
                      {assigning ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Assigning...
                        </div>
                      ) : (
                        <SelectValue placeholder="Select agent" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                  <Link href="/agent">
                    <Button onClick={() => handleOpenInAgent(selectedDeadline)}>
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
