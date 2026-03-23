"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileText, ChevronRight, Copy, Check, Send } from "lucide-react";
import { responseTemplates } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import type { ResponseTemplate } from "@/lib/types";

export function ResponseTemplates() {
  const { selectedComplaint, addMessage, addNotification } = useAppStore();
  const [selectedTemplate, setSelectedTemplate] = useState<ResponseTemplate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectTemplate = (template: ResponseTemplate) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  const processTemplate = (content: string): string => {
    if (!selectedComplaint) return content;
    
    return content
      .replace("{customer_name}", selectedComplaint.customer.name)
      .replace("{transaction_id}", selectedComplaint.transactionId || "N/A")
      .replace("{amount}", selectedComplaint.amount?.toLocaleString() || "N/A");
  };

  const handleCopy = async () => {
    if (!selectedTemplate) return;
    const processedContent = processTemplate(selectedTemplate.content);
    await navigator.clipboard.writeText(processedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUseTemplate = () => {
    if (!selectedTemplate || !selectedComplaint) return;
    
    const processedContent = processTemplate(selectedTemplate.content);
    addMessage(selectedComplaint.id, {
      sender: "agent",
      senderName: "Rahul Sharma (You)",
      senderInitials: "RS",
      content: processedContent,
      timestamp: new Date().toISOString(),
    });
    
    setDialogOpen(false);
    addNotification({
      title: "Template Applied",
      message: `${selectedTemplate.name} template sent to customer`,
      type: "success",
    });
  };

  // Filter templates relevant to current complaint category
  const relevantTemplates = selectedComplaint
    ? responseTemplates.filter(t => t.category === selectedComplaint.category || t.category === "General")
    : responseTemplates;

  return (
    <>
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-card-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-chart-2" />
            Quick Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {relevantTemplates.slice(0, 4).map((template) => (
              <Button
                key={template.id}
                variant="ghost"
                className="w-full justify-between h-auto py-2 px-3 text-left hover:bg-secondary group"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{template.name}</p>
                  <p className="text-xs text-muted-foreground">{template.category}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs bg-secondary border-border opacity-0 group-hover:opacity-100 transition-opacity">
                    {template.usageCount} uses
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTemplate.name}</DialogTitle>
                <DialogDescription>
                  Category: {selectedTemplate.category} | Used {selectedTemplate.usageCount} times
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <h4 className="text-sm font-medium text-foreground mb-2">Template Preview</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {processTemplate(selectedTemplate.content)}
                  </p>
                </div>

                {!selectedComplaint && (
                  <div className="rounded-lg bg-warning/10 border border-warning/20 p-3">
                    <p className="text-xs text-warning">
                      Select a complaint to auto-fill template placeholders
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-success" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button onClick={handleUseTemplate} disabled={!selectedComplaint}>
                    <Send className="h-4 w-4 mr-2" />
                    Send to Customer
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
