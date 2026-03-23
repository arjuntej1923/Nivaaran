"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const trendIcons = {
  increasing: TrendingUp,
  decreasing: TrendingDown,
  stable: Minus,
};

const trendColors = {
  increasing: "text-destructive",
  decreasing: "text-success",
  stable: "text-muted-foreground",
};

export function GenomeVisualization() {
  const { clusters, selectedCluster, selectCluster } = useAppStore();

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-card-foreground">
          Complaint Cluster Map
        </CardTitle>
        <Badge variant="outline" className="bg-secondary border-border">
          {clusters.reduce((acc, c) => acc + c.count, 0)} total complaints
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 bg-secondary/30 rounded-lg border border-border overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Connection lines */}
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            {clusters.map((cluster, idx) => (
              clusters.slice(idx + 1).map((otherCluster) => {
                const distance = Math.sqrt(
                  Math.pow(cluster.x - otherCluster.x, 2) + Math.pow(cluster.y - otherCluster.y, 2)
                );
                if (distance < 40 || cluster.category === otherCluster.category) {
                  return (
                    <line
                      key={`${cluster.id}-${otherCluster.id}`}
                      x1={`${cluster.x}%`}
                      y1={`${cluster.y}%`}
                      x2={`${otherCluster.x}%`}
                      y2={`${otherCluster.y}%`}
                      stroke="oklch(0.65 0.20 265)"
                      strokeWidth="1"
                      strokeOpacity={selectedCluster?.id === cluster.id || selectedCluster?.id === otherCluster.id ? "0.6" : "0.2"}
                      strokeDasharray={cluster.category === otherCluster.category ? "0" : "4 4"}
                    />
                  );
                }
                return null;
              })
            ))}
          </svg>

          {/* Cluster bubbles */}
          {clusters.map((cluster) => {
            const TrendIcon = trendIcons[cluster.trend];
            return (
              <button
                key={cluster.id}
                onClick={() => selectCluster(cluster)}
                className={cn(
                  "absolute rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-lg",
                  cluster.color,
                  selectedCluster?.id === cluster.id
                    ? "ring-4 ring-primary ring-offset-2 ring-offset-background scale-110 z-10"
                    : "opacity-80 hover:opacity-100 hover:scale-105"
                )}
                style={{
                  left: `${cluster.x}%`,
                  top: `${cluster.y}%`,
                  width: cluster.size,
                  height: cluster.size,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <p className="text-xs font-semibold text-foreground leading-tight text-center px-1">{cluster.name}</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-xs text-foreground/90 font-medium">{cluster.count}</span>
                  <TrendIcon className={cn("h-3 w-3", trendColors[cluster.trend])} />
                </div>
              </button>
            );
          })}

          {/* Selected cluster highlight */}
          {selectedCluster && (
            <div 
              className="absolute pointer-events-none animate-pulse"
              style={{
                left: `${selectedCluster.x}%`,
                top: `${selectedCluster.y}%`,
                width: selectedCluster.size + 20,
                height: selectedCluster.size + 20,
                transform: "translate(-50%, -50%)",
                borderRadius: "50%",
                border: "2px dashed oklch(0.65 0.20 265)",
                opacity: 0.5,
              }}
            />
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-1" />
            <span className="text-xs text-muted-foreground">Transaction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-2" />
            <span className="text-xs text-muted-foreground">Account</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-3" />
            <span className="text-xs text-muted-foreground">Cards</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-4" />
            <span className="text-xs text-muted-foreground">Digital</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-5" />
            <span className="text-xs text-muted-foreground">Loans</span>
          </div>
          <div className="border-l border-border pl-4 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-destructive" />
              <span className="text-xs text-muted-foreground">Increasing</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-success" />
              <span className="text-xs text-muted-foreground">Decreasing</span>
            </div>
            <div className="flex items-center gap-1">
              <Minus className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Stable</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
