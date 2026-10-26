import React from 'react';
import { 
  Menu, 
  X, 
  BookOpen, 
  HelpCircle, 
  Trophy, 
  FileEdit, 
  FileSpreadsheet, 
  Sparkles,
  ChevronRight,
  School,
  ChevronLeft
} from 'lucide-react';

export type MainNavView = 'pendahuluan' | 'ice-breaking' | 'asesmen-awal' | 'arena' | 'lkpd' | 'rekap-nilai';

interface SidebarProps {
  activeView: MainNavView;
  onSelectView: (view: MainNavView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  gradebookCount: number;
}

export function Sidebar({
  activeView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  gradebookCount
}: SidebarProps) {
  const navItems = [
    {
      id: 'pendahuluan' as MainNavView,
      label: 'Pendahuluan',
      sublabel: 'CP, TP, ATP & Materi',
      icon: BookOpen,
      badge: 'Kurikulum',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
    },
    {
      id: 'ice-breaking' as MainNavView,
      label: 'Ice Breaking',
      sublabel: 'Roda Undian & Game AI',
      icon: Sparkles,
      badge: 'Games Seru',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    },
    {
      id: 'asesmen-awal' as MainNavView,
      label: 'Asesmen Awal',
      sublabel: 'Kesiapan Belajar Siswa',
      icon: HelpCircle,
      badge: 'Kuis Kesiapan',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
    },
    {
      id: 'arena' as MainNavView,
      label: 'Arena Papan Tulis',
      sublabel: 'Lomba RTCL di IFP',
      icon: Trophy,
      badge: 'Lomba Kelas',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    },
    {
      id: 'lkpd' as MainNavView,
      label: 'LKPD Mandiri',
      sublabel: 'Lembar Kerja Siswa',
      icon: FileEdit,
      badge: '4 Jurusan',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
    },
    {
      id: 'rekap-nilai' as MainNavView,
      label: 'Rekap Nilai',
      sublabel: 'Database & Ekspor CSV',
      icon: FileSpreadsheet,
      badge: `${gradebookCount} Data`,
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
    }
  ];

  const handleItemClick = (view: MainNavView) => {
    onSelectView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
          // Mobile state
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${
          // Desktop width (collapsed vs expanded)
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        } w-72 shadow-xl lg:shadow-none`}
      >
        {/* Sidebar Header with 3-line hamburger toggle */}
        <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-500/25 shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div className="truncate">
                <h1 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight truncate">
                  RTCL Prompt Edu
                </h1>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  SMKN 1 Sidayu
                </p>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-full flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
            </div>
          )}

          {/* Toggle Button: 3 Parallel Lines (≡) */}
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Perbesar Sidebar" : "Perkecil Sidebar"}
            title={isCollapsed ? "Buka Sidebar (≡)" : "Minimkan Sidebar (≡)"}
            className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Close Button on Mobile */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {!isCollapsed && (
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Menu Pembelajaran
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-medium'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm truncate font-bold leading-snug">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.sublabel}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Info */}
        {!isCollapsed && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="flex items-center gap-2 mb-1">
                <School className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  SMK Negeri 1 Sidayu
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Jurusan: APHPi • TKJ • TKR • TITL
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
