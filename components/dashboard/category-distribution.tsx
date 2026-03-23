"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";
import { categoryData } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import Link from "next/link";

const COLORS = [
  "oklch(0.65 0.20 265)",
  "oklch(0.70 0.18 180)",
  "oklch(0.75 0.15 85)",
  "oklch(0.60 0.22 25)",
  "oklch(0.55 0.20 320)",
];

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" fill="oklch(0.98 0 0)" className="text-sm font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy + 15} textAnchor="middle" fill="oklch(0.65 0 0)" className="text-xs">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
      />
    </g>
  );
};

export function CategoryDistribution() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { addNotification } = useAppStore();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const handleCategoryClick = (data: any) => {
    addNotification({
      title: "Filter Applied",
      message: `Filtering complaints by ${data.name}`,
      type: "info",
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Category Distribution
        </CardTitle>
        <Link href="/genome">
          <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
            View Details
          </Badge>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
                onMouseEnter={onPieEnter}
                onClick={(_, index) => handleCategoryClick(categoryData[index])}
                style={{ cursor: "pointer" }}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.14 0.01 260)",
                  border: "1px solid oklch(0.28 0.01 260)",
                  borderRadius: "8px",
                  color: "oklch(0.98 0 0)",
                }}
                formatter={(value: number) => [`${value}%`, "Share"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {categoryData.map((entry, index) => (
            <button
              key={entry.name}
              className="flex items-center gap-2 text-left p-2 rounded hover:bg-secondary transition-colors"
              onClick={() => {
                setActiveIndex(index);
                handleCategoryClick(entry);
              }}
            >
              <span 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-xs text-muted-foreground truncate">{entry.name}</span>
              <span className="text-xs font-medium text-foreground ml-auto">{entry.value}%</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
