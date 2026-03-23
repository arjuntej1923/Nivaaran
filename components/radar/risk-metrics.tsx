"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, AlertTriangle, TrendingDown, Shield } from "lucide-react";

const metrics = [
  {
    title: "At-Risk Customers",
    value: "847",
    subtitle: "Identified by AI",
    icon: Users,
    color: "text-chart-4",
    bgColor: "bg-chart-4/20",
  },
  {
    title: "Predicted Complaints",
    value: "~156",
    subtitle: "Next 7 days",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/20",
  },
  {
    title: "Prevention Rate",
    value: "73%",
    subtitle: "Complaints avoided",
    icon: TrendingDown,
    color: "text-success",
    bgColor: "bg-success/20",
  },
  {
    title: "Risk Score Accuracy",
    value: "94.2%",
    subtitle: "Model precision",
    icon: Shield,
    color: "text-chart-1",
    bgColor: "bg-chart-1/20",
  },
];

export function RiskMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
