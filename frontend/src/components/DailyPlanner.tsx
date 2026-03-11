import { useState, useEffect } from "react";
import api from "../api/client";
import { TargetCard, Input } from "./UI/AIPlanner";
import {
  Book,
  Brain,
  Languages,
  Headphones,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import type {
  PlanCompletion,
  StudyPlan,
  StudyProfile,
} from "../types/dashboard";
import CreateProfileModal from "./StudyProfile";
import { Loader } from "./UI/loader";
export default function AIPlanner() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [completion, setCompletion] = useState<PlanCompletion | null>(null);
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  async function fetchProfile() {
    setLoadingProfile(true);

    try {
      const res = await api.get("/study-profile/");
      setProfile(res.data);
      console.log(res.data);
    } catch {
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  }
  const [form, setForm] = useState({
    vocab_done: 0,
    kanji_done: 0,
    grammar_done: 0,
    reading_minutes_done: 0,
    listening_minutes_done: 0,
  });

  async function fetchPlan() {
    setLoadingPlan(true);

    try {
      const res = await api.get("/daily-plan/today");
      setPlan(res.data);
      await fetchCompletion(res.data.id);

      console.log(res.data);
    } catch {
      console.log("no plan yet");
    } finally {
      setLoadingPlan(false);
    }
  }
  useEffect(() => {
    fetchPlan();
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {

    setForm({
      ...form,
      [e.target.name]: Number(e.target.value),
    });
  }

  function calculateProgress() {
    if (!plan) return 0;

    const vocab = form.vocab_done / plan.vocab_target;
    const kanji = form.kanji_done / plan.kanji_target;
    const grammar = form.grammar_done / plan.grammar_target;
    const reading = form.reading_minutes_done / plan.reading_minutes;
    const listening = form.listening_minutes_done / plan.listening_minutes;

    const progress = (vocab + kanji + grammar + reading + listening) / 5;

    return Math.min(100, Math.round(progress * 100));
  }

  async function completePlan() {
    if (!plan) return;

    try {
      const res = await api.patch(`/daily-plan/${plan.id}`, {
        ...form,
        completed: true,
      });

      setCompletion(res.data);
      console.log(completion);

      setForm({
        vocab_done: res.data.vocab_done || 0,
        kanji_done: res.data.kanji_done || 0,
        grammar_done: res.data.grammar_done || 0,
        reading_minutes_done: res.data.reading_minutes_done || 0,
        listening_minutes_done: res.data.listening_minutes_done || 0,
      });
    } catch (err) {
      console.log("completion error", err);
    }
  }

  async function fetchCompletion(planId: number) {
    try {
      const res = await api.get(`/daily-plan/${planId}/completion`);

      setCompletion(res.data);

      setForm({
        vocab_done: res.data.vocab_done || 0,
        kanji_done: res.data.kanji_done || 0,
        grammar_done: res.data.grammar_done || 0,
        reading_minutes_done: res.data.reading_minutes_done || 0,
        listening_minutes_done: res.data.listening_minutes_done || 0,
      });
    } catch {
      setCompletion(null);
    }
  }
  const completed = completion?.completed === true;

  if (loadingPlan) {
    return <Loader text={"fetching Today's plan"} />;
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen  p-6 md:p-10">
      {/* HEADER */}
      <div className="mb-10 flex items-center gap-3">
        <Brain className="text-avocado-smoothie" size={34} />
        <h1 className="text-3xl  md:text-4xl font-bold text-avocado-smoothie">
          Today's Study Plan
        </h1>
      </div>

      {!loadingPlan && !loadingProfile && !profile && (
        <div className="bg-white p-8 rounded-2xl shadow-md text-center space-y-4">
          <p className="text-gray-600">
            No study profile found. Create one to generate your AI study plan.
          </p>

          <CreateProfileModal />
        </div>
      )}
      {!loadingPlan && !loadingProfile && profile && !plan && (
        <div className="bg-white p-8 rounded-2xl shadow-md text-center space-y-4">
          <p className="text-gray-600">
            Your profile exists but today's plan hasn't been generated yet.
          </p>

          <button
            onClick={fetchPlan}
            className="bg-avocado-smoothie text-white px-6 py-3 rounded-xl"
          >
            Refresh Plan
          </button>
        </div>
      )}
      {plan && (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* TARGETS */}
          <div className=" backdrop-blur rounded-2xl p-8 ">
            <h2 className="text-2xl font-semibold text-avocado-smoothie mb-6">
              Targets
            </h2>

            <div className="grid grid-cols-1 gap-5 cursor-pointer">
              <TargetCard
                icon={<Book size={20} color="#c2c395" />}
                label="Vocabulary"
                value={plan.vocab_target}
              />

              <TargetCard
                icon={<Languages size={20} color="#c2c395" />}
                label="Kanji"
                value={plan.kanji_target}
              />

              <TargetCard
                icon={<Brain size={20} color="#c2c395" />}
                label="Grammar"
                value={plan.grammar_target}
              />

              <TargetCard
                icon={<BookOpen size={20} color="#c2c395" />}
                label="Reading"
                value={`${plan.reading_minutes} min`}
              />

              <TargetCard
                icon={<Headphones size={20} color="#c2c395" />}
                label="Listening"
                value={`${plan.listening_minutes} min`}
              />
            </div>
          </div>

          {/* PROGRESS */}
          <div className="bg-avocado-smoothie/10 backdrop-blur rounded-2xl p-8 shadow-md">
            <h2 className="text-2xl font-semibold text-avocado-smoothie mb-6">
              Log Progress
            </h2>

            <div className="space-y-4">
              <Input
                disabled={completed}
                name="vocab_done"
                value={form.vocab_done}
                placeholder="Vocabulary completed"
                onChange={handleChange}
              />

              <Input
                disabled={completed}
                name="kanji_done"
                value={form.kanji_done}
                placeholder="Kanji completed"
                onChange={handleChange}
              />

              <Input
                disabled={completed}
                name="grammar_done"
                value={form.grammar_done}
                placeholder="Grammar completed"
                onChange={handleChange}
              />

              <Input
                disabled={completed}
                name="reading_minutes_done"
                value={form.reading_minutes_done}
                placeholder="Reading minutes"
                onChange={handleChange}
              />

              <Input
                disabled={completed}
                name="listening_minutes_done"
                value={form.listening_minutes_done}
                placeholder="Listening minutes"
                onChange={handleChange}
              />
            </div>

            {/* PROGRESS BAR */}

            <div className="mt-8">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-600">
                  Progress Today
                </span>

                <span className="font-semibold text-avocado-smoothie">
                  {progress}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-avocado-smoothie h-3 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* COMPLETE BUTTON */}

            {!completed && (
              <button
                onClick={completePlan}
                className="mt-8 w-full flex items-center justify-center gap-2 cursor-pointer bg-avocado-smoothie hover:bg-amber-800/50 text-white py-3 rounded-xl font-semibold transition"
              >
                <CheckCircle size={18} />
                Complete Plan
              </button>
            )}

            {completed && (
              <div className="mt-8 flex items-center gap-2 text-green-600 font-semibold">
                <CheckCircle />
                Plan completed today
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
