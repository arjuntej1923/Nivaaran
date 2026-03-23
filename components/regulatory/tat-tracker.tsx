"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { category: "General", withinTat: 245, breached: 12 },
  { category: "Cards", withinTat: 189, breached: 8 },
  { category: "Loans", withinTat: 156, breached: 15 },
  { category: "Digital", withinTat: 312, breached: 3 },
  { category: "Branch", withinTat: 98, breached: 0 },
];

export function TatTracker() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-card-foreground">
          TAT Performance by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" horizontal={false} />
              <XAxis type="number" stroke="oklch(0.65 0 0)" tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }} />
              <YAxis
                dataKey="category"
                type="category"
                stroke="oklch(0.65 0 0)"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                width={70}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.14 0.01 260)",
                  border: "1px solid oklch(0.28 0.01 260)",
                  borderRadius: "8px",
                  color: "oklch(0.98 0 0)",
                }}
              />
              <Bar dataKey="withinTat" name="Within TAT" stackId="a" fill="oklch(0.70 0.18 150)" radius={[0, 0, 0, 0]} />
              <Bar dataKey="breached" name="Breached" stackId="a" fill="oklch(0.55 0.22 25)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Within TAT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">Breached</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
