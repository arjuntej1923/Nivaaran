"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { useAppStore } from "@/lib/store";
import { trendData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const dataRanges = {
  "7d": trendData,
  "30d": [
    { date: "Week 1", complaints: 320, resolved: 285 },
    { date: "Week 2", complaints: 380, resolved: 340 },
    { date: "Week 3", complaints: 420, resolved: 375 },
    { date: "Week 4", complaints: 350, resolved: 310 },
  ],
  "90d": [
    { date: "Jan", complaints: 1200, resolved: 1080 },
    { date: "Feb", complaints: 1150, resolved: 1035 },
    { date: "Mar", complaints: 1380, resolved: 1200 },
  ],
};

export function ComplaintTrendsChart() {
  const { dateRange } = useAppStore();
  const [visibleSeries, setVisibleSeries] = useState({ complaints: true, resolved: true });

  const data = dataRanges[dateRange];

  const toggleSeries = (key: "complaints" | "resolved") => {
    setVisibleSeries(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Complaint Trends
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-7 text-xs",
              visibleSeries.complaints 
                ? "bg-chart-1/20 border-chart-1/30 text-chart-1" 
                : "bg-secondary border-border text-muted-foreground"
            )}
            onClick={() => toggleSeries("complaints")}
          >
            <span className="w-2 h-2 rounded-full bg-chart-1 mr-1" />
            Complaints
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-7 text-xs",
              visibleSeries.resolved 
                ? "bg-chart-2/20 border-chart-2/30 text-chart-2" 
                : "bg-secondary border-border text-muted-foreground"
            )}
            onClick={() => toggleSeries("resolved")}
          >
            <span className="w-2 h-2 rounded-full bg-chart-2 mr-1" />
            Resolved
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.20 265)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.20 265)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.70 0.18 150)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.70 0.18 150)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
              <XAxis
                dataKey="date"
                stroke="oklch(0.65 0 0)"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
              />
              <YAxis
                stroke="oklch(0.65 0 0)"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.14 0.01 260)",
                  border: "1px solid oklch(0.28 0.01 260)",
                  borderRadius: "8px",
                  color: "oklch(0.98 0 0)",
                }}
                labelStyle={{ color: "oklch(0.98 0 0)" }}
              />
              {visibleSeries.complaints && (
                <Area
                  type="monotone"
                  dataKey="complaints"
                  stroke="oklch(0.65 0.20 265)"
                  fillOpacity={1}
                  fill="url(#colorComplaints)"
                  strokeWidth={2}
                  name="Complaints"
                />
              )}
              {visibleSeries.resolved && (
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="oklch(0.70 0.18 150)"
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                  strokeWidth={2}
                  name="Resolved"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
