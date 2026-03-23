"use client";

import { create } from "zustand";
import type {
  Complaint,
  ClusterData,
  AtRiskCustomer,
  PredictiveAlert,
  ComplianceDeadline,
  Message,
} from "./types";
import {
  complaints as initialComplaints,
  clusters as initialClusters,
  atRiskCustomers as initialAtRiskCustomers,
  predictiveAlerts as initialPredictiveAlerts,
  complianceDeadlines as initialDeadlines,
} from "./mock-data";

interface AppState {
  // Complaints
  complaints: Complaint[];
  selectedComplaint: Complaint | null;
  selectComplaint: (complaint: Complaint | null) => void;
  updateComplaintStatus: (id: string, status: Complaint["status"]) => void;
  addMessage: (complaintId: string, message: Omit<Message, "id">) => void;

  // Clusters
  clusters: ClusterData[];
  selectedCluster: ClusterData | null;
  selectCluster: (cluster: ClusterData | null) => void;

  // At-Risk Customers
  atRiskCustomers: AtRiskCustomer[];
  markCustomerContacted: (id: string) => void;

  // Predictive Alerts
  predictiveAlerts: PredictiveAlert[];
  dismissAlert: (id: string) => void;

  // Compliance Deadlines
  complianceDeadlines: ComplianceDeadline[];

  // Dashboard filters
  dateRange: "7d" | "30d" | "90d";
  setDateRange: (range: "7d" | "30d" | "90d") => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Notifications
  notifications: { id: string; title: string; message: string; type: "info" | "success" | "warning" | "error" }[];
  addNotification: (notification: Omit<AppState["notifications"][0], "id">) => void;
  removeNotification: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Complaints
  complaints: initialComplaints,
  selectedComplaint: initialComplaints[0],
  selectComplaint: (complaint) => set({ selectedComplaint: complaint }),
  updateComplaintStatus: (id, status) =>
    set((state) => ({
      complaints: state.complaints.map((c) =>
        c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
      ),
      selectedComplaint:
        state.selectedComplaint?.id === id
          ? { ...state.selectedComplaint, status, updatedAt: new Date().toISOString() }
          : state.selectedComplaint,
    })),
  addMessage: (complaintId, message) =>
    set((state) => {
      const newMessage = { ...message, id: `MSG-${Date.now()}` };
      return {
        complaints: state.complaints.map((c) =>
          c.id === complaintId
            ? { ...c, messages: [...c.messages, newMessage], updatedAt: new Date().toISOString() }
            : c
        ),
        selectedComplaint:
          state.selectedComplaint?.id === complaintId
            ? {
                ...state.selectedComplaint,
                messages: [...state.selectedComplaint.messages, newMessage],
                updatedAt: new Date().toISOString(),
              }
            : state.selectedComplaint,
      };
    }),

  // Clusters
  clusters: initialClusters,
  selectedCluster: initialClusters[0],
  selectCluster: (cluster) => set({ selectedCluster: cluster }),

  // At-Risk Customers
  atRiskCustomers: initialAtRiskCustomers,
  markCustomerContacted: (id) =>
    set((state) => ({
      atRiskCustomers: state.atRiskCustomers.map((c) =>
        c.id === id ? { ...c, contacted: true } : c
      ),
    })),

  // Predictive Alerts
  predictiveAlerts: initialPredictiveAlerts,
  dismissAlert: (id) =>
    set((state) => ({
      predictiveAlerts: state.predictiveAlerts.map((a) =>
        a.id === id ? { ...a, dismissed: true } : a
      ),
    })),

  // Compliance Deadlines
  complianceDeadlines: initialDeadlines,

  // Dashboard filters
  dateRange: "7d",
  setDateRange: (range) => set({ dateRange: range }),

  // Search
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Notifications
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: `NOTIF-${Date.now()}` },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
