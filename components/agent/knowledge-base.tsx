"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, ExternalLink } from "lucide-react";

const articles = [
  { title: "UPI Transaction Failure Handling", views: "2.3k" },
  { title: "Refund Timeline Guidelines", views: "1.8k" },
  { title: "NPCI Error Codes Reference", views: "956" },
];

export function KnowledgeBase() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-card-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-chart-3" />
          Knowledge Base
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-9 bg-secondary border-border"
          />
        </div>
        <div className="space-y-1">
          {articles.map((article) => (
            <Button
              key={article.title}
              variant="ghost"
              className="w-full justify-between h-auto py-2 px-3 text-left hover:bg-secondary"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{article.title}</p>
                <p className="text-xs text-muted-foreground">{article.views} views</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
