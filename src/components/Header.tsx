import { 
  Sun, 
  Moon, 
  BookOpen, 
  Terminal, 
  Sparkles, 
  History, 
  GraduationCap, 
  Trophy, 
  FileSpreadsheet, 
  Layers 
} from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenGuide: () => void;
  onOpenDocs: () => void;
  onOpenHistory: () => void;
  onOpenChallenges: () => void;
  onOpenGradebook: () => void;
  onOpenTopicManager: () => void;
  activeView: 'smartboard' | 'editor';
  onToggleView: (view: 'smartboard' | 'editor') => void;
  gradebookCount: number;
  historyCount: number;
}

export function Header({
  theme,
  onToggleTheme,
  onOpenGuide,
  onOpenDocs,
  onOpenHistory,
  onOpenChallenges,
  onOpenGradebook,
  onOpenTopicManager,
  activeView,
  onToggleView,
  gradebookCount,
  historyCount
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-500/20">
            <Sparkles className="w-5 h-5 text-blue-100 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                RTCL Prompt Generator
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/60">
                Papan Tulis Digital
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Edisi Pembelajaran Siswa &amp; Guru SMKN 1 Sidayu
            </p>
          </div>
        </div>

        {/* Center: Main View Switcher (Arena Papan Tulis vs Editor Individu) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onToggleView('smartboard')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'smartboard'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Papan Tulis (Lomba)</span>
          </button>

          <button
            onClick={() => onToggleView('editor')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'editor'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Editor Mandiri / LKPD</span>
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Gradebook Rekap Nilai Button */}
          <button
            onClick={onOpenGradebook}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 transition-colors"
            title="Buka Database Rekapitulasi Nilai Siswa"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Rekap Nilai</span>
            {gradebookCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-amber-500 text-slate-950">
                {gradebookCount}
              </span>
            )}
          </button>

          {/* RTCL Guide button */}
          <button
            onClick={onOpenGuide}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            title="Pelajari Panduan Metode RTCL"
          >
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Panduan RTCL</span>
          </button>

          {/* History drawer trigger button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Buka Riwayat Prompt"
          >
            <History className="w-4 h-4 text-slate-500" />
            {historyCount > 0 && (
              <span className="hidden sm:inline text-[11px] text-slate-500">
                ({historyCount})
              </span>
            )}
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105"
            aria-label="Ubah tema"
            title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
