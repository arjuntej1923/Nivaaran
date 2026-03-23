"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useMemo } from "react";
import Link from "next/link";

export function MetricsCards() {
  const { complaints } = useAppStore();

  const metrics = useMemo(() => {
    const total = complaints.length;
    const resolved = complaints.filter((c) => c.status === "resolved").length;
    const pending = complaints.filter((c) => c.status === "open" || c.status === "pending").length;
    const escalated = complaints.filter((c) => c.status === "escalated").length;
    const inProgress = complaints.filter((c) => c.status === "in-progress").length;

    return [
      {
        title: "Total Complaints",
        value: total.toLocaleString(),
        subValue: `${inProgress} in progress`,
        change: "+12.5%",
        trend: "up" as const,
        icon: AlertTriangle,
        color: "text-chart-1",
        bgColor: "bg-chart-1/10",
        href: "/genome",
      },
      {
        title: "Resolved",
        value: resolved.toLocaleString(),
        subValue: `${Math.round((resolved / total) * 100)}% resolution rate`,
        change: "+8.3%",
        trend: "up" as const,
        icon: CheckCircle2,
        color: "text-success",
        bgColor: "bg-success/10",
        href: "#",
      },
      {
        title: "Pending",
        value: pending.toLocaleString(),
        subValue: "Awaiting action",
        change: "-4.2%",
        trend: "down" as const,
        icon: Clock,
        color: "text-warning",
        bgColor: "bg-warning/10",
        href: "#",
      },
      {
        title: "Escalated",
        value: escalated.toLocaleString(),
        subValue: "Requires attention",
        change: "+2.1%",
        trend: "up" as const,
        icon: XCircle,
        color: "text-destructive",
        bgColor: "bg-destructive/10",
        href: "/regulatory",
      },
    ];
  }, [complaints]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Link key={metric.title} href={metric.href}>
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-3xl font-bold text-card-foreground mt-1">{metric.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{metric.subValue}</p>
                </div>
                <div className={cn("p-3 rounded-lg", metric.bgColor, metric.color)}>
                  <metric.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-success" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    metric.trend === "up" && metric.title !== "Resolved" ? "text-destructive" : "text-success"
                  )}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-muted-foreground">vs last period</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
