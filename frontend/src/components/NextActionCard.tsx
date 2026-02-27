

interface NextAction {
  id: number;
  action_type: string;
  duration_minutes: number;
  difficulty_level: number;
  message: string;
  reasoning: Record<string, any>;
  is_active: boolean;
  created_at: string;
}
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

  const label =
    actionLabelMap[action.action_type] ?? action.action_type;

  return (
    <div className="bg-honey-oatmilk rounded-2xl shadow-sm p-6 border border-oat-latte">
      <h2 className="text-lg font-semibold text-savory-sage mb-3">
        Next Recommended Action
      </h2>

      <div className="space-y-2 text-black">
        <p className="font-medium text-md">
          {label}
        </p>

        <p className="text-sm">
          Duration: {action.duration_minutes} minutes
        </p>

        <p className="text-sm">
          Difficulty: {action.difficulty_level} / 5
        </p>

        <div className="mt-4 p-3 bg-white rounded-lg border border-oat-latte">
          <p className="text-sm italic text-savory-sage">
            {action.message}
          </p>
        </div>

        {/* Optional reasoning preview */}
      {action.reasoning.mistake_type && (
  <p className="text-xs text-blush-beet mt-2">
    Focus area: {action.reasoning.mistake_type}
  </p>
)}
      </div>
    </div>
  );
}
