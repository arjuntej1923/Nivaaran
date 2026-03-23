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
  DialogDescription,
} from "@/components/ui/dialog";
import { Lightbulb, ChevronRight, CheckCircle2, Play, AlertTriangle, ArrowUpRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface RootCause {
  id: number;
  cause: string;
  confidence: number;
  impact: "High" | "Medium" | "Low";
  complaints: number;
  recommendation: string;
  status: "identified" | "in-progress" | "resolved";
  details: string;
  timeline: string;
  owner: string;
}

export function RootCauseAnalysis() {
  const { selectedCluster, addNotification } = useAppStore();
  const [selectedCause, setSelectedCause] = useState<RootCause | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionStates, setActionStates] = useState<Record<number, "identified" | "in-progress" | "resolved">>({});

  const rootCauses: RootCause[] = selectedCluster ? [
    {
      id: 1,
      cause: selectedCluster.rootCauses[0] || "System Timeout Issues",
      confidence: 92,
      impact: "High",
      complaints: Math.round(selectedCluster.count * 0.57),
      recommendation: selectedCluster.recommendations[0] || "Implement retry mechanism",
      status: actionStates[1] || "identified",
      details: "Analysis of transaction logs shows that 92% of failures occur during NPCI gateway handshake. The timeout threshold of 30 seconds is being exceeded during peak hours (10 AM - 2 PM).",
      timeline: "Est. 2 weeks to implement",
      owner: "Payment Gateway Team",
    },
    {
      id: 2,
      cause: selectedCluster.rootCauses[1] || "Infrastructure Bottleneck",
      confidence: 87,
      impact: "High",
      complaints: Math.round(selectedCluster.count * 0.29),
      recommendation: selectedCluster.recommendations[1] || "Scale infrastructure",
      status: actionStates[2] || "identified",
      details: "Server CPU utilization spikes to 95%+ during peak hours, causing request queuing and timeouts.",
      timeline: "Est. 1 week to implement",
      owner: "Infrastructure Team",
    },
    {
      id: 3,
      cause: selectedCluster.rootCauses[2] || "Data Validation Gaps",
      confidence: 78,
      impact: "Medium",
      complaints: Math.round(selectedCluster.count * 0.14),
      recommendation: selectedCluster.recommendations[2] || "Add validation layer",
      status: actionStates[3] || "in-progress",
      details: "Invalid input data is not being caught early in the flow, leading to failures at later stages.",
      timeline: "Est. 3 days to implement",
      owner: "Backend Team",
    },
  ] : [];

  const handleStartAction = (causeId: number) => {
    setActionStates(prev => ({ ...prev, [causeId]: "in-progress" }));
    addNotification({
      title: "Action Started",
      message: "Remediation workflow initiated. Team has been notified.",
      type: "success",
    });
  };

  const handleViewDetails = (cause: RootCause) => {
    setSelectedCause(cause);
    setDialogOpen(true);
  };

  if (!selectedCluster) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-warning" />
            AI Root Cause Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Select a cluster to view root cause analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-warning" />
              AI Root Cause Analysis
              <Badge variant="outline" className="ml-2 bg-secondary border-border text-xs">
                {selectedCluster.name}
              </Badge>
            </CardTitle>
            <Badge variant="outline" className="bg-secondary border-border">
              Last analyzed: 2 hours ago
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rootCauses.map((cause) => {
              const currentStatus = actionStates[cause.id] || cause.status;
              return (
                <div
                  key={cause.id}
                  className="rounded-lg border border-border bg-secondary/50 p-4 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-medium text-foreground">{cause.cause}</h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            cause.impact === "High"
                              ? "bg-destructive/20 text-destructive border-destructive/30"
                              : cause.impact === "Medium"
                              ? "bg-warning/20 text-warning border-warning/30"
                              : "bg-chart-2/20 text-chart-2 border-chart-2/30"
                          )}
                        >
                          {cause.impact} Impact
                        </Badge>
                        {currentStatus === "in-progress" && (
                          <Badge variant="outline" className="bg-chart-2/20 text-chart-2 border-chart-2/30">
                            Fix in progress
                          </Badge>
                        )}
                        {currentStatus === "resolved" && (
                          <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Confidence: <span className="text-foreground font-medium">{cause.confidence}%</span></span>
                        <span>Affected: <span className="text-foreground font-medium">{cause.complaints} complaints</span></span>
                      </div>
                      <div className="mt-3 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <p className="text-sm text-muted-foreground">
                          <span className="text-foreground">Recommendation:</span> {cause.recommendation}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {currentStatus === "identified" && (
                        <Button 
                          size="sm" 
                          className="bg-success hover:bg-success/90"
                          onClick={() => handleStartAction(cause.id)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start Action
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(cause)}>
                        Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedCause && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-warning" />
                  Root Cause Details
                </DialogTitle>
                <DialogDescription>
                  {selectedCause.cause}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="text-xl font-bold text-foreground">{selectedCause.confidence}%</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">Affected Complaints</p>
                    <p className="text-xl font-bold text-foreground">{selectedCause.complaints}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Analysis Details</h4>
                  <p className="text-sm text-muted-foreground">{selectedCause.details}</p>
                </div>

                <div className="rounded-lg bg-secondary/50 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Recommendation</h4>
                  <p className="text-sm text-muted-foreground">{selectedCause.recommendation}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Timeline: {selectedCause.timeline}</span>
                    <span>Owner: {selectedCause.owner}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                  <Button>
                    Create Ticket
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
