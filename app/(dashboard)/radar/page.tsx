import { RiskRadarChart } from "@/components/radar/risk-radar-chart";
import { AtRiskCustomers } from "@/components/radar/at-risk-customers";
import { PredictiveAlerts } from "@/components/radar/predictive-alerts";
import { RiskMetrics } from "@/components/radar/risk-metrics";

export default function RadarPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pre-Complaint Radar</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered predictive alerts and at-risk customer identification
        </p>
      </div>

      {/* Risk Metrics */}
      <RiskMetrics />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RiskRadarChart />
        <PredictiveAlerts />
      </div>

      {/* At-Risk Customers */}
      <AtRiskCustomers />
    </div>
  );
}
