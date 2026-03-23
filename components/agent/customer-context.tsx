"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { User, CreditCard, Phone, Calendar, TrendingUp, AlertTriangle, Mail, Building, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function getRiskLevel(score: number): { label: string; color: string; bgColor: string } {
  if (score >= 70) return { label: "High", color: "text-destructive", bgColor: "bg-destructive/10 border-destructive/20" };
  if (score >= 40) return { label: "Medium", color: "text-warning", bgColor: "bg-warning/10 border-warning/20" };
  return { label: "Low", color: "text-success", bgColor: "bg-success/10 border-success/20" };
}

export function CustomerContext() {
  const { selectedComplaint } = useAppStore();

  if (!selectedComplaint) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-card-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-chart-1" />
            Customer 360
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground text-sm">
            Select a complaint to view customer details
          </div>
        </CardContent>
      </Card>
    );
  }

  const customer = selectedComplaint.customer;
  const riskInfo = getRiskLevel(customer.riskScore);

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <User className="h-4 w-4 text-chart-1" />
          Customer 360
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Customer ID</span>
            <span className="text-sm text-foreground font-mono">{customer.id}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Segment</span>
            <Badge className={cn(
              customer.segment === "Premium" ? "bg-chart-3 text-foreground" :
              customer.segment === "Gold" ? "bg-warning text-foreground" :
              "bg-secondary text-muted-foreground"
            )}>
              {customer.segment}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Account</span>
            <span className="text-sm text-foreground">{customer.accountNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Member Since</span>
            <span className="text-sm text-foreground">
              {new Date(customer.joinedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Contact Info */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Contact Information</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground truncate">{customer.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">{customer.phone}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Complaint History */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Complaint History</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Total Complaints</span>
            <span className="text-sm font-medium text-foreground">{customer.totalComplaints}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Resolved</span>
            <span className="text-sm font-medium text-success">{customer.resolvedComplaints}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Progress 
              value={(customer.resolvedComplaints / customer.totalComplaints) * 100} 
              className="h-2 flex-1 [&>div]:bg-success" 
            />
            <span className="text-xs text-muted-foreground">
              {Math.round((customer.resolvedComplaints / customer.totalComplaints) * 100)}%
            </span>
          </div>
        </div>

        <Separator className="bg-border" />

        {/* Risk Score */}
        <div className={cn("flex items-center justify-between p-3 rounded-lg border", riskInfo.bgColor)}>
          <div className="flex items-center gap-2">
            <TrendingUp className={cn("h-4 w-4", riskInfo.color)} />
            <span className="text-sm text-foreground">Churn Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-lg font-bold", riskInfo.color)}>{riskInfo.label}</span>
            <span className="text-xs text-muted-foreground">({customer.riskScore})</span>
          </div>
        </div>

        {/* AI Insight */}
        <div className="p-3 rounded-lg bg-chart-1/10 border border-chart-1/20">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-chart-1 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground">AI Insight</p>
              <p className="text-xs text-muted-foreground mt-1">
                {customer.riskScore >= 50 
                  ? "Customer has had multiple recent interactions. Consider proactive engagement to address concerns."
                  : "Customer has a positive history. Maintain relationship with quality service."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
