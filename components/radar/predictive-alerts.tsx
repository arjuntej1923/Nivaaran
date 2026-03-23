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
import { Zap, Users, TrendingUp, CheckCircle2, X, Lightbulb, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { PredictiveAlert } from "@/lib/types";

const severityStyles = {
  critical: {
    badge: "bg-destructive text-destructive-foreground",
    border: "border-l-destructive",
    icon: "text-destructive",
  },
  high: {
    badge: "bg-warning text-foreground",
    border: "border-l-warning",
    icon: "text-warning",
  },
  medium: {
    badge: "bg-chart-1 text-foreground",
    border: "border-l-chart-1",
    icon: "text-chart-1",
  },
};

export function PredictiveAlerts() {
  const { predictiveAlerts, dismissAlert, addNotification } = useAppStore();
  const [selectedAlert, setSelectedAlert] = useState<PredictiveAlert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionsStarted, setActionsStarted] = useState<string[]>([]);

  const activeAlerts = predictiveAlerts.filter(a => !a.dismissed);

  const handleDismiss = (alertId: string) => {
    dismissAlert(alertId);
    addNotification({
      title: "Alert Dismissed",
      message: "Alert has been dismissed from the active list",
      type: "info",
    });
  };

  const handleTakeAction = (alert: PredictiveAlert) => {
    if (actionsStarted.includes(alert.id)) return;
    
    setActionsStarted([...actionsStarted, alert.id]);
    addNotification({
      title: "Action Initiated",
      message: alert.recommendedAction,
      type: "success",
    });
  };

  const handleViewDetails = (alert: PredictiveAlert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" />
            Predictive Alerts
            {activeAlerts.length > 0 && (
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                {activeAlerts.length} active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-sm">No predictive alerts at this time</p>
              <p className="text-xs">AI is continuously monitoring for potential issues</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => {
                const styles = severityStyles[alert.severity];
                const hasStartedAction = actionsStarted.includes(alert.id);
                
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "rounded-lg border border-border border-l-4 bg-secondary/50 p-4 transition-colors hover:bg-secondary cursor-pointer",
                      styles.border
                    )}
                    onClick={() => handleViewDetails(alert)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-medium text-foreground">{alert.title}</h4>
                          <Badge className={cn("text-xs", styles.badge)}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-secondary border-border">
                            {alert.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {alert.affectedCustomers} affected
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            ~{alert.predictedComplaints} predicted
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button 
                          size="sm" 
                          variant={hasStartedAction ? "ghost" : "default"}
                          className={cn(hasStartedAction && "text-success")}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTakeAction(alert);
                          }}
                          disabled={hasStartedAction}
                        >
                          {hasStartedAction ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Started
                            </>
                          ) : (
                            "Take Action"
                          )}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-muted-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDismiss(alert.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedAlert && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={cn("h-5 w-5", severityStyles[selectedAlert.severity].icon)} />
                  <DialogTitle>{selectedAlert.title}</DialogTitle>
                </div>
                <DialogDescription className="flex items-center gap-2">
                  <Badge className={cn("text-xs", severityStyles[selectedAlert.severity].badge)}>
                    {selectedAlert.severity}
                  </Badge>
                  <span>{selectedAlert.confidence}% confidence</span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedAlert.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">Affected Customers</p>
                    <p className="text-xl font-bold text-foreground">{selectedAlert.affectedCustomers}</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">Predicted Complaints</p>
                    <p className="text-xl font-bold text-foreground">{selectedAlert.predictedComplaints}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-chart-1/10 border border-chart-1/20 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-chart-1" />
                    Recommended Action
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedAlert.recommendedAction}</p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      handleTakeAction(selectedAlert);
                      setDialogOpen(false);
                    }}
                    disabled={actionsStarted.includes(selectedAlert.id)}
                  >
                    {actionsStarted.includes(selectedAlert.id) ? "Action Started" : "Take Action"}
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
