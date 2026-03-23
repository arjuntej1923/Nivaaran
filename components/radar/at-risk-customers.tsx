"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Phone, ChevronRight, CheckCircle2, User, AlertTriangle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import type { AtRiskCustomer } from "@/lib/types";

function getRiskColor(score: number) {
  if (score >= 85) return "text-destructive";
  if (score >= 70) return "text-warning";
  return "text-chart-2";
}

function getProgressColor(score: number) {
  if (score >= 85) return "[&>div]:bg-destructive";
  if (score >= 70) return "[&>div]:bg-warning";
  return "[&>div]:bg-chart-2";
}

export function AtRiskCustomers() {
  const { atRiskCustomers, markCustomerContacted, addNotification } = useAppStore();
  const [selectedCustomer, setSelectedCustomer] = useState<AtRiskCustomer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleContact = (customer: AtRiskCustomer) => {
    markCustomerContacted(customer.id);
    addNotification({
      title: "Contact Initiated",
      message: `Outreach started for ${customer.name}`,
      type: "success",
    });
  };

  const handleViewDetails = (customer: AtRiskCustomer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const sortedCustomers = [...atRiskCustomers].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            At-Risk Customers
            <Badge variant="outline" className="ml-2 bg-secondary border-border">
              {atRiskCustomers.length} identified
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            Export List
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Risk Score</TableHead>
                <TableHead className="text-muted-foreground">Signals</TableHead>
                <TableHead className="text-muted-foreground">Predicted Issue</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCustomers.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  className={cn(
                    "border-border hover:bg-secondary/50 cursor-pointer",
                    customer.contacted && "opacity-60"
                  )}
                  onClick={() => handleViewDetails(customer)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/20 text-primary text-sm">
                          {customer.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{customer.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{customer.id}</span>
                          <Badge variant="outline" className="text-xs bg-secondary border-border">
                            {customer.segment}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 w-24">
                      <Progress
                        value={customer.riskScore}
                        className={cn("h-2 flex-1", getProgressColor(customer.riskScore))}
                      />
                      <span className={cn("text-sm font-medium", getRiskColor(customer.riskScore))}>
                        {customer.riskScore}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {customer.signals.slice(0, 2).map((signal, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className={cn(
                            "text-xs",
                            signal.severity === "high" 
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : signal.severity === "medium"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-secondary text-muted-foreground border-border"
                          )}
                        >
                          {signal.description}
                        </Badge>
                      ))}
                      {customer.signals.length > 2 && (
                        <Badge variant="outline" className="text-xs bg-secondary border-border text-muted-foreground">
                          +{customer.signals.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-foreground">{customer.predictedIssue}</span>
                  </TableCell>
                  <TableCell>
                    {customer.contacted ? (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Contacted
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant={customer.contacted ? "ghost" : "outline"} 
                      className={cn("border-border", customer.contacted && "opacity-50")}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!customer.contacted) handleContact(customer);
                      }}
                      disabled={customer.contacted}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      {customer.contacted ? "Done" : "Contact"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {selectedCustomer.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle>{selectedCustomer.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2">
                      {selectedCustomer.id} | {selectedCustomer.segment}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <AlertTriangle className={cn("h-4 w-4", getRiskColor(selectedCustomer.riskScore))} />
                      Risk Assessment
                    </h4>
                    <span className={cn("text-2xl font-bold", getRiskColor(selectedCustomer.riskScore))}>
                      {selectedCustomer.riskScore}
                    </span>
                  </div>
                  <Progress
                    value={selectedCustomer.riskScore}
                    className={cn("h-2", getProgressColor(selectedCustomer.riskScore))}
                  />
                </div>

                <div className="rounded-lg bg-secondary/50 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Risk Signals
                  </h4>
                  <div className="space-y-2">
                    {selectedCustomer.signals.map((signal, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{signal.description}</span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            signal.severity === "high" 
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : signal.severity === "medium"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-secondary text-muted-foreground border-border"
                          )}
                        >
                          {signal.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-chart-1/10 border border-chart-1/20 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-chart-1" />
                    Recommended Action
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedCustomer.recommendedAction}</p>
                  <p className="text-sm text-foreground mt-2">
                    Predicted Issue: <span className="font-medium">{selectedCustomer.predictedIssue}</span>
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                  {!selectedCustomer.contacted && (
                    <Button onClick={() => {
                      handleContact(selectedCustomer);
                      setDialogOpen(false);
                    }}>
                      <Phone className="h-4 w-4 mr-2" />
                      Initiate Contact
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
