"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle, Clock, XCircle } from "lucide-react";

const metrics = [
  {
    title: "TAT Compliance Rate",
    value: "94.2%",
    target: "Target: 95%",
    progress: 94.2,
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/20",
    progressColor: "bg-success",
  },
  {
    title: "Within TAT",
    value: "2,682",
    subtitle: "Complaints resolved on time",
    progress: 100,
    icon: Clock,
    color: "text-chart-2",
    bgColor: "bg-chart-2/20",
    progressColor: "bg-chart-2",
  },
  {
    title: "Approaching TAT",
    value: "127",
    subtitle: "2-3 days remaining",
    progress: 60,
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/20",
    progressColor: "bg-warning",
  },
  {
    title: "TAT Breached",
    value: "38",
    subtitle: "Requires immediate action",
    progress: 100,
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/20",
    progressColor: "bg-destructive",
  },
];

export function ComplianceOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <span className="text-3xl font-bold text-foreground">{metric.value}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground">{metric.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.subtitle || metric.target}
              </p>
              {metric.title === "TAT Compliance Rate" && (
                <Progress
                  value={metric.progress}
                  className="mt-3 h-2"
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
