import { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  HelpCircle,
  Check
} from 'lucide-react';
import { RTCLAuditScore } from '../types/rtcl';

interface StudentAuditCardProps {
  audit: RTCLAuditScore;
}

export function StudentAuditCard({ audit }: StudentAuditCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40';
    if (score >= 70) return 'text-blue-600 dark:text-blue-400 border-blue-500 bg-blue-50 dark:bg-blue-950/40';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400 border-amber-500 bg-amber-50 dark:bg-amber-950/40';
    return 'text-rose-600 dark:text-rose-400 border-rose-500 bg-rose-50 dark:bg-rose-950/40';
  };

  const getProgressColor = (score: number) => {
    if (score >= 20) return 'bg-emerald-500';
    if (score >= 15) return 'bg-blue-500';
    if (score >= 10) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border font-extrabold text-base sm:text-lg shadow-sm ${getScoreColor(audit.totalScore)}`}>
            {audit.totalScore}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Rubrik Evaluasi RTCL Siswa
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                audit.totalScore >= 85
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                  : audit.totalScore >= 70
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                  : audit.totalScore >= 50
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                  : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
              }`}>
                {audit.grade}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Skor otomatis kelengkapan formulasi prompt (Target: 85-100)
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline self-end sm:self-center"
        >
          <span>{showDetails ? 'Sembunyikan Catatan' : 'Lihat Rekomendasi Poin'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 4 Pillars Progress Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
        {/* Role */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">R</span>
              Peran
            </span>
            <span className="text-[11px]">{audit.roleScore}/25</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${getProgressColor(audit.roleScore)} transition-all duration-300`} style={{ width: `${(audit.roleScore / 25) * 100}%` }} />
          </div>
        </div>

        {/* Task */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-indigo-600 text-white text-[10px] flex items-center justify-center font-bold">T</span>
              Tugas
            </span>
            <span className="text-[11px]">{audit.taskScore}/25</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${getProgressColor(audit.taskScore)} transition-all duration-300`} style={{ width: `${(audit.taskScore / 25) * 100}%` }} />
          </div>
        </div>

        {/* Context */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">C</span>
              Konteks
            </span>
            <span className="text-[11px]">{audit.contextScore}/25</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${getProgressColor(audit.contextScore)} transition-all duration-300`} style={{ width: `${(audit.contextScore / 25) * 100}%` }} />
          </div>
        </div>

        {/* Limitations */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            <span className="flex items-center gap-1">
              <span className="w-4 h-4 rounded bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">L</span>
              Batasan
            </span>
            <span className="text-[11px]">{audit.limitationsScore}/25</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full ${getProgressColor(audit.limitationsScore)} transition-all duration-300`} style={{ width: `${(audit.limitationsScore / 25) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Expandable feedback details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Tips Peningkatan untuk Siswa:
          </h4>

          {audit.totalScore === 100 ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Luar biasa! Prompt kamu telah memenuhi seluruh kriteria RTCL dengan sempurna (Skor 100/100). Siap disalin atau dikumpulkan!</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {audit.feedback.role.map((tip, i) => (
                <div key={`r-${i}`} className="p-2.5 bg-blue-50/60 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300 rounded-lg border border-blue-100 dark:border-blue-900/30 flex items-start gap-1.5">
                  <span className="font-bold text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded mt-0.5">R</span>
                  <span>{tip}</span>
                </div>
              ))}
              {audit.feedback.task.map((tip, i) => (
                <div key={`t-${i}`} className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 rounded-lg border border-indigo-100 dark:border-indigo-900/30 flex items-start gap-1.5">
                  <span className="font-bold text-[10px] bg-indigo-600 text-white px-1.5 py-0.2 rounded mt-0.5">T</span>
                  <span>{tip}</span>
                </div>
              ))}
              {audit.feedback.context.map((tip, i) => (
                <div key={`c-${i}`} className="p-2.5 bg-teal-50/60 dark:bg-teal-950/20 text-teal-900 dark:text-teal-300 rounded-lg border border-teal-100 dark:border-teal-900/30 flex items-start gap-1.5">
                  <span className="font-bold text-[10px] bg-teal-600 text-white px-1.5 py-0.2 rounded mt-0.5">C</span>
                  <span>{tip}</span>
                </div>
              ))}
              {audit.feedback.limitations.map((tip, i) => (
                <div key={`l-${i}`} className="p-2.5 bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 rounded-lg border border-amber-100 dark:border-amber-900/30 flex items-start gap-1.5">
                  <span className="font-bold text-[10px] bg-amber-600 text-white px-1.5 py-0.2 rounded mt-0.5">L</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
