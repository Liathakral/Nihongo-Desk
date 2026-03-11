import { useState } from "react";
import api from "../api/client";
import { Link, Send } from "lucide-react";

interface Props {
  sessionId: number;
  onSuccess: () => void;
}

const STRUGGLES = [
  { value: "particle", label: "Particle" },
  { value: "vocabulary", label: "Vocabulary" },
  { value: "grammar_structure", label: "Grammar Structure" },
  { value: "reading_inference", label: "Reading Inference" },
  { value: "listening_detail", label: "Listening Detail" },
  { value: "kanji", label: "Kanji" },
  { value: "time_pressure", label: "Time Pressure" },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

function Pips({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`w-9 h-9 cursor-pointer rounded-lg text-xs font-semibold transition-all duration-150
            ${
              n <= value
                ? "bg-avocado-smoothie text-white shadow-sm"
                : "bg-slate-100 text-slate-400 hover:bg-slate-200"
            }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function PerformanceForm({ sessionId, onSuccess }: Props) {
  const [activitySource, setActivitySource] = useState("");
  const [perceivedPerformance, setPerceivedPerformance] = useState(0.7);
  const [primaryStruggle, setPrimaryStruggle] = useState("grammar_structure");
  const [focusLevel, setFocusLevel] = useState(3);
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [confidenceRating, setConfidenceRating] = useState<number | null>(null);
  const [reflectionNote, setReflectionNote] = useState("");

  const handleSubmit = async () => {
    await api.post("/performance/", {
      session_id: sessionId,
      activity_source: activitySource,
      perceived_performance: perceivedPerformance,
      primary_struggle: primaryStruggle,
      focus_level: focusLevel,
      difficulty_level: difficultyLevel,
      confidence_rating: confidenceRating,
      note: reflectionNote || null,
    });
    onSuccess();
  };

  const pct = Math.round(
    (isNaN(perceivedPerformance) ? 0.7 : perceivedPerformance) * 100,
  );

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-100 shadow-sm">
      {/* Title */}
      <h2 className="text-base font-semibold text-slate-700 mb-6">
        Session Reflection
      </h2>

      <div className="space-y-5">
        {/* Source */}
        <div>
          <Label>Source</Label>
          <div className="relative">
            <Link
              size={12}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
            />
            <input
              type="text"
              placeholder="https://japanesetest4you.com/"
              value={activitySource}
              onChange={(e) => setActivitySource(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-avocado-smoothie/20 focus:border-avocado-smoothie transition-all"
            />
          </div>
        </div>

        {/* Performance */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Perceived Performance</Label>
            <span className="text-sm font-semibold text-avocado-smoothie tabular-nums">
              {pct}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-avocado-smoothie rounded-full transition-all duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={perceivedPerformance}
            onChange={(e) => setPerceivedPerformance(Number(e.target.value))}
            className="w-full cursor-pointer accent-avocado-smoothie"
          />
        </div>

        {/* Primary Struggle */}
        <div>
          <Label>Primary Struggle</Label>
          <div className="flex flex-wrap gap-2">
            {STRUGGLES.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setPrimaryStruggle(opt.value)}
                className={`px-3 py-1.5 cursor-pointer rounded-lg text-xs font-medium border transition-all duration-150
                  ${
                    primaryStruggle === opt.value
                      ? "bg-avocado-smoothie text-white border-avocado-smoothie"
                      : "bg-white border-slate-200 text-slate-500 hover:border-avocado-smoothie/40 hover:text-avocado-smoothie"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Focus + Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Focus Level</Label>
            <Pips value={focusLevel} onChange={setFocusLevel} />
          </div>
          <div>
            <Label>Difficulty</Label>
            <Pips value={difficultyLevel} onChange={setDifficultyLevel} />
          </div>
        </div>

        {/* Confidence */}
        <div>
          <Label>
            Confidence{" "}
            <span className="normal-case tracking-normal font-normal text-slate-300">
              · optional
            </span>
          </Label>
          <Pips
            value={confidenceRating ?? 0}
            onChange={(v) =>
              setConfidenceRating(confidenceRating === v ? null : v)
            }
          />
        </div>

        {/* Reflection Note */}
        <div>
          <Label>Reflection Note</Label>
          <textarea
            value={reflectionNote}
            onChange={(e) => setReflectionNote(e.target.value)}
            placeholder="What clicked? What felt confusing?"
            rows={3}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl resize-none placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-avocado-smoothie/20 focus:border-avocado-smoothie transition-all leading-relaxed"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2 bg-avocado-smoothie hover:bg-[#7a97be] text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-150 hover:-translate-y-px active:translate-y-0"
        >
          <Send size={13} />
          Submit Reflection
        </button>
      </div>
    </div>
  );
}
