import { AlertTriangle, Brain, Clock, Zap } from "lucide-react";

import type { Insight } from "../types/dashboard";
interface Props {
  insight: Insight;
}



export default function InsightCard({ insight }: Props) {
const typeConfig: Record<string, { badge: string; bar: string; icon: React.ReactNode }> = {
    WEAKNESS: {
      badge: "bg-amber-50 text-amber-700 border border-amber-200",
      bar:   "from-amber-400 to-amber-300",
      icon:  <AlertTriangle size={11} />,
    },
    STRENGTH: {
      badge: "bg-green-50 text-green-700 border border-green-200",
      bar:   "from-green-500 to-green-400",
      icon:  <Zap size={11} />,
    },
  }
  const cfg = typeConfig[insight.insight_type] ?? {
    badge: " text-avocado-smoothie border border-avocado-smoothie/50",
    bar:   "from-avocado-smoothie",
    icon:  <Brain size={11} />,
  }

   return (
    <div
      className="bg-white  rounded-2xl border border-stone-200 overflow-hidden
                 hover:-translate-y-1 hover:shadow-lg transition-all duration-200 flex flex-col"
      style={{ animationDelay: `200ms` }}
    >
      {/* Colored top bar */}
      <div className={`h-1 w-full bg-linear-to-r ${cfg.bar}`} />

      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Type badge */}
        <span className={`self-start flex items-center gap-1.5  md:text-[11px] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${cfg.badge}`}>
          {cfg.icon}
          {insight.insight_type}
        </span>

        {/* Title */}
        <h3 className=" md:text-[14px] text-xs font-bold text-stone-800 leading-snug">
          {insight.title}
        </h3>

        {/* Body */}
        <div className="bg-stone-50 rounded-xl px-3.5 py-3 text-xs text-stone-500 leading-relaxed space-y-0.5 flex-1">
          {insight.message.primary_struggle && (
            <p><span className="font-semibold text-stone-700">Primary Struggle</span> — {insight.message.primary_struggle}</p>
          )}
          {insight.message.occurrence && (
            <p><span className="font-semibold text-stone-700">Occurrence</span> — {insight.message.occurrence}</p>
          )}
          {insight.message.text && <p>{insight.message.text}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-1.5 text-[11px] text-stone-400 pt-1">
          <Clock size={11} />
          Valid until{" "}
          {insight.valid_until
            ? new Date(insight.valid_until).toLocaleDateString("en-GB")
            : "N/A"}
        </div>
      </div>
    </div>
  )
}

