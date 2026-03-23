"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, CheckCircle2, AlertCircle, Lightbulb, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface Suggestion {
  id: string;
  type: "resolution" | "empathy" | "action" | "caution";
  title: string;
  content?: string;
  actions?: string[];
  confidence?: number;
}

export function AiSuggestions() {
  const { selectedComplaint, addMessage, addNotification } = useAppStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [appliedActions, setAppliedActions] = useState<string[]>([]);
  const [regenerating, setRegenerating] = useState(false);

  const suggestions: Suggestion[] = selectedComplaint ? [
    {
      id: "sug-1",
      type: "resolution",
      title: "Recommended Resolution",
      content: selectedComplaint.category === "Transaction Issues"
        ? `Based on transaction analysis, this appears to be a timeout issue with NPCI gateway. The refund has been auto-initiated (Ref: REF-${Math.random().toString(36).substring(7).toUpperCase()}) and will be credited within 2-3 working days. Inform customer about the expected timeline.`
        : selectedComplaint.category === "Account Services"
        ? "The KYC update issue is due to UIDAI server response delays. Recommend the customer try video KYC option or visit the nearest branch with original documents for instant verification."
        : `Based on the complaint analysis, we recommend acknowledging the issue and providing a clear timeline for resolution. The standard SLA for ${selectedComplaint.category} is 7 working days.`,
      confidence: 94,
    },
    {
      id: "sug-2",
      type: "empathy",
      title: "Empathy Statement",
      content: selectedComplaint.amount
        ? `I completely understand how concerning this must be, especially with Rs. ${selectedComplaint.amount.toLocaleString()} involved. Please be assured that we are treating this with the highest priority and will ensure a swift resolution.`
        : "I completely understand your frustration and apologize for the inconvenience caused. Please be assured that we are treating this with the highest priority and will ensure a swift resolution.",
    },
    {
      id: "sug-3",
      type: "action",
      title: "Suggested Actions",
      actions: [
        selectedComplaint.category === "Transaction Issues" ? "Initiate reversal request (if not auto-triggered)" : "Verify account details in core banking",
        "Send SMS notification with tracking link",
        selectedComplaint.priority === "high" ? "Escalate to supervisor if not resolved in 4h" : "Follow up in 24 hours if pending",
        "Offer goodwill credit of Rs. 100 for inconvenience",
      ],
    },
    {
      id: "sug-4",
      type: "caution",
      title: "Things to Avoid",
      actions: [
        "Do not ask customer to wait indefinitely",
        "Avoid technical jargon about backend systems",
        "Do not blame third-party services",
      ],
    },
  ] : [];

  const handleCopy = async (suggestion: Suggestion) => {
    const textToCopy = suggestion.content || suggestion.actions?.join("\n") || "";
    await navigator.clipboard.writeText(textToCopy);
    setCopiedId(suggestion.id);
    setTimeout(() => setCopiedId(null), 2000);
    addNotification({
      title: "Copied to Clipboard",
      message: `${suggestion.title} copied successfully`,
      type: "success",
    });
  };

  const handleApplyAction = (action: string) => {
    if (appliedActions.includes(action)) return;
    setAppliedActions([...appliedActions, action]);
    addNotification({
      title: "Action Applied",
      message: action,
      type: "success",
    });
  };

  const handleInsertResponse = (content: string) => {
    if (!selectedComplaint) return;
    addMessage(selectedComplaint.id, {
      sender: "agent",
      senderName: "Rahul Sharma (You)",
      senderInitials: "RS",
      content: content,
      timestamp: new Date().toISOString(),
    });
    addNotification({
      title: "Response Added",
      message: "AI suggestion inserted as your response",
      type: "success",
    });
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRegenerating(false);
    addNotification({
      title: "Suggestions Refreshed",
      message: "AI has generated new suggestions based on latest context",
      type: "info",
    });
  };

  const iconMap = {
    resolution: CheckCircle2,
    empathy: Sparkles,
    action: Lightbulb,
    caution: AlertCircle,
  };

  const colorMap = {
    resolution: { icon: "text-success", bg: "bg-success/10", border: "border-success/20" },
    empathy: { icon: "text-chart-1", bg: "bg-chart-1/10", border: "border-chart-1/20" },
    action: { icon: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    caution: { icon: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
  };

  if (!selectedComplaint) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-chart-1" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Select a complaint to see AI suggestions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-chart-1" />
          AI Suggestions
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={handleRegenerate}
          disabled={regenerating}
        >
          <RefreshCw className={cn("h-4 w-4 mr-1", regenerating && "animate-spin")} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => {
          const Icon = iconMap[suggestion.type];
          const colors = colorMap[suggestion.type];
          
          return (
            <div
              key={suggestion.id}
              className={cn(
                "rounded-lg border p-4 transition-colors",
                colors.bg,
                colors.border
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", colors.icon)} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-foreground">{suggestion.title}</h4>
                      {suggestion.confidence && (
                        <Badge variant="outline" className="bg-secondary border-border text-xs">
                          {suggestion.confidence}% confidence
                        </Badge>
                      )}
                    </div>
                    {suggestion.content && (
                      <p className="text-sm text-muted-foreground">{suggestion.content}</p>
                    )}
                    {suggestion.actions && (
                      <ul className="space-y-2">
                        {suggestion.actions.map((action, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            {suggestion.type === "action" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-5 w-5 p-0 shrink-0",
                                  appliedActions.includes(action) && "text-success"
                                )}
                                onClick={() => handleApplyAction(action)}
                              >
                                {appliedActions.includes(action) ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <span className="w-3 h-3 rounded-full border border-muted-foreground" />
                                )}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground shrink-0">-</span>
                            )}
                            <span className={cn(appliedActions.includes(action) && "line-through text-muted-foreground/50")}>
                              {action}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {(suggestion.type === "resolution" || suggestion.type === "empathy") && suggestion.content && (
                  <div className="flex items-center gap-1 shrink-0">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => handleCopy(suggestion)}
                    >
                      {copiedId === suggestion.id ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleInsertResponse(suggestion.content!)}
                    >
                      Use Response
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
