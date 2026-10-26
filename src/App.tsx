import React, { useState, useEffect, useCallback } from 'react';
import { RTCLForm, OutputFormat, PromptHistoryItem } from './types/rtcl';
import { ClassroomTopic, StudentScoreRecord } from './types/classroom';
import { 
  loadHistory, 
  deleteHistoryItem, 
  clearAllHistory, 
  loadTheme, 
  saveTheme 
} from './utils/storage';
import { loadAllTopics, loadGradebook } from './utils/classroomDb';
import { Header } from './components/Header';
import { Sidebar, MainNavView } from './components/Sidebar';
import { IntroductionSection } from './components/IntroductionSection';
import { IceBreakingSection } from './components/IceBreakingSection';
import { InitialAssessment } from './components/InitialAssessment';
import { SmartboardArena } from './components/SmartboardArena';
import { IndependentLKPD } from './components/IndependentLKPD';
import { GradebookView } from './components/GradebookView';
import { GuideModal } from './components/GuideModal';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { TopicManagerModal } from './components/TopicManagerModal';
import { PromptHistory } from './components/PromptHistory';
import { Toast, ToastMessage } from './components/Toast';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());

  // Active Main Navigation View
  const [activeNav, setActiveNav] = useState<MainNavView>('arena');

  // Sidebar Collapsible States (≡ 3 parallel lines)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Topics and Database Gradebook
  const [topics, setTopics] = useState<ClassroomTopic[]>(() => loadAllTopics());
  const [gradebook, setGradebook] = useState<StudentScoreRecord[]>(() => loadGradebook());

  // History state
  const [history, setHistory] = useState<PromptHistoryItem[]>(() => loadHistory());
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isTopicManagerOpen, setIsTopicManagerOpen] = useState<boolean>(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to root HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addToast = useCallback((title: string, message?: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Handle Score Recording from Arena or LKPD
  const handleScoreRecordSuccess = (newRecord: StudentScoreRecord) => {
    setGradebook((prev) => {
      // Avoid duplicate if already updated by storage
      if (prev.some((r) => r.id === newRecord.id)) return prev;
      return [newRecord, ...prev];
    });
    addToast(
      'Nilai Berhasil Direkam',
      `Nilai ${newRecord.studentName} (${newRecord.auditScore.totalScore}/100) tersimpan di database kelas.`,
      'success'
    );
  };

  // Handle Delete History Item
  const handleDeleteHistory = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistory(updated);
    addToast('Item Dihapus', 'Riwayat prompt berhasil dihapus.', 'info');
  };

  // Handle Clear All History
  const handleClearHistory = () => {
    clearAllHistory();
    setHistory([]);
    addToast('Riwayat Dibersihkan', 'Seluruh riwayat prompt telah dihapus.', 'info');
  };

  // Toggle Sidebar collapse (for desktop & mobile)
  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors selection:bg-blue-500 selection:text-white">
      {/* 1. COLLAPSIBLE SIDEBAR WITH 3 PARALLEL LINES TOGGLE */}
      <Sidebar
        activeView={activeNav}
        onSelectView={setActiveNav}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        gradebookCount={gradebook.length}
      />

      {/* 2. MAIN APPLICATION CONTENT WRAPPER */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Top Navbar Header */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenDocs={() => setIsDocsOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onToggleSidebar={handleToggleSidebar}
          activeView={activeNav}
          onSelectView={setActiveNav}
          gradebookCount={gradebook.length}
          historyCount={history.length}
        />

        {/* Dynamic View Body Container */}
        <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-6">
          {/* MENU 1: PENDAHULUAN (CP, ELEMEN, TP, ATP, MATERI ESENSIAL) */}
          {activeNav === 'pendahuluan' && (
            <IntroductionSection
              onStartAssessment={() => setActiveNav('asesmen-awal')}
              onGoToArena={() => setActiveNav('arena')}
              onGoToLKPD={() => setActiveNav('lkpd')}
              onGoToIceBreaking={() => setActiveNav('ice-breaking')}
            />
          )}

          {/* MENU 2: ICE BREAKING (GAMES PEMANASAN KELAS & RODA UNDIAN IFP) */}
          {activeNav === 'ice-breaking' && (
            <IceBreakingSection
              onGoToArena={() => setActiveNav('arena')}
              onGoToLKPD={() => setActiveNav('lkpd')}
            />
          )}

          {/* MENU 3: ASESMEN AWAL (DIAGNOSTIK KESIAPAN PROMPT ENGINEERING) */}
          {activeNav === 'asesmen-awal' && (
            <InitialAssessment
              onFinishGoToArena={() => setActiveNav('arena')}
              onFinishGoToLKPD={() => setActiveNav('lkpd')}
            />
          )}

          {/* MENU 3: ARENA PAPAN TULIS INTERAKTIF (LOMBA RTCL) */}
          {activeNav === 'arena' && (
            <SmartboardArena
              topics={topics}
              onOpenTopicManager={() => setIsTopicManagerOpen(true)}
              onOpenGradebook={() => setActiveNav('rekap-nilai')}
              onRecordSuccess={handleScoreRecordSuccess}
              defaultClassName="X APHPi 1"
            />
          )}

          {/* MENU 4: LKPD MANDIRI (LEMBAR KERJA SISWA DENGAN UJI AI) */}
          {activeNav === 'lkpd' && (
            <IndependentLKPD
              topics={topics}
              onRecordSuccess={handleScoreRecordSuccess}
              onOpenGradebook={() => setActiveNav('rekap-nilai')}
              onNotice={addToast}
            />
          )}

          {/* MENU 5: REKAP NILAI (DATABASE NILAI & EKSPOR CSV) */}
          {activeNav === 'rekap-nilai' && (
            <GradebookView
              records={gradebook}
              onRefreshRecords={setGradebook}
              onNotice={addToast}
              onGoToArena={() => setActiveNav('arena')}
              onGoToLKPD={() => setActiveNav('lkpd')}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-5 transition-colors">
          <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800 dark:text-slate-200">
                RTCL Prompt Generator
              </span>
              <span>•</span>
              <span>SMK Negeri 1 Sidayu</span>
              <span>•</span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                APHPi • TKJ • TKR • TITL
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Panduan RTCL
              </button>
              <button
                onClick={() => setIsTopicManagerOpen(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Bank Topik
              </button>
              <button
                onClick={() => setIsDocsOpen(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Struktur &amp; Instalasi
              </button>
              <span>v2.0 (Edisi LKPD &amp; Papan Tulis)</span>
            </div>
          </div>
        </footer>
      </div>

      {/* History Slide-over Drawer */}
      <PromptHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={(item) => {
          setActiveNav('lkpd');
          setIsHistoryOpen(false);
          addToast('Riwayat Dimuat', 'Data prompt dimuat ke lembar kerja.', 'info');
        }}
        onDeleteItem={handleDeleteHistory}
        onClearAll={handleClearHistory}
        onCopyText={(text) => {
          navigator.clipboard.writeText(text);
          addToast('Prompt Disalin', 'Teks berhasil disalin ke clipboard.', 'success');
        }}
      />

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Project Structure & Installation Docs Modal */}
      <ProjectDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
        onCopyNotice={() => addToast('Perintah Disalin', 'Teks telah disalin ke clipboard.', 'info')}
      />

      {/* Topic Manager Modal (Bank Topik & Tambah Topik Guru) */}
      <TopicManagerModal
        isOpen={isTopicManagerOpen}
        onClose={() => setIsTopicManagerOpen(false)}
        topics={topics}
        onRefreshTopics={setTopics}
        onSelectTopicToArena={(chosenTopic) => {
          addToast('Topik Dipasang', `Topik "${chosenTopic.title}" dipasang ke Papan Tulis Interaktif.`, 'success');
          setActiveNav('arena');
        }}
        onNotice={(title, msg) => addToast(title, msg, 'info')}
      />

      {/* Dynamic Toast System */}
      <Toast
        toasts={toasts}
        onDismiss={dismissToast}
      />
    </div>
  );
}
