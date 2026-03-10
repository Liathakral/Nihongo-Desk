import { useDashboardStore } from "../stores/DashboardStore";

import { VscEditSession } from "react-icons/vsc";
import { TbTrendingUp } from "react-icons/tb";
import { FaBatteryQuarter } from "react-icons/fa";

export default function Timeline() {
  const { timeline } = useDashboardStore();

  if (!timeline) return null;

  return (
    <div className="bg-white rounded-4xl shadow-sm p-6 w-full">
      <h2 className="text-xl font-bold text-avocado-smoothie mb-4">
        Timeline Analytics
      </h2>

      <table className="w-full text-md text-gray-600">
        <thead className="border-b text-gray-500">
          <tr className="text-left ">
            <th className="py-3 ">
              <h1 className=" flex items-center gap-2">
                <VscEditSession />
                Total sessions
              </h1>
            </th>
            <th className="">
              {" "}
              <h1 className=" flex items-center gap-2">
                <FaBatteryQuarter />
                Weakest Area
              </h1>
            </th>
            <th className=" ">
              {" "}
              <h1 className=" flex items-center gap-2">
                {" "}
                <TbTrendingUp />
                Studying Trend
              </h1>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          <tr className="hover:bg-gray-50 transition text-sm">
            <td className="py-4 font-semibold text-orange-500">
              {timeline.total_sessions}
              
            </td>

            <td className="gap-2 font-semibold text-orange-500">
              {timeline.weakest_area || "N/A"}
            </td>

            <td className="text-orange-500 font-semibold">
              {timeline.trend_direction === "improving" && "📈 Improving"}
              {timeline.trend_direction === "declining" && "📉 Declining"}
              {timeline.trend_direction === "stable" && "➖ Stable"}
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>
    
  );
}
