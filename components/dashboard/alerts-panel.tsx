"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, TrendingUp, Shield, X, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

const severityStyles = {
  critical: "border-l-destructive bg-destructive/5",
  high: "border-l-warning bg-warning/5",
  medium: "border-l-chart-1 bg-chart-1/5",
};

const iconStyles = {
  critical: "text-destructive",
  high: "text-warning",
  medium: "text-chart-1",
};

export function AlertsPanel() {
  const { predictiveAlerts, dismissAlert, complianceDeadlines, addNotification } = useAppStore();
  
  const activeAlerts = predictiveAlerts.filter(a => !a.dismissed);
  const atRiskDeadlines = complianceDeadlines.filter(d => d.status === "at-risk");

  const handleDismiss = (alertId: string) => {
    dismissAlert(alertId);
    addNotification({
      title: "Alert Dismissed",
      message: "Alert has been dismissed and will not appear again",
      type: "info",
    });
  };

  const handleAcknowledge = (alertId: string, title: string) => {
    dismissAlert(alertId);
    addNotification({
      title: "Alert Acknowledged",
      message: `Action noted for: ${title}`,
      type: "success",
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Active Alerts
          {(activeAlerts.length + atRiskDeadlines.length) > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({activeAlerts.length + atRiskDeadlines.length})
            </span>
          )}
        </CardTitle>
        <Link href="/radar">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {atRiskDeadlines.length > 0 && (
            <div className="rounded-lg border border-border border-l-4 border-l-destructive bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 mt-0.5 text-destructive" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">RBI TAT Deadline</h4>
                    <span className="text-xs text-destructive font-medium">Urgent</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {atRiskDeadlines.length} complaint{atRiskDeadlines.length > 1 ? 's' : ''} approaching resolution deadline
                  </p>
                  <Link href="/regulatory">
                    <Button size="sm" variant="outline" className="mt-2 h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "rounded-lg border border-border border-l-4 p-4 transition-colors hover:bg-secondary/50",
                severityStyles[alert.severity]
              )}
            >
              <div className="flex items-start gap-3">
                <TrendingUp className={cn("h-5 w-5 mt-0.5", iconStyles[alert.severity])} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">{alert.title}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground">
                        {alert.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs"
                      onClick={() => handleAcknowledge(alert.id, alert.title)}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Acknowledge
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 text-xs text-muted-foreground"
                      onClick={() => handleDismiss(alert.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {activeAlerts.length === 0 && atRiskDeadlines.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-sm">No active alerts</p>
              <p className="text-xs">All systems operating normally</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
