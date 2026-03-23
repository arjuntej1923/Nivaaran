import { GenomeVisualization } from "@/components/genome/genome-visualization";
import { ClusterDetails } from "@/components/genome/cluster-details";
import { RootCauseAnalysis } from "@/components/genome/root-cause-analysis";
import { GenomeFilters } from "@/components/genome/genome-filters";

export default function GenomePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Complaint Genome</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered complaint clustering and root cause identification
        </p>
      </div>

      {/* Filters */}
      <GenomeFilters />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GenomeVisualization />
        </div>
        <ClusterDetails />
      </div>

      {/* Root Cause Analysis */}
      <RootCauseAnalysis />
    </div>
  );
}
