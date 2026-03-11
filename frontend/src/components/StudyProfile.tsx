"use client";

import { useState } from "react";
import api from "../api/client";
import { ModalOverlay, Modal, Dialog } from "../components/UI/Modal";

const JLPT_LEVELS = ["N5", "N4", "N3", "N2", "N1"] as const;

const LEVEL_META: Record<string, { label: string; color: string; desc: string }> = {
  N5: { label: "N5", color: "bg-emerald-100 text-emerald-700 ring-emerald-300", desc: "Beginner" },
  N4: { label: "N4", color: "bg-lime-100 text-lime-700 ring-lime-300", desc: "Elementary" },
  N3: { label: "N3", color: "bg-yellow-100 text-yellow-700 ring-yellow-300", desc: "Intermediate" },
  N2: { label: "N2", color: "bg-orange-100 text-orange-700 ring-orange-300", desc: "Upper-Inter" },
  N1: { label: "N1", color: "bg-red-100 text-red-700 ring-red-300", desc: "Advanced" },
};

export default function CreateProfileModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    jlpt_level: "N3",
    target_exam_date: "",
    daily_study_minutes: 90,
    vocab_known: 0,
    kanji_known: 0,
    grammar_known: 0,
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function createProfile() {
    setLoading(true);
    try {
      await api.post("/study-profile/", {
        ...form,
        target_exam_date: new Date(form.target_exam_date).toISOString(),
      });
      setIsOpen(false);
     
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-avocado-smoothie px-6 py-3.5 text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
      >
        <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Create Study Profile
        </span>
        {/* shimmer */}
        <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
      </button>

      {/* MODAL */}
      <ModalOverlay isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal className="mx-auto w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
          <Dialog>
            <div>
              {/* Header stripe */}
              <div className="relative bg-avocado-smoothie px-8 py-6 overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10" />
                <div className="absolute top-2 right-16 h-8 w-8 rounded-full bg-white/10" />

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                      JLPT Preparation
                    </p>
                    <h2 className="mt-0.5 text-2xl font-bold text-white">
                      Study Profile
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                    🍵
                  </div>
                </div>
              </div>

              {/* Form body */}
              <div className="space-y-5 px-8 py-6">

                {/* JLPT Level selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Target Level
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {JLPT_LEVELS.map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setForm({ ...form, jlpt_level: lvl })}
                        className={`
                          flex flex-col items-center gap-0.5 rounded-xl px-2 py-2.5 ring-1 text-center
                          transition-all duration-200 cursor-pointer
                          ${form.jlpt_level === lvl
                            ? `${LEVEL_META[lvl].color} ring-2 scale-105 shadow-sm font-bold`
                            : "bg-gray-50 text-gray-500 ring-gray-200 hover:bg-gray-100"
                          }
                        `}
                      >
                        <span className="text-sm font-bold">{lvl}</span>
                        <span className="text-[9px] opacity-70">{LEVEL_META[lvl].desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exam Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Target Exam Date
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      📅
                    </span>
                    <input
                      type="date"
                      name="target_exam_date"
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-avocado-smoothie focus:bg-white focus:ring-2 focus:ring-avocado-smoothie/20"
                    />
                  </div>
                </div>

                {/* Daily Study */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Daily Study
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">⏱</span>
                      <input
                        type="number"
                        name="daily_study_minutes"
                        value={form.daily_study_minutes}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-avocado-smoothie focus:bg-white focus:ring-2 focus:ring-avocado-smoothie/20"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-400">min / day</span>
                  </div>
                  {/* Visual indicator */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-avocado-smoothie transition-all duration-500"
                      style={{ width: `${Math.min((Number(form.daily_study_minutes) / 240) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Known stats */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Already Know
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: "vocab_known", icon: "📖", label: "Vocab" },
                      { name: "kanji_known", icon: "漢", label: "Kanji" },
                      { name: "grammar_known", icon: "文", label: "Grammar" },
                    ].map(({ name, icon, label }) => (
                      <div key={name} className="group relative">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-md bg-avocado-smoothie px-1.5 py-0.5 text-[10px] font-bold text-white opacity-0 transition group-focus-within:opacity-100">
                          {label}
                        </div>
                        <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-2 focus-within:border-avocado-smoothie focus-within:bg-white focus-within:ring-2 focus-within:ring-avocado-smoothie/20 transition">
                          <span className="text-sm">{icon}</span>
                          <input
                            type="number"
                            name={name}
                            placeholder="0"
                            onChange={handleChange}
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-300"
                          />
                        </div>
                        <p className="mt-0.5 text-center text-[10px] text-gray-400">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-8 py-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={createProfile}
                  disabled={loading}
                  className="group relative cursor-pointer overflow-hidden rounded-xl bg-avocado-smoothie px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Creating…
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Create Profile
                      </>
                    )}
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                </button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </>
  );
}