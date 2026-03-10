import { useEffect } from "react";

import { useDashboardStore } from "../stores/DashboardStore";
import NextActionCard from "../components/NextActionCard";
import InsightCard from "../components/Insightcard";
import nihongodesk from "../assets/nihongodesk.svg";
import Timeline from "./TimeLineList";
import profile from "../assets/user_profile.svg";
import { useNavigate } from "react-router-dom";
export default function DashboardPage() {
  const {
    insights,
    nextAction,
    loading,
    error,
    fetchDashboard,
  } = useDashboardStore();
  const navigate =useNavigate();

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
    <div className="flex h-screen overflow-y-auto">
      <div
        className={` flex-1  p-8    mr-64 flex flex-col items-start  gap-10 `}
      >
        <div className=" rounded-4xl  px-7  bg-white  flex items-center justify-between lg:text-3xl text-xl font-bold text-gray-500">
          <div className=" flex flex-col items-start">
            <h1 className=" xl:text-xl text-md">
              こんにちは! Welcome Back to your 日本語 デスク, Let's get some
              work done!
            </h1>
            <button onClick={()=>navigate("/study")}  className="  text-md mt-5 px-6 py-3 rounded-full bg-avocado-smoothie text-white font-semibold hover:bg-amber-800/50 cursor-pointer transition-colors duration-300">
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
        <div className=" grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
        <Timeline />
      </div>

      <div className="fixed right-0 top-0 h-screen w-64 bg-white text-mauve-500 p-9 flex flex-col items-center gap-10 shadow-lg overflow-y-auto rounded-l-3xl">
        <div className=" flex flex-col items-center ">
          <img src={profile} alt="Profile" className=" h-46" />
          <h1 className="text-lg font-bold text-center -mt-2.5 ">Lia San</h1>
        </div>
        <div>
          {" "}
          <NextActionCard action={nextAction} />
        </div>
      </div>
    </div>
  );
}
