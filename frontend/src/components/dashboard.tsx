import { useEffect } from "react";
import { useDashboardStore } from "../stores/DashboardStore";
// import NextActionCard from "../components/NextActionCard";
import InsightCard from "../components/Insightcard";
import nihongodesk from "../assets/nihongodesk.svg";
export default function DashboardPage() {
  const {
    insights,
    // nextAction,
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
     <div className=" flex-1  p-8 overflow-y-auto   ml-64 flex flex-col items-start  gap-10 ">
        <div className=" rounded-4xl  px-7 overflow-hidden bg-white  flex items-center justify-center text-3xl font-bold text-gray-500">
          <div className=" flex flex-col items-start">
            <h1 className=" text-xl">
              Hey! Welcome Back to your Nihongo Desk, Let's get some work done!
            </h1>
            <button className="  text-md mt-5 px-6 py-3 rounded-full bg-avocado-smoothie text-white font-semibold hover:bg-amber-600 transition-colors duration-300">
              Start Studying
            </button>
          </div>
          <img
            src={nihongodesk}
            alt="Welcome"
            width={250}
            height={250}
            className="ml-10 "
          />
        </div>
         <div className=" grid grid-cols-1 md:grid-cols-3 gap-8">
        {insights.map((insight) => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Insights</h2>

          <table className="w-full text-sm text-gray-600">
            <thead className="border-b text-gray-500">
              <tr className="text-left">
                <th className="py-3">Title</th>
                <th>Type</th>
                <th>Message</th>
                <th>Detected</th>
                <th>Valid Until</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              <tr className="hover:bg-gray-50 transition">
                <td className="py-4 font-medium text-gray-700">
                  Recurring Grammar Mistake
                </td>

                <td className="gap-2 text-orange-500">
                  📉 Weakness
                </td>

                <td className="text-gray-500">
                  Particles に / で confusion detected across sessions
                </td>

                <td>Mar 10</td>

                <td className="text-gray-500">Mar 17</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  );
}