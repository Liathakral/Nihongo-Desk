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

  const label = actionLabelMap[action.action_type] ?? action.action_type;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">

      {/* Title */}
      <h2 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2">
        <Brain size={22} />
        Next Recommended Action
      </h2>

      {/* Action Type */}
      <div className="bg-orange-50 rounded-xl p-4 mb-4">
        <p className="font-semibold text-md  text-gray-800 flex items-center gap-2">
          <Target size={18} className="text-orange-500" />
          {label}
        </p>
      </div>

      {/* Metrics Row */}
      

        {/* Duration */}
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 my-4 rounded-lg text-sm font-medium">
          <Clock size={16} />
          {action.duration_minutes} min
        </div>

        {/* Difficulty */}
      

        <div className="flex items-center gap-2 my-4 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium">
          <Activity size={16} />
          Difficulty {action.difficulty_level}/5
        </div>

      {/* Message */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-gray-600 italic text-sm">
          {action.message}
        </p>
      </div>

      {/* Focus Area */}
      {action.reasoning?.mistake_type && (
        <div className="mt-4 text-sm text-red-400 font-medium flex flex-col gap-2">
         
          <h1 className="font-bold flex items-center  gap-3"> <Target size={13}/>Focus area</h1>
           <h2>{action.reasoning.mistake_type.replace("_", " ")}</h2>
        </div>
      )}
    </div>
  );
}