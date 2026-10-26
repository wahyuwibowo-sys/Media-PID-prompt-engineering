import { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Target, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { STUDENT_CHALLENGES } from '../data/studentChallenges';
import { StudentChallenge, RTCLForm } from '../types/rtcl';

interface StudentChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChallenge: (form: RTCLForm, challengeTitle: string) => void;
}

export function StudentChallengesModal({
  isOpen,
  onClose,
  onSelectChallenge
}: StudentChallengesModalProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<StudentChallenge | null>(null);

  if (!isOpen) return null;

  const handleStartPractice = (challenge: StudentChallenge) => {
    // Provide a starting framework with context pre-set from the challenge
    const practiceForm: RTCLForm = {
      role: '',
      task: '',
      context: challenge.scenario,
      limitations: 'Gunakan Bahasa Indonesia baku, terstruktur, maksimal 300 kata',
      customTitle: `Latihan_${challenge.title.replace(/\s+/g, '_')}`
    };
    onSelectChallenge(practiceForm, challenge.title);
    onClose();
  };

  const handleLoadSampleSolution = (challenge: StudentChallenge) => {
    const fullSampleForm: RTCLForm = {
      role: challenge.sampleRole,
      task: challenge.sampleTask,
      context: challenge.sampleContext,
      limitations: challenge.sampleLimitations,
      customTitle: `Contoh_${challenge.title.replace(/\s+/g, '_')}`
    };
    onSelectChallenge(fullSampleForm, challenge.title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Tantangan Praktik Kelas (LKPD Interaktif)
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                  Untuk Siswa
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih skenario tugas nyata di sekolah / SMK dan rancang prompt RTCL terbaikmu!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {STUDENT_CHALLENGES.map((challenge) => (
              <div
                key={challenge.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300">
                      {challenge.subject}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {challenge.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    <strong>Skenario:</strong> {challenge.scenario}
                  </p>
                  <div className="mt-2 text-xs text-blue-700 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/30 p-2 rounded-lg border border-blue-100 dark:border-blue-900/40">
                    <strong>Tantangan:</strong> {challenge.goal}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => handleStartPractice(challenge)}
                    className="flex-1 py-2 px-3 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Mulai Kerjakan Sendiri</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleLoadSampleSolution(challenge)}
                    className="py-2 px-3 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Lihat contoh jawaban prompt sempurna"
                  >
                    Lihat Contoh
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            💡 Guru dapat meminta siswa memilih salah satu skenario untuk dinilai di kelas.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-800 dark:bg-slate-700 text-white rounded-xl shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
