import { CustomerContext } from "@/components/agent/customer-context";
import { AiSuggestions } from "@/components/agent/ai-suggestions";
import { ResponseTemplates } from "@/components/agent/response-templates";
import { ActiveTicket } from "@/components/agent/active-ticket";
import { KnowledgeBase } from "@/components/agent/knowledge-base";

export default function AgentPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agent Assist</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered customer context and response suggestions
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Active Ticket */}
        <div className="lg:col-span-2 space-y-6">
          <ActiveTicket />
          <AiSuggestions />
        </div>

        {/* Right Column - Context & Tools */}
        <div className="space-y-6">
          <CustomerContext />
          <ResponseTemplates />
          <KnowledgeBase />
        </div>
      </div>
    </div>
  );
}
