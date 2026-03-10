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

import { useEffect } from "react";
import type { InsightPreview } from "../types/dashboard";
import { TrendingUp, Brain, Activity } from "lucide-react";
interface InsightItemProps {
  insight: InsightPreview;
}
interface AnalyticsCardProps {
  title: string;
  children: React.ReactNode;
}
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

export default function TimelineAnalyticsView() {

  const {
    loading,
    error,

    fetchDashboard,
    timeline,
  } = useDashboardStore();

  console.log("Timeline data:", timeline);
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (!timeline) return null;

  return (
    <div className="   p-6 w-full  h-screen overflow-y-auto">
      <div className="grid md:grid-cols-3 gap-6 w-full">
        <SummaryCard
          icon={<Activity size={20} />}
          label="Total Sessions"
          value={timeline?.total_sessions}
        />

        <SummaryCard
          icon={<Brain size={20} />}
          label="Weakest Area"
          value={timeline?.weakest_area || "N/A"}
         
        />

        <SummaryCard
          icon={<TrendingUp size={20} />}
          label="Trend"
          value={
            timeline?.trend_direction === "improving"
              ? "📈 Improving"
              : timeline?.trend_direction === "declining"
                ? "📉 Declining"
                : "➖ Stable"
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <AnalyticsCard title="Accuracy Trend">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={timeline.accuracy_trend}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="4 4" stroke="#f1f0ea" />

              <XAxis
                dataKey="date"
                tick={{ fill: "#7c7a6f", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#7c7a6f", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                }}
              />

              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#7F9BCB"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </AnalyticsCard>
 <AnalyticsCard title="Mistake Distribution">
        <ResponsiveContainer width="50%" height={220}>
          <RadialBarChart
            innerRadius="55%"
            outerRadius="100%"
            data={timeline.mistake_breakdown}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              
              dataKey="count"
              cornerRadius={8}
              fill="#8EA6C9"
            />

            <Legend
              iconSize={10}
              wrapperStyle={{
                fontSize: "12px",
              }}
            />

            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </AnalyticsCard>
       
      </div>
     
       <div className="space-y-4">
          <h2 className="text-xl font-bold text-savory-sage">
            Recent Insights
          </h2>

          <div className="flex flex-col gap-5">
            {timeline.recent_insights ? (
              timeline.recent_insights.map(
                (insight: InsightPreview, index: number) => (
                  <InsightItem key={index} insight={insight} />
                ),
              )
            ) : (
              <p className="text-sm text-gray-500">No insights available.</p>
            )}
          </div>
        </div>
    </div>
  );
}

function InsightItem({ insight }: InsightItemProps) {
  const message = insight.message;

  return (
    <div
      className="
  bg-white/80 backdrop-blur
  border border-amber-100
  rounded-2xl p-5
  shadow-sm
  hover:shadow-lg hover:-translate-y-0.5
  transition
  "
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-pink-600">{insight.title}</h3>

        <span
          className={`
      text-xs font-medium px-3 py-1 rounded-full
      ${insight.severity >= 5
              ? "bg-red-100 text-red-600"
              : insight.severity >= 3
                ? "bg-orange-100 text-orange-600"
                : "bg-yellow-100 text-yellow-600"
            }
      `}
        >
          Severity {insight.severity}
        </span>
      </div>

      <div className="mt-3 text-sm text-gray-600 leading-relaxed">
        {message?.primary_struggle && (
          <>
            <p>
              <span className="font-medium text-gray-800">
                Primary Struggle
              </span>{" "}
              {message.primary_struggle.replace("_", " ")}
            </p>

            <p>
              <span className="font-medium text-gray-800">Occurrence</span>{" "}
              {message.occurrence}
            </p>
          </>
        )}

        {message?.text && <p className="mt-1">{message.text}</p>}
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }: SummaryCardProps) {
  return (
    <div
      className="rounded-xl   p-5   flex items-center gap-4 
   
    w-[80%]
    hover:shadow-lg transition"
    >
      <div
        className="w-12 h-12 flex items-center justify-center
      rounded-xl bg-linear-to-br from-[#8EA6C9] to-[#b7ecb1]
      text-white shadow"
      >
        {icon}
      </div>

      <div>
        <p className="text-lg  text-pink-800/30 font-semibold uppercase tracking-wide">
          {label}
        </p>

        <h3 className="text-md text-orange-300">{value}</h3>
      </div>
    </div>
  );
}


function AnalyticsCard({ title, children }:AnalyticsCardProps) {
  return (
    <div
      className=" rounded-2xl p-5 

    transition"
    >
      <h2 className="text-sm font-semibold text-avocado-smoothie mb-3 uppercase tracking-wide">
        {title}
      </h2>

      {children}
    </div>
  );
}
