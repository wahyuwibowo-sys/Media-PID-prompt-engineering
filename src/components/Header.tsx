import React from 'react';
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Sparkles, 
  History, 
  Trophy, 
  FileSpreadsheet, 
  Menu,
  FileEdit,
  HelpCircle
} from 'lucide-react';
import { MainNavView } from './Sidebar';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenGuide: () => void;
  onOpenDocs: () => void;
  onOpenHistory: () => void;
  onToggleSidebar: () => void;
  activeView: MainNavView;
  onSelectView: (view: MainNavView) => void;
  gradebookCount: number;
  historyCount: number;
}

export function Header({
  theme,
  onToggleTheme,
  onOpenGuide,
  onOpenDocs,
  onOpenHistory,
  onToggleSidebar,
  activeView,
  onSelectView,
  gradebookCount,
  historyCount
}: HeaderProps) {
  const getSectionTitle = () => {
    switch (activeView) {
      case 'pendahuluan':
        return 'Pendahuluan & Konsep RTCL';
      case 'ice-breaking':
        return 'Ice Breaking & Game Pemanasan AI';
      case 'asesmen-awal':
        return 'Asesmen Awal';
      case 'arena':
        return 'Arena Papan Tulis (Lomba RTCL)';
      case 'lkpd':
        return 'LKPD Mandiri 4 Jurusan';
      case 'rekap-nilai':
        return 'Rekap Nilai Siswa';
      default:
        return 'RTCL Prompt Generator';
    }
  };

  const getSectionBadge = () => {
    switch (activeView) {
      case 'pendahuluan':
        return { 
          icon: BookOpen, 
          gradient: 'from-blue-600 to-indigo-600', 
          iconColor: 'text-white' 
        };
      case 'ice-breaking':
        return { 
          icon: Sparkles, 
          gradient: 'from-amber-500 to-orange-500', 
          iconColor: 'text-amber-100' 
        };
      case 'asesmen-awal':
        return { 
          icon: HelpCircle, 
          gradient: 'from-purple-600 to-indigo-600', 
          iconColor: 'text-purple-100' 
        };
      case 'arena':
        return { 
          icon: Trophy, 
          gradient: 'from-emerald-600 to-teal-600', 
          iconColor: 'text-emerald-100' 
        };
      case 'lkpd':
        return { 
          icon: FileEdit, 
          gradient: 'from-sky-600 to-blue-600', 
          iconColor: 'text-sky-100' 
        };
      case 'rekap-nilai':
        return { 
          icon: FileSpreadsheet, 
          gradient: 'from-indigo-600 to-violet-600', 
          iconColor: 'text-indigo-100' 
        };
      default:
        return { 
          icon: Sparkles, 
          gradient: 'from-blue-600 to-indigo-600', 
          iconColor: 'text-amber-300' 
        };
    }
  };

  const badge = getSectionBadge();
  const SectionIcon = badge.icon;

  return (
    <header className="sticky top-0 z-30 w-full border-b backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 transition-colors">
      <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: 3-Parallel Lines Hamburger Button + Active Section Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar Menu (Garis 3 Sejajar)"
            title="Buka / Minimkan Menu Navigasi (≡)"
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all shadow-2xs flex items-center justify-center cursor-pointer active:scale-95"
          >
            <Menu className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${badge.gradient} flex items-center justify-center text-white shadow-xs hidden sm:flex shrink-0`}>
              <SectionIcon className={`w-4 h-4 ${badge.iconColor}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {getSectionTitle()}
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                  SMKN 1 Sidayu
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block">
                Media Pembelajaran Prompt Engineering Interaktif
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Switcher for Main Working Modes */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
          <button
            onClick={() => onSelectView('arena')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'arena'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Arena Papan Tulis</span>
          </button>

          <button
            onClick={() => onSelectView('lkpd')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'lkpd'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>LKPD Mandiri</span>
          </button>

          <button
            onClick={() => onSelectView('rekap-nilai')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeView === 'rekap-nilai'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Rekap Nilai</span>
            {gradebookCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-200 dark:bg-indigo-950 text-indigo-950 dark:text-indigo-200">
                {gradebookCount}
              </span>
            )}
          </button>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Guide button */}
          <button
            onClick={onOpenGuide}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            title="Panduan Kaidah RTCL"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Panduan</span>
          </button>

          {/* History drawer trigger button */}
          <button
            onClick={onOpenHistory}
            className="p-2 sm:px-3 sm:py-1.5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            title="Riwayat Prompt Tersimpan"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="text-[11px] text-slate-500">({historyCount})</span>
            )}
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Theme switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105"
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
