import { useState, useEffect, useCallback, useMemo } from 'react';
import { RTCLForm, OutputFormat, RTCLTemplate, PromptHistoryItem, StudentProfile } from './types/rtcl';
import { ClassroomTopic, StudentScoreRecord } from './types/classroom';
import { RTCL_TEMPLATES } from './data/templates';
import { formatRTCLPrompt } from './utils/formatters';
import { 
  loadHistory, 
  saveHistoryItem, 
  deleteHistoryItem, 
  clearAllHistory, 
  loadTheme, 
  saveTheme,
  loadStudentProfile,
  saveStudentProfile
} from './utils/storage';
import { loadAllTopics, loadGradebook } from './utils/classroomDb';
import { evaluateRTCLPrompt } from './utils/evaluator';
import { Header } from './components/Header';
import { ClassroomBanner } from './components/ClassroomBanner';
import { StudentAuditCard } from './components/StudentAuditCard';
import { StudentChallengesModal } from './components/StudentChallengesModal';
import { SmartboardArena } from './components/SmartboardArena';
import { GradebookModal } from './components/GradebookModal';
import { TopicManagerModal } from './components/TopicManagerModal';
import { TemplateSelector } from './components/TemplateSelector';
import { RTCLFormComponent } from './components/RTCLForm';
import { PromptOutput } from './components/PromptOutput';
import { PromptHistory } from './components/PromptHistory';
import { GuideModal } from './components/GuideModal';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { Toast, ToastMessage } from './components/Toast';
import { Sparkles, CheckCircle2, SlidersHorizontal, Eye, Award, Trophy, Layers } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());

  // Active Main View: 'smartboard' | 'editor'
  const [activeView, setActiveView] = useState<'smartboard' | 'editor'>('smartboard');

  // Topics and Database Gradebook
  const [topics, setTopics] = useState<ClassroomTopic[]>(() => loadAllTopics());
  const [gradebook, setGradebook] = useState<StudentScoreRecord[]>(() => loadGradebook());

  // Student Profile & Classroom Mode state
  const [isStudentMode, setIsStudentMode] = useState<boolean>(true);
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => loadStudentProfile());
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);
  const [isGradebookOpen, setIsGradebookOpen] = useState(false);
  const [isTopicManagerOpen, setIsTopicManagerOpen] = useState(false);

  // Form State
  const [form, setForm] = useState<RTCLForm>(() => {
    // Default initial template: Modul Ajar Berdiferensiasi
    return RTCL_TEMPLATES[0].data;
  });

  const [activeTemplateId, setActiveTemplateId] = useState<string>(RTCL_TEMPLATES[0].id);
  const [activeCategoryTag, setActiveCategoryTag] = useState<string>(RTCL_TEMPLATES[0].category);
  const [format, setFormat] = useState<OutputFormat>('standard_id');

  // History state
  const [history, setHistory] = useState<PromptHistoryItem[]>(() => loadHistory());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Mobile active tab: 'form' | 'output'
  const [mobileTab, setMobileTab] = useState<'form' | 'output'>('form');

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

  // Real-time evaluation of RTCL completeness
  const auditScore = useMemo(() => evaluateRTCLPrompt(form), [form]);

  // Handle saving student profile
  const handleUpdateStudentProfile = (updated: StudentProfile) => {
    setStudentProfile(updated);
    saveStudentProfile(updated);
    addToast('Identitas Disimpan', `Profil siswa ${updated.name || ''} telah diperbarui.`, 'success');
  };

  // Handle starting a classroom challenge
  const handleSelectChallenge = (challengeForm: RTCLForm, challengeTitle: string) => {
    setForm(challengeForm);
    setActiveTemplateId('');
    setActiveCategoryTag('Tugas Siswa');
    addToast('Tantangan Dimuat', `Tugas "${challengeTitle}" siap dikerjakan. Silakan lengkapi parameter RTCL!`, 'info');
    setMobileTab('form');
  };

  // Handle template selection
  const handleSelectTemplate = (template: RTCLTemplate) => {
    setForm(template.data);
    setActiveTemplateId(template.id);
    setActiveCategoryTag(template.category);
    addToast('Template Diterapkan', `Template "${template.title}" berhasil dimuat.`, 'info');

    // On mobile, switch to form view so user can review/edit
    setMobileTab('form');
  };

  // Handle Generate action
  const handleGenerate = () => {
    const preview = formatRTCLPrompt(form, format);
    const updatedHistory = saveHistoryItem(form, format, preview, activeCategoryTag);
    setHistory(updatedHistory);
    addToast('Prompt Berhasil Digenerate', 'Prompt telah diperbarui dan otomatis disimpan ke riwayat.', 'success');

    // On mobile, auto-switch to output view
    setMobileTab('output');
  };

  // Handle Reset action
  const handleReset = () => {
    if (window.confirm('Kosongkan semua isian form RTCL?')) {
      setForm({
        role: '',
        task: '',
        context: '',
        limitations: ''
      });
      setActiveTemplateId('');
      setActiveCategoryTag('');
      addToast('Form Direset', 'Semua kolom input telah dikosongkan.', 'info');
    }
  };

  // Handle Copy action
  const handleCopy = (content: string) => {
    // Save to history on copy as well if valid
    if (form.role.trim() && form.task.trim()) {
      const updatedHistory = saveHistoryItem(form, format, content, activeCategoryTag);
      setHistory(updatedHistory);
    }
    addToast('Prompt Berhasil Disalin', 'Prompt telah disalin ke papan klip (clipboard). Siap ditempel ke AI!', 'success');
  };

  // Handle Load from History
  const handleLoadHistory = (item: PromptHistoryItem) => {
    setForm(item.data);
    setFormat(item.format);
    if (item.categoryTag) {
      setActiveCategoryTag(item.categoryTag);
    }
    setActiveTemplateId('');
    addToast('Riwayat Dimuat', 'Data prompt dari riwayat berhasil dimuat ke editor.', 'info');
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-500 selection:text-white">
      {/* App Header with Arena and Gradebook triggers */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenChallenges={() => setIsChallengesOpen(true)}
        onOpenGradebook={() => setIsGradebookOpen(true)}
        onOpenTopicManager={() => setIsTopicManagerOpen(true)}
        activeView={activeView}
        onToggleView={setActiveView}
        gradebookCount={gradebook.length}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* VIEW 1: ARENA PAPAN TULIS INTERAKTIF (SMARTBOARD BATTLE MODE) */}
        {activeView === 'smartboard' && (
          <section className="space-y-6 animate-in fade-in-50 duration-200">
            <SmartboardArena
              topics={topics}
              onOpenTopicManager={() => setIsTopicManagerOpen(true)}
              onOpenGradebook={() => setIsGradebookOpen(true)}
              onRecordSuccess={(newRecord) => {
                setGradebook((prev) => [newRecord, ...prev]);
                addToast('Skor Tersimpan', `Nilai ${newRecord.studentName} (${newRecord.auditScore.totalScore}/100) tersimpan di database kelas.`, 'success');
              }}
              defaultClassName={studentProfile.className || 'X RPL 1'}
            />

            {/* Quick banner below arena */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Ingin siswa mengerjakan LKPD Mandiri di laptop masing-masing?
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Beralih ke mode <strong>Editor Mandiri / LKPD</strong> untuk mengisi form identitas lengkap, memilih template, dan mengunduh berkas tugas.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveView('editor')}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors shrink-0"
              >
                Buka Editor Mandiri
              </button>
            </div>
          </section>
        )}

        {/* VIEW 2: INDIVIDUAL EDITOR & LKPD WORKFLOW */}
        {activeView === 'editor' && (
          <section className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Interactive Classroom Banner for Students & Teachers */}
            <ClassroomBanner
              isStudentMode={isStudentMode}
              onToggleStudentMode={setIsStudentMode}
              studentProfile={studentProfile}
              onUpdateProfile={handleUpdateStudentProfile}
              onOpenChallenges={() => setIsChallengesOpen(true)}
              auditScore={auditScore}
            />

            {/* Hero Banner / Quick Intro */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 mb-3 border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Media Pembelajaran Prompt Engineering Interaktif</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                  Belajar Menyusun Prompt AI dengan Metode RTCL
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 mt-2 leading-relaxed">
                  Panduan interaktif untuk siswa dalam merumuskan instruksi AI yang akurat, tidak berhalusinasi, dan sesuai konteks belajar dengan formula <strong>Role</strong>, <strong>Task</strong>, <strong>Context</strong>, dan <strong>Limitations</strong>.
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-blue-200">
                  <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Lembar Kerja Interaktif (LKPD)
                  </span>
                  <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-lg">
                    <Award className="w-3.5 h-3.5 text-amber-300" /> Rubrik Penilaian Otomatis (0 - 100)
                  </span>
                  <span className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Siap Cetak & Ekspor Tugas Siswa
                  </span>
                </div>
              </div>

              {/* Decorative ambient background blur */}
              <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            </div>

            {/* Real-time Student Evaluation Rubric Card */}
            <StudentAuditCard audit={auditScore} />

            {/* 1. Templates Ready to Use */}
            <section aria-label="Template Siap Pakai">
              <TemplateSelector
                onSelectTemplate={handleSelectTemplate}
                activeTemplateId={activeTemplateId}
              />
            </section>

            {/* Mobile View Toggle Buttons */}
            <div className="lg:hidden flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setMobileTab('form')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mobileTab === 'form'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>1. Form Input RTCL</span>
              </button>
              <button
                onClick={() => setMobileTab('output')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  mobileTab === 'output'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>2. Hasil Prompt RTCL</span>
              </button>
            </div>

            {/* Main 2-Column Section (Form + Live Output) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: RTCL Form */}
              <div className={`lg:col-span-7 ${mobileTab === 'form' ? 'block' : 'hidden lg:block'}`}>
                <RTCLFormComponent
                  form={form}
                  onChange={(updated) => setForm(updated)}
                  onGenerate={handleGenerate}
                  onReset={handleReset}
                />
              </div>

              {/* Right Column: Prompt Output & Actions */}
              <div className={`lg:col-span-5 lg:sticky lg:top-20 ${mobileTab === 'output' ? 'block' : 'hidden lg:block'}`}>
                <PromptOutput
                  form={form}
                  format={format}
                  onFormatChange={setFormat}
                  onCopy={handleCopy}
                  studentProfile={studentProfile}
                  auditScore={auditScore}
                  isStudentMode={isStudentMode}
                />
              </div>
            </section>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              RTCL Prompt Generator
            </span>
            <span>•</span>
            <span>Dirancang untuk Siswa & Tenaga Pendidik SMKN 1 Sidayu</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsChallengesOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Tantangan Siswa
            </button>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Panduan RTCL
            </button>
            <button
              onClick={() => setIsDocsOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Struktur & Instalasi
            </button>
            <span>v1.2.0 (Edisi Belajar Kelas)</span>
          </div>
        </div>
      </footer>

      {/* History Slide-over Drawer */}
      <PromptHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={handleLoadHistory}
        onDeleteItem={handleDeleteHistory}
        onClearAll={handleClearHistory}
        onCopyText={handleCopy}
      />

      {/* Student Challenges Modal */}
      <StudentChallengesModal
        isOpen={isChallengesOpen}
        onClose={() => setIsChallengesOpen(false)}
        onSelectChallenge={handleSelectChallenge}
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

      {/* Gradebook Leaderboard Modal (Database Rekap Nilai Siswa) */}
      <GradebookModal
        isOpen={isGradebookOpen}
        onClose={() => setIsGradebookOpen(false)}
        records={gradebook}
        onRefreshRecords={setGradebook}
        onNotice={(title, msg) => addToast(title, msg, 'info')}
      />

      {/* Topic Manager Modal (Bank Topik & Tambah Topik Guru) */}
      <TopicManagerModal
        isOpen={isTopicManagerOpen}
        onClose={() => setIsTopicManagerOpen(false)}
        topics={topics}
        onRefreshTopics={setTopics}
        onSelectTopicToArena={(chosenTopic) => {
          addToast('Topik Dipasang', `Topik "${chosenTopic.title}" dipasang ke Papan Tulis Interaktif.`, 'success');
          setActiveView('smartboard');
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
