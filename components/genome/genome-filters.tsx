"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, RefreshCw } from "lucide-react";

export function GenomeFilters() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-40 bg-secondary border-border">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="transaction">Transaction Issues</SelectItem>
              <SelectItem value="account">Account Services</SelectItem>
              <SelectItem value="loan">Loan & Credit</SelectItem>
              <SelectItem value="digital">Digital Banking</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="30">
            <SelectTrigger className="w-36 bg-secondary border-border">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="5">
            <SelectTrigger className="w-40 bg-secondary border-border">
              <SelectValue placeholder="Min Cluster Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Min 3 complaints</SelectItem>
              <SelectItem value="5">Min 5 complaints</SelectItem>
              <SelectItem value="10">Min 10 complaints</SelectItem>
              <SelectItem value="20">Min 20 complaints</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-secondary border-border">
              12 clusters identified
            </Badge>
            <Button variant="outline" size="sm" className="border-border">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
