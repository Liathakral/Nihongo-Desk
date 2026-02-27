export interface Insight {
  id: number;
  title: string;
  message: string;
  severity: number;
  created_at: string;
}

export interface NextAction {
  id: number;
  message: string;
  created_at: string;
}

interface AccuracyPoint {
  date: string;
  accuracy: number;
}

interface MistakeBreakdownItem {
  mistake_type: string;
  count: number;
}

interface InsightPreview {
  title: string;
  message: string;
  severity: number;
}

export interface TimelineAnalytics {
  accuracy_trend: AccuracyPoint[];
  mistake_breakdown: MistakeBreakdownItem[];
  total_sessions: number;
  recent_insights: InsightPreview[];
  weakest_area: string | null;
  trend_direction: string;
}