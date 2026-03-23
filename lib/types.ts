export type Priority = "high" | "medium" | "low";
export type Status = "open" | "in-progress" | "escalated" | "resolved" | "pending";
export type Channel = "mobile-app" | "web" | "branch" | "call-center" | "email" | "social-media";
export type Category = 
  | "Transaction Issues"
  | "Account Services"
  | "Loan & Credit"
  | "Digital Banking"
  | "Card Services"
  | "KYC & Documents"
  | "Interest & Charges";

export interface Customer {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  segment: "Premium" | "Gold" | "Silver" | "Regular";
  accountNumber: string;
  joinedDate: string;
  totalComplaints: number;
  resolvedComplaints: number;
  riskScore: number;
}

export interface Complaint {
  id: string;
  customerId: string;
  customer: Customer;
  category: Category;
  subCategory: string;
  summary: string;
  description: string;
  priority: Priority;
  status: Status;
  channel: Channel;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string;
  assignedTo: string;
  amount?: number;
  transactionId?: string;
  messages: Message[];
  attachments: Attachment[];
}

export interface Message {
  id: string;
  sender: "customer" | "agent" | "system";
  senderName: string;
  senderInitials: string;
  content: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

export interface ClusterData {
  id: number;
  name: string;
  count: number;
  x: number;
  y: number;
  size: number;
  color: string;
  category: string;
  keywords: string[];
  trend: "increasing" | "decreasing" | "stable";
  affectedChannels: Channel[];
  rootCauses: string[];
  recommendations: string[];
}

export interface RiskSignal {
  type: string;
  description: string;
  severity: "high" | "medium" | "low";
}

export interface AtRiskCustomer {
  id: string;
  name: string;
  initials: string;
  segment: string;
  riskScore: number;
  signals: RiskSignal[];
  lastContact: string;
  predictedIssue: string;
  recommendedAction: string;
  contacted: boolean;
}

export interface PredictiveAlert {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium";
  category: Category;
  affectedCustomers: number;
  predictedComplaints: number;
  confidence: number;
  recommendedAction: string;
  dismissed: boolean;
  createdAt: string;
}

export interface ComplianceDeadline {
  id: string;
  complaintId: string;
  customerName: string;
  category: Category;
  deadline: string;
  hoursRemaining: number;
  status: "on-track" | "at-risk" | "breached";
  assignedTo: string;
}

export interface ComplianceReport {
  id: string;
  name: string;
  type: "RBI" | "Internal" | "BCSBI";
  period: string;
  status: "draft" | "pending-review" | "submitted" | "approved";
  dueDate: string;
  submittedDate?: string;
  downloadUrl: string;
}

export interface AISuggestion {
  id: string;
  type: "resolution" | "empathy" | "action" | "caution";
  title: string;
  content?: string;
  actions?: string[];
  confidence?: number;
  applied: boolean;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  category: Category;
  content: string;
  usageCount: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  relevanceScore: number;
}
