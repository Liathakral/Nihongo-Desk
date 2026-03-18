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
  RefreshCw,
} from "lucide-react";
import type {
  PlanCompletion,
  StudyPlan,
  StudyProfile,
} from "../types/dashboard";
import CreateProfileModal from "./StudyProfile";
import { Loader } from "./UI/Loader";
import { useJobLogs } from "../hooks/LogHook";
export default function AIPlanner() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const { connectLogs } = useJobLogs();
  const [jobId, setJobId] = useState<string | null>(null);

  const [completion, setCompletion] = useState<PlanCompletion | null>(null);
  const [profile, setProfile] = useState<StudyProfile | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [form, setForm] = useState({
    vocab_done: "",
    kanji_done: "",
    grammar_done: "",
    reading_minutes_done: "",
    listening_minutes_done: "",
  });
  useEffect(() => {
    if (jobId) {
      connectLogs(jobId);
    }
  }, [jobId, connectLogs]);
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
      [e.target.name]: e.target.value,
    });
  }

  function calculateProgress() {
    if (!plan) return 0;

    const vocab = Number(form.vocab_done) / plan.vocab_target;
    const kanji = Number(form.kanji_done) / plan.kanji_target;
    const grammar = Number(form.grammar_done) / plan.grammar_target;
    const reading = Number(form.reading_minutes_done) / plan.reading_minutes;
    const listening =
      Number(form.listening_minutes_done) / plan.listening_minutes;

    const progress = (vocab + kanji + grammar + reading + listening) / 5;

    return Math.min(100, Math.round(progress * 100));
  }

useEffect(() => {
  const savedJobId = localStorage.getItem("lastJobId")
  if (savedJobId) {
    connectLogs(savedJobId)  // ← only here on reload
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
  async function completePlan() {
    if (!plan) return;

    try {
      const res = await api.patch(`/daily-plan/${plan.id}`, {
        ...form,
        completed: true,
      });

      setCompletion(res.data);
      console.log(res.data.job_id);
      const jobId = res.data.job_id;
      localStorage.setItem("lastJobId", jobId);
      setJobId(jobId);
      connectLogs(jobId);

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
      console.log(res.data);
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
    <div className="h-screen w-full overflow-y-auto  p-6 md:p-10">
      {/* HEADER */}
      <div className="mb-10 flex items-center gap-3">
        <Brain className="text-amber-800/60" size={34} />
        <h1 className="text-xl  font-mono font-semibold  text-amber-800/60 ">
          Today's Study Plan
        </h1>
      </div>

      {!loadingPlan && !loadingProfile && !profile && (
  <div className="flex flex-col items-center justify-center text-center
                  bg-white border border-stone-200 rounded-2xl
                  px-8 py-14 gap-5 max-w-md mx-auto">
    
    {/* Icon */}
    <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center
                    justify-center text-stone-400">
      <Brain size={22} />
    </div>

    {/* Text */}
    <div className="space-y-1.5">
      <h3 className="text-fluid-md font-bold text-stone-700">
        No study profile yet
      </h3>
      <p className="text-fluid-xs text-stone-400 max-w-xs leading-relaxed">
        Create a profile so we can build your personalised AI study plan.
      </p>
    </div>

    <CreateProfileModal />
  </div>
)}

{!loadingPlan && !loadingProfile && profile && !plan && (
  <div className="flex flex-col  items-center justify-center text-center
                  bg-white border border-stone-200 rounded-2xl
                  px-8 py-14 gap-5 max-w-md mx-auto">

    {/* Icon */}
    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center
                    justify-center text-amber-500">
      <RefreshCw size={20} />
    </div>

    {/* Text */}
    <div className="space-y-1.5">
      <h3 className="text-fluid-md font-bold text-stone-700">
        Plan not generated yet
      </h3>
      <p className="text-fluid-xs text-stone-400 max-w-xs leading-relaxed">
        Your profile is ready — today's study plan just needs to be generated.
      </p>
    </div>

    <button
      onClick={fetchPlan}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full
                 bg-stone-800 hover:bg-stone-700 text-white
                 text-fluid-xs font-semibold
                 transition-all duration-200 hover:-translate-y-0.5
                 shadow-sm hover:shadow-md cursor-pointer"
    >
      <RefreshCw size={13} />
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
