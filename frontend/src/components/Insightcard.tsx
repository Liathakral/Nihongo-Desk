import { AlertTriangle, Brain, Clock, TrendingUp } from "lucide-react";

interface InsightMessage {
  primary_struggle?: string;
  occurrence?: string;
  text?: string;
}

interface Insight {
  id: number;
  insight_type: string;
  title: string;
  message: InsightMessage;
  severity: number;
  evidence: Record<string, any>;
  is_active: boolean;
  valid_until: string | null;
}

interface Props {
  insight: Insight;
}

const iconMap = {
  weakness: AlertTriangle,
  pattern: TrendingUp,
  progress: Brain,
  warning: AlertTriangle,
};

export default function InsightCard({ insight }: Props) {
  const Icon = iconMap[insight.insight_type as keyof typeof iconMap] || Brain;

  return (
    <div
      className="relative p-6 rounded-3xl text-white shadow-xl
      bg-linear-to-br from-[#7c96c5] to-[#8EA6C9]
      hover:scale-[1.02] transition-all duration-300"
    >
      {/* icon badge */}
      <div className="absolute top-5 right-5 bg-white/20 p-2 rounded-xl">
        <Icon className=" size-3 lg:size-5" />
      </div>

      {/* title */}
      <h3 className="font-semibold lg:text-lg text-md w-[70%] mb-2">
        {insight.title}
      </h3>

      {/* type badge */}
      <div className="lg:text-sm text-xs font-bold  mb-4 flex items-center gap-2">
        <span className="bg-white/30 px-3 py-1  rounded-full  uppercase tracking-wide">
          {insight.insight_type}
        </span>
      </div>

      {/* message box */}
      <div className="bg-white/40  backdrop-blur-sm p-3 rounded-xl lg:text-sm text-xs mb-4 ">
        {insight.message.primary_struggle && (
          <p>
            <b>Primary Struggle:</b> {insight.message.primary_struggle}
          </p>
        )}

        {insight.message.occurrence && (
          <p>
            <b>Occurrence:</b> {insight.message.occurrence}
          </p>
        )}

        {insight.message.text && <p>{insight.message.text}</p>}
      </div>

      {/* footer */}
      <div className="flex items-center gap-2 lg:text-sm text-xs opacity-80 absolute bottom-4">
        <Clock size={14} />
        Valid until{" "}
        {insight.valid_until
          ? new Date(insight.valid_until).toLocaleDateString()
          : "N/A"}
      </div>
    </div>
  );
}
