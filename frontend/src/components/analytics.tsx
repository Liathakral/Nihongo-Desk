
import { useDashboardStore } from "../stores/DashboardStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import type { InsightPreview } from "../types/dashboard";
import { TrendingUp, Brain, Activity,  AlertTriangle, Flame } from "lucide-react";
import Loader from "./UI/loader";
interface InsightItemProps { insight: InsightPreview; index: number; }
interface AnalyticsCardProps { title: string; children: React.ReactNode; className?: string; }
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  colorClass: string;
  bgClass: string;
  delay: number;
}

interface TooltipPayloadEntry {
  value: number | string;
  name: string;
  color?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl px-4 py-3 shadow-xl">
        <p className="text-[11px] text-avocado-smoothie font-medium mb-1">{label}</p>
        <p className="text-lg font-bold text-[#7F9BCB]">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function TimelineAnalyticsView() {
  const { loading, error, fetchDashboard, timeline } = useDashboardStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  useEffect(() => { if (!loading) setTimeout(() => setVisible(true), 50); }, [loading]);

  /* ── Loading ── */
  if (loading) return (
   <Loader text={"fetching analysis"}/>
  );

  /* ── Error ── */
  if (error) return (
    <div className="flex items-center gap-2 p-5 text-rose-400 bg-rose-50 rounded-2xl m-6 border border-rose-100">
      <AlertTriangle size={16} />
      <span className="text-sm">{error}</span>
    </div>
  );

  if (!timeline) return null;

  const trendKey = timeline.trend_direction ?? "stable";
  const trendMeta: Record<string, { label: string; color: string; bg: string }> = {
    improving: { label: "📈 Improving", color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-100" },
    declining:  { label: "📉 Declining", color: "text-rose-500",    bg: "bg-rose-50 border-rose-100"       },
    stable:     { label: "➖ Stable",    color: "text-amber-500",   bg: "bg-amber-50 border-amber-100"     },
  };
  const trend = trendMeta[trendKey] ?? trendMeta.stable;

  return (
    <div
      className={`
        min-h-screen w-full overflow-y-auto px-7 py-8
        bg-linear-to-br from-[#fdf8f3] via-[#f5f0ea] to-[#eef4f8]
        transition-all duration-700
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >

      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-avocado-smoothie animate-pulse" />
          <span className="text-2xl  text-avocado-smoothie uppercase font-semibold">
            Nihongo Desk · Analytics
          </span>
        </div>
       

        <p className="text-xs text-avocado-smoothie mt-1 tracking-wide">
          Track patterns · Identify weaknesses · Improve faster
        </p>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        <SummaryCard
          icon={<Activity size={16} />}
          label="Sessions"
          value={timeline.total_sessions}
          colorClass="text-[#7F9BCB]"
          bgClass="bg-white/70 border-blue-100"
          delay={0}
        />
        <SummaryCard
          icon={<Brain size={16} />}
          label="Weakest Area"
          value={timeline.weakest_area?.replace(/_/g, " ") || "N/A"}
          colorClass="text-pink-400"
          bgClass="bg-white/70 border-pink-100"
          delay={80}
        />
        <SummaryCard
          icon={<TrendingUp size={16} />}
          label="Trend"
          value={trend.label}
          colorClass={trend.color}
          bgClass={`bg-white/70 ${trend.bg.split(" ")[1]}`}
          delay={160}
        />
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-2 gap-5 mb-7">

        {/* Accuracy Trend */}
        <AnalyticsCard title="Accuracy Trend">
          <div className="h-52.5 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeline.accuracy_trend}
                margin={{ top: 8, right: 12, left: -22, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#c5d9ef" />
                    <stop offset="100%" stopColor="#7F9BCB" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ede8e0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#c4b8a8", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: string) => v.slice(5)}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#c4b8a8", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#fff", stroke: "#7F9BCB", strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: "#7F9BCB", stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>

        {/* Mistake Distribution */}
        <AnalyticsCard title="Mistake Distribution">
          <div className="h-52.5 mt-3 r flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="38%"
                outerRadius="90%"
                data={timeline.mistake_breakdown}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar dataKey="count" cornerRadius={6} fill="#8EA6C9" />
                <Legend
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px", color: "#b0a090" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "14px",
                    border: "none",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    fontSize: "12px",
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>
      </div>

      {/* ── Recent Insights ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame size={15} className="text-orange-300" />
            <h2 className="text-sm font-bold text-[#2d2418] tracking-tight">Recent Insights</h2>
          </div>
          <span className="text-[10px] font-medium text-avocado-smoothie bg-white/60 px-3 py-1 rounded-full border border-slate-100">
            {timeline.recent_insights?.length ?? 0} found
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {timeline.recent_insights?.length ? (
            timeline.recent_insights.map((insight: InsightPreview, i: number) => (
              <InsightItem key={i} insight={insight} index={i} />
            ))
          ) : (
            <div className="text-center py-12 text-sm text-avocado-smoothie bg-white/40 rounded-2xl border border-dashed border-slate-200">
              No insights yet — keep studying! 🌸
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════ */

function SummaryCard({ icon, label, value, colorClass, bgClass, delay }: SummaryCardProps) {
  return (
    <div
      className={`
        rounded-2xl border p-4 flex flex-col gap-3
        backdrop-blur-sm
        hover:shadow-lg hover:-translate-y-0.5
        transition-all duration-300 cursor-pointer

        ${bgClass}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white/80 shadow-sm ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] tracking-[0.2em] uppercase text-avocado-smoothie font-semibold mb-0.5">{label}</p>
        <p className={`text-sm font-bold truncate ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, children, className = "" }: AnalyticsCardProps) {
  return (
    <div
      className={`
        bg-white/60 backdrop-blur-sm border border-white/90
        rounded-2xl p-5 shadow-sm
        hover:shadow-md hover:bg-white/75
        transition-all duration-200
        ${className}
      `}
    >
      <p className="text-[9px] tracking-[0.22em] uppercase font-semibold text-avocado-smoothie">{title}</p>
      {children}
    </div>
  );
}

function InsightItem({ insight, index }: InsightItemProps) {
  const sev = insight.severity;
  const cfg =
    sev >= 5 ? { pill: "bg-red-50 text-red-400 border border-red-100",    bar: "bg-red-300",    dot: "bg-red-400"    }
  : sev >= 3 ? { pill: "bg-orange-50 text-orange-400 border border-orange-100", bar: "bg-orange-300", dot: "bg-orange-400" }
  :            { pill: "bg-amber-50 text-amber-500 border border-amber-100",  bar: "bg-amber-200",  dot: "bg-amber-400"  };

  return (
    <div
      className="
        group relative bg-white/70 backdrop-blur-sm
        border border-white/90 rounded-2xl p-5
        cursor-pointer
        hover:shadow-lg hover:-translate-y-0.5 hover:bg-white/90
        transition-all duration-200 overflow-hidden
      "
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      {/* Severity accent bar */}
      <div className={`absolute left-0 top-4 bottom-4 w-0.75 rounded-r-full ${cfg.bar}`} />

      <div className="pl-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            <h3 className="font-semibold text-sm text-pink-500 truncate">{insight.title}</h3>
          </div>

          <div className="space-y-1">
            {insight.message?.primary_struggle && (
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="font-semibold text-slate-600">Struggle · </span>
                {insight.message.primary_struggle.replace(/_/g, " ")}
              </p>
            )}
            {insight.message?.occurrence && (
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Pattern · </span>
                {insight.message.occurrence}
              </p>
            )}
            {insight.message?.text && (
              <p className="text-xs text-avocado-smoothie mt-1.5 leading-relaxed">{insight.message.text}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.pill}`}>
            S{insight.severity}
          </span>
        
        </div>
      </div>
    </div>
  );
}