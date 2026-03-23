import { ComplianceOverview } from "@/components/regulatory/compliance-overview";
import { TatTracker } from "@/components/regulatory/tat-tracker";
import { DeadlineAlerts } from "@/components/regulatory/deadline-alerts";
import { ComplianceReports } from "@/components/regulatory/compliance-reports";

export default function RegulatoryPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Regulatory Shield</h1>
        <p className="text-muted-foreground mt-1">
          RBI compliance tracking and TAT management dashboard
        </p>
      </div>

      {/* Compliance Overview */}
      <ComplianceOverview />

      {/* TAT Tracker and Deadline Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TatTracker />
        <DeadlineAlerts />
      </div>

      {/* Compliance Reports */}
      <ComplianceReports />
    </div>
  );
}
