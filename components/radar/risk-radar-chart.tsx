"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { factor: "Transaction Failures", current: 85, baseline: 45 },
  { factor: "Wait Time", current: 72, baseline: 50 },
  { factor: "Failed Logins", current: 68, baseline: 35 },
  { factor: "Negative Sentiment", current: 78, baseline: 40 },
  { factor: "Multiple Contacts", current: 65, baseline: 30 },
  { factor: "Service Downtime", current: 88, baseline: 25 },
];

export function RiskRadarChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Risk Factor Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="oklch(0.28 0.01 260)" />
              <PolarAngleAxis
                dataKey="factor"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 10 }}
              />
              <Radar
                name="Current Risk"
                dataKey="current"
                stroke="oklch(0.60 0.22 25)"
                fill="oklch(0.60 0.22 25)"
                fillOpacity={0.4}
              />
              <Radar
                name="Baseline"
                dataKey="baseline"
                stroke="oklch(0.70 0.18 180)"
                fill="oklch(0.70 0.18 180)"
                fillOpacity={0.2}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={(value) => <span className="text-muted-foreground">{value}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
