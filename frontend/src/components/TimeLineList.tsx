import { useDashboardStore } from "../stores/DashboardStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

export default function TimelineAnalyticsView() {
  const { timeline } = useDashboardStore();

  if (!timeline) return null;

  return (
    <div className="space-y-8">

      {/* SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-gray-500">Total Sessions</p>
          <h3 className="text-2xl font-semibold text-savory-sage">
            {timeline.total_sessions}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-gray-500">Weakest Area</p>
          <h3 className="text-2xl font-semibold text-blush-beet">
            {timeline.weakest_area || "N/A"}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm">
          <p className="text-sm text-gray-500">Trend</p>
          <h3 className="text-2xl font-semibold">
            {timeline.trend_direction === "improving" && "📈 Improving"}
            {timeline.trend_direction === "declining" && "📉 Declining"}
            {timeline.trend_direction === "stable" && "➖ Stable"}
          </h3>
        </div>
      </div>

      {/* ACCURACY TREND */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-savory-sage">
          Accuracy Over Time
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timeline.accuracy_trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#818263"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* MISTAKE BREAKDOWN */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-savory-sage">
          Mistake Breakdown
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={timeline.mistake_breakdown}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mistake_type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#DDBAAE" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT INSIGHTS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-savory-sage">
          Recent Insights
        </h2>

        {timeline.recent_insights.map((insight, index) => (
          <div
            key={index}
            className="border border-oat-latte rounded-xl p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold text-savory-sage">
                {insight.title}
              </h3>

              <span className="text-xs text-blush-beet">
                Severity {insight.severity}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              {insight.message}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}