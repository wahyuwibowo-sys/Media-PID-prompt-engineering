import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  Sparkles, 
  BookOpen, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { INITIAL_ASSESSMENT_QUESTIONS } from '../data/curriculumData';

interface InitialAssessmentProps {
  onFinishGoToArena: () => void;
  onFinishGoToLKPD: () => void;
}

export function InitialAssessment({
  onFinishGoToArena,
  onFinishGoToLKPD
}: InitialAssessmentProps) {
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  const totalQuestions = INITIAL_ASSESSMENT_QUESTIONS.length;
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectAnswer = (questionId: number, optionKey: string) => {
    if (showResults) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    INITIAL_ASSESSMENT_QUESTIONS.forEach((q) => {
      const selected = userAnswers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (selected && correctOption && selected === correctOption.key) {
        correct++;
      }
    });
    return {
      correct,
      percentage: Math.round((correct / totalQuestions) * 100)
    };
  };

  const scoreData = calculateScore();

  const handleReset = () => {
    setUserAnswers({});
    setShowResults(false);
  };

  const getReadinessLevel = (percentage: number) => {
    if (percentage >= 80) {
      return {
        level: 'Tingkat Mahir (Kesiapan Tinggi)',
        color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
        advice: 'Pemahaman dasar Prompt Engineering Anda sudah sangat solid! Anda siap langsung berkompetisi di Arena Papan Tulis atau membimbing rekan kelompok.'
      };
    }
    if (percentage >= 50) {
      return {
        level: 'Siap Belajar (Kesiapan Menengah)',
        color: 'text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
        advice: 'Anda sudah memahami prinsip AI, namun perlu memperkuat detail penulisan Batasan (Limitations) dan Konteks (Context) agar AI tidak berhalusinasi.'
      };
    }
    return {
      level: 'Perlu Pendampingan Konsep (Kesiapan Awal)',
      color: 'text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
      advice: 'Sangat disarankan membaca materi Pendahuluan dan mencermati 4 pilar RTCL bersama guru sebelum memulai penyusunan prompt.'
    };
  };

  const readiness = getReadinessLevel(scoreData.percentage);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-purple-100 mb-2 border border-white/20">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Asesmen Awal</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Asesmen Kesiapan Belajar Prompt Engineering
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-xl">
            Uji pemahaman awal Anda seputar cara kerja AI, fenomena halusinasi, dan kaidah perumusan prompt terstruktur.
          </p>
        </div>

        {/* Progress or Score badge */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-32">
          {!showResults ? (
            <>
              <span className="text-2xl font-black">{answeredCount} / {totalQuestions}</span>
              <span className="text-[11px] font-bold text-purple-200">Terjawab</span>
            </>
          ) : (
            <>
              <span className="text-3xl font-black text-amber-300">{scoreData.percentage}%</span>
              <span className="text-[11px] font-bold text-purple-100">{scoreData.correct} Benar dari {totalQuestions}</span>
            </>
          )}
        </div>
      </div>

      {/* Result Card when submitted */}
      {showResults && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-purple-500/50 shadow-xl space-y-4 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className={`inline-block text-xs font-black px-3 py-1 rounded-full border mb-2 ${readiness.color}`}>
                {readiness.level}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                Hasil Evaluasi Asesmen Awal
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {readiness.advice}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Tes</span>
              </button>

              <button
                onClick={onFinishGoToArena}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md flex items-center gap-2 transition-transform active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>Masuk ke Arena Lomba</span>
              </button>

              <button
                onClick={onFinishGoToLKPD}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md flex items-center gap-2 transition-transform active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Kerjakan LKPD Mandiri</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Cards */}
      <div className="space-y-5">
        {INITIAL_ASSESSMENT_QUESTIONS.map((q, idx) => {
          const selectedKey = userAnswers[q.id];
          const correctOption = q.options.find((o) => o.isCorrect);
          const isAnswered = Boolean(selectedKey);

          return (
            <div 
              key={q.id}
              className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all ${
                showResults 
                  ? selectedKey === correctOption?.key
                    ? 'border-emerald-400 dark:border-emerald-700 bg-emerald-50/20'
                    : 'border-rose-400 dark:border-rose-700 bg-rose-50/20'
                  : isAnswered
                  ? 'border-blue-400 dark:border-blue-700 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              {/* Question Number and Category Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-black text-xs">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-slate-600 dark:text-slate-400">
                    Fokus: {q.targetConcept}
                  </span>
                </div>

                {showResults && (
                  <span className={`text-xs font-black flex items-center gap-1 ${
                    selectedKey === correctOption?.key ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {selectedKey === correctOption?.key ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Benar
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" /> Belum Tepat
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug mb-4">
                {q.question}
              </h4>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt) => {
                  const isOptionSelected = selectedKey === opt.key;
                  let optionStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';

                  if (showResults) {
                    if (opt.isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 font-bold';
                    } else if (isOptionSelected && !opt.isCorrect) {
                      optionStyle = 'border-rose-500 bg-rose-100/70 dark:bg-rose-950/80 text-rose-950 dark:text-rose-200';
                    } else {
                      optionStyle = 'border-slate-200 dark:border-slate-800 opacity-60 text-slate-500';
                    }
                  } else if (isOptionSelected) {
                    optionStyle = 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-950 dark:text-blue-100 font-bold ring-2 ring-blue-500';
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectAnswer(q.id, opt.key)}
                      disabled={showResults}
                      className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {opt.key}
                      </span>
                      <span className="leading-snug pt-0.5">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation note when results are shown */}
              {showResults && (
                <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                  <strong>💡 Penjelasan Pedagogis:</strong> {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Action */}
      {!showResults && (
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-4 sticky bottom-4 z-20">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {answeredCount === totalQuestions ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Seluruh pertanyaan ({totalQuestions}) sudah dijawab!
              </span>
            ) : (
              <span>Masih tersisa {totalQuestions - answeredCount} pertanyaan yang belum dipilih.</span>
            )}
          </div>

          <button
            onClick={() => setShowResults(true)}
            disabled={answeredCount === 0}
            className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
              answeredCount === 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/25 active:scale-95'
            }`}
          >
            <span>Kirim & Periksa Jawaban</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
