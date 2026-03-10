export interface InsightMessage {
  primary_struggle?: string;
  occurrence: string;
  text: string;
}
export interface Insight {
  id: number;
  title: string;
  message: InsightMessage;
  severity: number;
  created_at: string;
  insight_type: string;
  evidence: string;
  is_active: boolean;
  valid_until: string;
}
interface Reasoning {
  mistake_type?: string;
}

export interface NextAction {
  id: number;
  action_type: string;
  duration_minutes: number;
  difficulty_level: number;
  message: string;
  reasoning: Reasoning;
  is_active: boolean;
  created_at: string;
}

export interface AccuracyPoint {
  date: string;
  accuracy: number;
}

export  interface MistakeBreakdownItem {
  mistake_type: string;
  count: number;
}

export interface InsightPreview {
  title: string;
  message: {
    primary_struggle?:string,
    occurrence:string,
    text:string

  },
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