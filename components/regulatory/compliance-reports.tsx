"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Download, FileText, Calendar, CheckCircle2, Upload, Eye, Send, Loader2, Plus } from "lucide-react";
import { complianceReports } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import type { ComplianceReport } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusStyles = {
  submitted: {
    badge: "bg-success/20 text-success border-success/30",
    label: "Submitted",
  },
  "pending-review": {
    badge: "bg-warning/20 text-warning border-warning/30",
    label: "Pending Review",
  },
  draft: {
    badge: "bg-muted text-muted-foreground border-border",
    label: "Draft",
  },
  approved: {
    badge: "bg-chart-1/20 text-chart-1 border-chart-1/30",
    label: "Approved",
  },
};

export function ComplianceReports() {
  const { addNotification } = useAppStore();
  const [reports, setReports] = useState(complianceReports);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState<string | null>(null);

  const handleDownload = (report: ComplianceReport) => {
    addNotification({
      title: "Download Started",
      message: `Downloading ${report.name}`,
      type: "info",
    });
  };

  const handleSubmit = async (report: ComplianceReport) => {
    setSubmitting(report.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setReports(prev => prev.map(r => 
      r.id === report.id 
        ? { ...r, status: "submitted" as const, submittedDate: new Date().toISOString().split('T')[0] }
        : r
    ));
    
    setSubmitting(null);
    addNotification({
      title: "Report Submitted",
      message: `${report.name} has been submitted successfully`,
      type: "success",
    });
  };

  const handleView = (report: ComplianceReport) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleCreateReport = () => {
    addNotification({
      title: "Report Generator",
      message: "Opening report generation wizard...",
      type: "info",
    });
  };

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-chart-1" />
            Compliance Reports
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border" onClick={handleCreateReport}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm" className="border-border">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Report Name</TableHead>
                <TableHead className="text-muted-foreground">Type</TableHead>
                <TableHead className="text-muted-foreground">Due Date</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Submitted</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => {
                const styles = statusStyles[report.status];
                const isSubmitting = submitting === report.id;
                const canSubmit = report.status === "draft" || report.status === "pending-review";
                
                return (
                  <TableRow key={report.id} className="border-border hover:bg-secondary/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium text-foreground">{report.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "bg-secondary border-border",
                        report.type === "RBI" ? "text-chart-1" : "text-muted-foreground"
                      )}>
                        {report.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{report.dueDate}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={styles.badge}>
                        {(report.status === "submitted" || report.status === "approved") && (
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                        )}
                        {styles.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {report.submittedDate || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => handleView(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => handleDownload(report)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {canSubmit && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="ml-1"
                            onClick={() => handleSubmit(report)}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-1" />
                                Submit
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedReport && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-chart-1" />
                  <DialogTitle>{selectedReport.name}</DialogTitle>
                </div>
                <DialogDescription>
                  {selectedReport.type} Report | Period: {selectedReport.period}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium text-foreground">{selectedReport.dueDate}</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant="outline" className={cn("mt-1", statusStyles[selectedReport.status].badge)}>
                      {statusStyles[selectedReport.status].label}
                    </Badge>
                  </div>
                </div>

                {selectedReport.submittedDate && (
                  <div className="rounded-lg bg-success/10 border border-success/20 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Successfully Submitted</p>
                        <p className="text-xs text-muted-foreground">on {selectedReport.submittedDate}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-lg bg-secondary/50 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Report Contents</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>- Executive Summary</li>
                    <li>- Complaint Statistics</li>
                    <li>- TAT Analysis</li>
                    <li>- Category-wise Breakdown</li>
                    <li>- Resolution Metrics</li>
                    <li>- Recommendations</li>
                  </ul>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => handleDownload(selectedReport)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
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
