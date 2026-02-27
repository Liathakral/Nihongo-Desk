import { useState } from "react";
import api from "../api/client";

interface Props {
  sessionId: number;
  onSuccess: () => void;
}

export default function PerformanceForm({ sessionId, onSuccess }: Props) {
  const [perceivedPerformance, setPerceivedPerformance] = useState(0.7);
  const [primaryStruggle, setPrimaryStruggle] = useState("grammar_structure");
  const [focusLevel, setFocusLevel] = useState(3);
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [confidenceRating, setConfidenceRating] = useState<number | null>(null);
  const [reflectionNote, setReflectionNote] = useState("");

  const handleSubmit = async () => {
    await api.post("/performance/", {
      session_id: sessionId,
      perceived_performance: perceivedPerformance,
      primary_struggle: primaryStruggle,
      focus_level: focusLevel,
      difficulty_level: difficultyLevel,
      confidence_rating: confidenceRating,
      reflection_note: reflectionNote || null,
    });

    onSuccess();
  };

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
      <h2 className="text-lg font-semibold text-savory-sage mb-4">
        Session Reflection
      </h2>

      {/* Performance (0–1 float) */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">
          Perceived Performance (0–1)
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="1"
          value={perceivedPerformance}
          onChange={(e) => setPerceivedPerformance(Number(e.target.value))}
          className="w-full border rounded-lg p-2 mt-1"
        />
      </div>

      {/* Primary Struggle */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Primary Struggle</label>
        <select
          value={primaryStruggle}
          onChange={(e) => setPrimaryStruggle(e.target.value)}
          className="w-full border rounded-lg p-2 mt-1"
        >
          <option value="particle">Particle</option>
          <option value="vocabulary">Vocabulary</option>
          <option value="grammar_structure">Grammar Structure</option>
          <option value="reading_inference">Reading Inference</option>
          <option value="listening_detail">Listening Detail</option>
          <option value="kanji">Kanji</option>
          <option value="time_pressure">Time Pressure</option>
        </select>
      </div>

      {/* Focus Level */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Focus Level (1–5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={focusLevel}
          onChange={(e) => setFocusLevel(Number(e.target.value))}
          className="w-full border rounded-lg p-2 mt-1"
        />
      </div>

      {/* Difficulty Level */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Difficulty Level (1–5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(Number(e.target.value))}
          className="w-full border rounded-lg p-2 mt-1"
        />
      </div>

      {/* Confidence Rating */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">
          Confidence Rating (optional)
        </label>
        <input
          type="number"
          min="1"
          max="5"
          value={confidenceRating ?? ""}
          onChange={(e) =>
            setConfidenceRating(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full border rounded-lg p-2 mt-1"
        />
      </div>

      {/* Reflection */}
      <div className="mb-4">
        <label className="text-sm text-gray-600">Reflection Note</label>
        <textarea
          value={reflectionNote}
          onChange={(e) => setReflectionNote(e.target.value)}
          className="w-full border rounded-lg p-2 mt-1"
          rows={3}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-savory-sage text-white px-4 py-2 rounded-lg w-full"
      >
        Submit Reflection
      </button>
    </div>
  );
}