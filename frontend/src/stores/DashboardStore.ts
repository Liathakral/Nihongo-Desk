import { create } from "zustand";
import api from "../api/client";
import type { Insight, NextAction, TimelineAnalytics } from "../types/dashboard";

interface DashboardState {
  insights: Insight[];
  nextAction: NextAction | null;
  timeline: TimelineAnalytics | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  insights: [],
  nextAction: null,
  timeline: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    try {
      set({ loading: true, error: null });

      const [insightRes, actionRes, timelineRes] = await Promise.all([
        api.get("/insights/active"),
        api.get("/next-action/"),
        api.get("/timeline/"),
      ]);

      set({
        insights: insightRes.data,
        nextAction: actionRes.data,
        timeline: timelineRes.data,
        loading: false,
      });
    } catch (err: unknown) {
      set({
        error: err instanceof Error ? err.message : "Failed to load dashboard",
        loading: false,
      });
    }
  },
}));