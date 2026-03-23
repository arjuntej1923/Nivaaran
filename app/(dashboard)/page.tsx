import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { ComplaintTrendsChart } from "@/components/dashboard/complaint-trends-chart";
import { CategoryDistribution } from "@/components/dashboard/category-distribution";
import { RecentComplaints } from "@/components/dashboard/recent-complaints";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor complaint intelligence and regulatory compliance in real-time
        </p>
      </div>

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ComplaintTrendsChart />
        </div>
        <CategoryDistribution />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentComplaints />
        </div>
        <AlertsPanel />
      </div>
    </div>
  );
}
