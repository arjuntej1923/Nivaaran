"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus, Users, ArrowRight, Smartphone, Globe, Phone, Mail, Building } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Channel } from "@/lib/types";

const channelIcons: Record<Channel, React.ElementType> = {
  "mobile-app": Smartphone,
  web: Globe,
  "call-center": Phone,
  email: Mail,
  branch: Building,
  "social-media": Globe,
};

const channelNames: Record<Channel, string> = {
  "mobile-app": "Mobile App",
  web: "Web Banking",
  "call-center": "Call Center",
  email: "Email",
  branch: "Branch",
  "social-media": "Social Media",
};

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

export function ClusterDetails() {
  const { selectedCluster, addNotification } = useAppStore();

  if (!selectedCluster) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="flex items-center justify-center h-96 text-muted-foreground">
          Select a cluster to view details
        </CardContent>
      </Card>
    );
  }

  const TrendIcon = trendIcons[selectedCluster.trend];

  const handleViewComplaints = () => {
    addNotification({
      title: "Filter Applied",
      message: `Showing complaints for ${selectedCluster.name} cluster`,
      type: "info",
    });
  };

  // Calculate channel percentages
  const totalChannels = selectedCluster.affectedChannels.length;
  const channelPercentages = selectedCluster.affectedChannels.map((channel, idx) => ({
    channel,
    percentage: Math.round(100 / totalChannels - idx * 5 + Math.random() * 10),
  })).sort((a, b) => b.percentage - a.percentage);

  // Normalize percentages to sum to 100
  const totalPercentage = channelPercentages.reduce((sum, c) => sum + c.percentage, 0);
  channelPercentages.forEach(c => {
    c.percentage = Math.round((c.percentage / totalPercentage) * 100);
  });

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            {selectedCluster.name}
          </CardTitle>
          <Badge className={cn(selectedCluster.color, "text-foreground")}>
            {selectedCluster.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cluster Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-secondary p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs">Complaints</span>
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">{selectedCluster.count}</p>
          </div>
          <div className="rounded-lg bg-secondary p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendIcon className="h-4 w-4" />
              <span className="text-xs">Trend</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <TrendIcon className={cn("h-5 w-5", trendColors[selectedCluster.trend])} />
              <span className={cn("text-lg font-bold capitalize", trendColors[selectedCluster.trend])}>
                {selectedCluster.trend}
              </span>
            </div>
          </div>
        </div>

        {/* Time to Resolution */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Avg Resolution Time</span>
            <span className="font-medium text-foreground">{(Math.random() * 5 + 2).toFixed(1)} days</span>
          </div>
          <Progress value={Math.min(100, selectedCluster.count / 2)} className="mt-2 h-2" />
          <p className="mt-1 text-xs text-muted-foreground">Target: 7 days (RBI TAT)</p>
        </div>

        {/* Top Keywords */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Top Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCluster.keywords.map((keyword) => (
              <Badge
                key={keyword}
                variant="outline"
                className="bg-secondary border-border text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Affected Channels */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Affected Channels</h4>
          <div className="space-y-2">
            {channelPercentages.map((item) => {
              const ChannelIcon = channelIcons[item.channel];
              return (
                <div key={item.channel} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-28">
                    <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground truncate">{channelNames[item.channel]}</span>
                  </div>
                  <Progress value={item.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-foreground w-10">{item.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full" onClick={handleViewComplaints}>
          View All Complaints
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
