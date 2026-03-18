import { Clock, Target, Activity, Brain } from "lucide-react";
import type { NextAction } from "../types/dashboard";

interface Props {
  action: NextAction | null;
}

const actionLabelMap: Record<string, string> = {
  light_review: "Light Review",
  targeted_practice: "Targeted Practice",
  timed_session: "Timed Session",
  reinforcement: "Reinforcement Session",
  balanced_review: "Balanced Review",
};

export default function NextActionCard({ action }: Props) {
  if (!action) return null;

  const labels = actionLabelMap[action.action_type] ?? action.action_type;

   const diffStyle =
    action.difficulty_level >= 4 ? "text-amber-600 bg-amber-50"
    : action.difficulty_level >= 3 ? "text-orange-500 bg-orange-50"
    : "text-green-600 bg-green-50"

  return (
    <div className="w-full flex flex-col gap-3">

      <h2 className="text-fluid-label font-black text-amber-700 tracking-widest
                     uppercase flex items-center gap-1.5">
        <Brain size={13} /> Next Action
      </h2>

      {/* Action type */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-3">
        <p className="text-fluid-sm font-bold text-stone-800 flex items-center gap-2">
          <Target size={14} className="text-amber-600 shrink-0" />
          {labels}
        </p>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-2 bg-blue-50 text-blue-700
                      px-3.5 py-2.5 rounded-xl text-fluid-xs font-semibold">
        <Clock size={13} />
        {action.duration_minutes} min
      </div>

      {/* Difficulty */}
      <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl
                       text-fluid-xs font-semibold ${diffStyle}`}>
        <Activity size={13} />
        Difficulty {action.difficulty_level}/5
        <div className="ml-auto flex gap-1">
          {[1,2,3,4,5].map(n => (
            <div key={n} className={`w-1.5 h-1.5 rounded-full transition-all
                                     ${n <= action.difficulty_level ? "bg-current" : "bg-stone-200"}`} />
          ))}
        </div>
      </div>

      {/* Message */}
      <div className="bg-stone-50 rounded-xl px-3.5 py-3 text-fluid-xs
                      text-stone-500 italic leading-relaxed">
        {action.message}
      </div>

      {/* Focus area */}
      {action.reasoning?.mistake_type && (
        <div className="flex items-center gap-1.5 text-fluid-xs text-amber-700 font-semibold">
          <Target size={11} />
          <span className="text-stone-400 font-normal">Focus:</span>
          {action.reasoning.mistake_type.replace(/_/g, " ")}
        </div>
      )}
    </div>
  )
}