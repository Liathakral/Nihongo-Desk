import { useEffect } from "react";
import { useDashboardStore } from "../stores/DashboardStore";
import NextActionCard from "../components/NextActionCard";
import InsightCard from "../components/Insightcard";

export default function DashboardPage() {
  const {
    insights,
    nextAction,
    loading,
    error,
    fetchDashboard,
  } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* LEFT: INSIGHTS */}
      
      <div className="space-y-4">
        
        {insights.length === 0 ? (
          <div className="text-sm text-oat-latte">
            No active insights yet.
          </div>
        ) : (
          insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))
        )}
      </div>

      {/* RIGHT: NEXT ACTION */}
      <div className="col-span-2">
        <NextActionCard action={nextAction} />
      </div>
    </div>
  );
}