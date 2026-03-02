
interface Insight {
  id: number;
  insight_type: string;
  title: string;
  message: string;
  severity: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evidence: Record<string, any>;
  is_active: boolean;
  valid_until: string | null;
}

interface Props {
  insight: Insight;
}

export default function InsightCard({ insight }: Props) {
  const severityColor =
    insight.severity >= 5
      ? "bg-blush-beet"
      : insight.severity >= 3
      ? "bg-avocado-smoothie"
      : "bg-peach-protein";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-oat-latte">
      <div className={`w-3 h-3 rounded-full mb-3 ${severityColor}`} />

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-md font-medium text-savory-sage">
          {insight.title}
        
        </h3>

        <span className="text-xs text-oat-latte uppercase tracking-wide">
          {insight.insight_type}
        </span>
      </div>

      <p className="text-sm text-savory-sage mb-3">
        {insight.message}
      </p>

      {insight.valid_until && (
        <p className="text-xs text-oat-latte">
          Valid until: {new Date(insight.valid_until).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
