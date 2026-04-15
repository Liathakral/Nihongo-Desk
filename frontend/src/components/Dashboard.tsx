import { useEffect } from "react";
import { useDashboardStore } from "../stores/DashboardStore";
import NextActionCard from "./NextActionCard";
import InsightCard from "./InsightCard";
import nihongodesk from "../assets/nihongodesk.svg";
import profile from "../assets/user_profile.svg";
import { useNavigate } from "react-router-dom";
import { Loader } from "./UI/Loader";

export default function DashboardPage() {
  const { insights, nextAction, loading, error, fetchDashboard } =
    useDashboardStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <Loader text={"fetching dashboard"} />;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen w-full bg-stone-100 overflow-hidden">
      {/* ── Scrollable main ── */}
      <div className="flex-1 w-full overflow-y-auto  px-10 py-9 space-y-8">
        {/* Hero */}
        <div
          className="bg-white rounded-3xl border border-stone-200 px-8 py-8
                        flex items-center justify-between relative overflow-hidden"
        >
          {/* Glow blob */}
          <div
            className="absolute -top-10 right-48 w-48   rounded-full
                          bg-lime-100 opacity-60 blur-3xl pointer-events-none"
          />

          {/* Hero */}
          <div
            className="bg-white rounded-2xl w-full lg:rounded-3xl  border border-stone-200
                relative overflow-hidden
                flex items-center justify-between gap-4
                px-7 sm:px-10 py-7 sm:py-8"
          >
            {/* Subtle glow — top right */}
            <div
              className="absolute top-0 right-0 w-72 h-full
                  bg-gradient-to-bl from-lime-50 via-transparent to-transparent
                  pointer-events-none"
            />

            {/* Text */}
            <div className="relative flex flex-col gap-2 max-w-sm">
              <p className="text-[9px] lg:text-[11px] font-black tracking-[0.18em] text-lime-700 uppercase">
                こんにちは ✦ Welcome Back
              </p>

              <h1 className="lg:text-lg md:text-xs text-[10px] font-extrabold text-stone-800 leading-tight">
                Your 日本語 デスク is ready.
              </h1>

              <p className="lg:text-xs md:text-[11px]  text-[9px] text-stone-400">
                Let's get some work done.
              </p>

              <button
                onClick={() => navigate("/dailyplans")}
                className="self-start mt-2 px-5 py-2 rounded-full
                lg:text-[13px] text-[11px] text-nowrap font-bold text-white
                 bg-avocado-smoothie hover:bg-lime-800/40
                 hover:-translate-y-0.5 shadow-sm hover:shadow-md
                 transition-all duration-200 cursor-pointer"
              >
                Start Studying →
              </button>
            </div>

            {/* Image — anchored bottom right */}
            <div className="relative shrink-0 self-end">
              <img
                src={nihongodesk}
                alt="Nihongo Desk"
                className="h-24 sm:h-36 lg:h-40 object-contain object-bottom"
              />
            </div>
          </div>
        </div>

        {/* Insights section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] font-black tracking-[0.14em] text-stone-400 uppercase">
              Insights
            </span>
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-[11px] text-stone-300">
              {insights.length} active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {insights.map((insight, i) => (
              <InsightCard key={insight.id} insight={insight} index={i} />
            ))}
            {insights.length === 0 && (
              <div className="col-span-full text-center py-14 text-stone-300 text-sm">
                No insights yet — complete a study session to get started.
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
      </div>

      {/* ── Right sidebar ── */}
      <div
        className="    bg-white w-64
                      border-l border-stone-200 rounded-l-3xl
                      flex flex-col items-center px-5 py-8 gap-6
                      shadow-[-4px_0_24px_rgba(0,0,0,0.04)] overflow-y-auto"
      >
        {/* Profile */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <img
              src={profile}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-stone-100"
            />
            <span
              className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full
                             bg-lime-500 border-2 border-white"
            />
          </div>
          <div className="text-center">
            <h2 className="text-sm font-bold text-stone-800">Lia San</h2>
            <p className="text-[11px] text-stone-400">Active learner</p>
          </div>
        </div>

        <div className="w-full h-px bg-stone-100" />

        <NextActionCard action={nextAction} />
      </div>
    </div>
  );
}
