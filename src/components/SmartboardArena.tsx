import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Play, 
  Pause, 
  RotateCcw, 
  Shuffle, 
  PlusCircle, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Clock, 
  Users, 
  User, 
  ChevronRight, 
  Zap, 
  FileSpreadsheet,
  AlertTriangle,
  Lightbulb,
  Layers,
  Bot,
  Copy,
  Eye,
  Check
} from 'lucide-react';
import { ClassroomTopic, StudentScoreRecord, JurusanSMK } from '../types/classroom';
import { SMK_CLASSES, getJurusanFromClass } from '../data/classrooms';
import { RTCLForm, RTCLAuditScore } from '../types/rtcl';
import { evaluateRTCLPrompt } from '../utils/evaluator';
import { recordStudentScore } from '../utils/classroomDb';
import { executeRTCLPromptWithAI, AIExecutionResult } from '../utils/aiGenerator';
import { formatRTCLPrompt } from '../utils/formatters';

interface SmartboardArenaProps {
  topics: ClassroomTopic[];
  onOpenTopicManager: () => void;
  onOpenGradebook: () => void;
  onRecordSuccess: (record: StudentScoreRecord) => void;
  defaultClassName?: string;
}

export function SmartboardArena({
  topics,
  onOpenTopicManager,
  onOpenGradebook,
  onRecordSuccess,
  defaultClassName = 'X APHPi 1'
}: SmartboardArenaProps) {
  // Current active Jurusan and topic
  const [selectedJurusan, setSelectedJurusan] = useState<JurusanSMK>('APHPi');
  const [currentTopic, setCurrentTopic] = useState<ClassroomTopic>(() => {
    return topics.find(t => t.jurusan === 'APHPi') || topics[0] || null;
  });

  // Student, Team & Members state
  const [studentName, setStudentName] = useState<string>(''); // Ketua kelompok
  const [teamMembers, setTeamMembers] = useState<string>(''); // Anggota kelompok
  const [teamName, setTeamName] = useState<string>('Kelompok 1');
  const [className, setClassName] = useState<string>(defaultClassName);

  const handleClassChange = (newClass: string) => {
    setClassName(newClass);
    const detectedJurusan = getJurusanFromClass(newClass);
    setSelectedJurusan(detectedJurusan);
    const matchingTopic = topics.find(t => t.jurusan === detectedJurusan);
    if (matchingTopic) {
      setCurrentTopic(matchingTopic);
      setForm(prev => ({
        ...prev,
        context: matchingTopic.description
      }));
    }
  };

  // Running Stopwatch States (Waktu Berjalan)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [recordedDuration, setRecordedDuration] = useState<number | null>(null);
  const [accumulatedSpeedBonus, setAccumulatedSpeedBonus] = useState<number>(0);
  const [finalScoreRecorded, setFinalScoreRecorded] = useState<number>(0);

  // Form State on Smartboard
  const [form, setForm] = useState<RTCLForm>({
    role: '',
    task: '',
    context: '',
    limitations: ''
  });

  // AI Generative Execution State
  const [isExecutingAI, setIsExecutingAI] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIExecutionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'ai-result'>('editor');

  // Submitted victory state
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);
  const [submittedScore, setSubmittedScore] = useState<RTCLAuditScore | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Live evaluation of RTCL
  const auditScore = evaluateRTCLPrompt(form);

  // Calculate speed efficiency bonus based on elapsed time and prompt quality
  const calculateSpeedBonus = (seconds: number, rtclQuality: number): number => {
    if (rtclQuality < 50) return 0; // Kualitas dasar RTCL harus minimal cukup
    if (seconds <= 60) return 10;   // Sangat Cepat (<= 1 menit): +10 Poin Bonus
    if (seconds <= 120) return 5;   // Efisien (1 - 2 menit): +5 Poin Bonus
    if (seconds <= 180) return 2;   // Standar (2 - 3 menit): +2 Poin Bonus
    return 0;                       // > 3 menit: tanpa bonus waktu
  };

  // Stopwatch interval effect (waktu berjalan maju)
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Handle Pick Random Topic
  const handlePickRandomTopic = (jurusan?: JurusanSMK) => {
    const targetJurusan = jurusan || selectedJurusan;
    const pool = topics.filter(t => t.jurusan === targetJurusan);
    const candidateList = pool.length > 0 ? pool : topics;
    if (candidateList.length === 0) return;

    const randomIndex = Math.floor(Math.random() * candidateList.length);
    const chosen = candidateList[randomIndex];
    setCurrentTopic(chosen);
    setSelectedJurusan(chosen.jurusan);
    setForm(prev => ({
      ...prev,
      context: chosen.description
    }));
  };

  const handleSelectJurusanPill = (j: JurusanSMK) => {
    setSelectedJurusan(j);
    const found = topics.find(t => t.jurusan === j);
    if (found) {
      setCurrentTopic(found);
      setForm(prev => ({
        ...prev,
        context: found.description
      }));
    }
  };

  // Timer controls (Stopwatch Waktu Berjalan)
  const handleStartTimer = () => setIsTimerRunning(true);
  const handlePauseTimer = () => setIsTimerRunning(false);
  const handleResetTimer = () => {
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setRecordedDuration(null);
    setAccumulatedSpeedBonus(0);
    setFinalScoreRecorded(0);
  };

  // Execute AI Generative Simulation for students
  const handleExecuteAI = async () => {
    if (!form.role.trim() && !form.task.trim()) {
      alert('Tuliskan minimal Role (Peran) dan Task (Tugas) sebelum menguji ke AI!');
      return;
    }
    setIsExecutingAI(true);
    setActiveTab('ai-result');
    try {
      const result = await executeRTCLPromptWithAI(form);
      setAiResult(result);
    } catch (err) {
      console.error('Error generating AI result:', err);
    } finally {
      setIsExecutingAI(false);
    }
  };

  // Submit and save to database (Auto-stop timer & akumulasi skor)
  const handleSubmitScore = () => {
    if (!studentName.trim() && !teamName.trim()) {
      alert('Silakan tuliskan Nama Ketua Kelompok atau Nama Tim yang sedang tampil di papan tulis!');
      return;
    }

    // 1. AUTO BERHENTI: Stopwatch otomatis berhenti saat tombol Kirim & Rekap ditekan
    setIsTimerRunning(false);

    const finalDuration = elapsedSeconds;
    setRecordedDuration(finalDuration);

    const evaluation = evaluateRTCLPrompt(form);
    const displayName = studentName.trim() || teamName;
    const compiled = formatRTCLPrompt(form, 'standard_id');
    const aiText = aiResult?.content || 'Prompt siap dieksekusi ke model AI.';

    // 2. AKUMULASI NILAI DENGAN BONUS KECEPATAN WAKTU
    const speedBonus = calculateSpeedBonus(finalDuration, evaluation.totalScore);
    setAccumulatedSpeedBonus(speedBonus);

    const finalScore = Math.min(100, evaluation.totalScore + speedBonus);
    setFinalScoreRecorded(finalScore);

    const minutes = Math.floor(finalDuration / 60);
    const seconds = finalDuration % 60;
    const durationLabel = `${minutes > 0 ? `${minutes}m ` : ''}${seconds} detik`;
    const teacherNote = `Waktu pengerjaan: ${durationLabel}. Bonus kecepatan: +${speedBonus} poin. Total akumulasi skor: ${finalScore}/100.`;

    const records = recordStudentScore(
      displayName,
      className,
      selectedJurusan,
      teamName,
      currentTopic ? currentTopic.title : `Tantangan ${selectedJurusan}`,
      form,
      evaluation,
      finalDuration,
      teamMembers,
      teacherNote,
      compiled,
      aiText,
      speedBonus
    );

    const latest = records[0];
    onRecordSuccess(latest);
    setSubmittedScore(evaluation);
    setJustSubmitted(true);
  };

  // Reset board for next student
  const handleNextStudent = () => {
    setForm({
      role: '',
      task: '',
      context: currentTopic ? currentTopic.description : '',
      limitations: ''
    });
    setStudentName('');
    setTeamMembers('');
    setJustSubmitted(false);
    setSubmittedScore(null);
    setAiResult(null);
    setActiveTab('editor');
    setRecordedDuration(null);
    setAccumulatedSpeedBonus(0);
    setFinalScoreRecorded(0);
    handleResetTimer();
  };

  const handleCopyPrompt = () => {
    const text = formatRTCLPrompt(form, 'standard_id');
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/30 rounded-3xl p-4 sm:p-7 shadow-xl space-y-6">
      {/* Top Bar: Arena Header & Topic Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
              <Trophy className="w-6 h-6 animate-bounce" />
            </span>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                Arena Papan Tulis Interaktif
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  Lomba RTCL
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Papan Tulis Digital (IFP) untuk kompetisi kelompok menyusun prompt AI profesional
              </p>
            </div>
          </div>
        </div>

        {/* Global Classroom Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handlePickRandomTopic()}
            className="px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
            title="Pilih Topik Secara Acak dari Bank Soal"
          >
            <Shuffle className="w-4 h-4" />
            <span>Acak Topik</span>
          </button>

          <button
            onClick={onOpenTopicManager}
            className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-500" />
            <span>Bank Topik</span>
          </button>

          <button
            onClick={onOpenGradebook}
            className="px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Rekap Nilai Siswa</span>
          </button>
        </div>
      </div>

      {/* TOPIC BANNER & JURUSAN SELECTOR */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 dark:from-slate-800/80 dark:to-slate-900 border border-blue-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-blue-700 dark:text-blue-300 flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-500" /> Topik Tantangan Aktif:
            </span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
              {currentTopic?.jurusan || selectedJurusan}
            </span>
          </div>

          {/* Quick Jurusan Switcher Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['APHPi', 'TKJ', 'TKR', 'TITL'] as JurusanSMK[]).map((j) => (
              <button
                key={j}
                onClick={() => handleSelectJurusanPill(j)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedJurusan === j
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white'
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        {/* Challenge Title & Context Box */}
        {currentTopic && (
          <div className="space-y-1.5 bg-white/80 dark:bg-slate-850 p-4 rounded-xl border border-blue-100 dark:border-slate-700">
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
              {currentTopic.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              <strong>Skenario Kasus:</strong> {currentTopic.description}
            </p>
            <div className="text-xs font-bold text-blue-700 dark:text-blue-300 pt-1 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Target Prompt: {currentTopic.challengeGoal}</span>
            </div>
          </div>
        )}
      </div>

      {/* STUDENT IDENTITY & COUNTDOWN TIMER BAR */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Identitas Ketua & Anggota Kelompok */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          {/* 1. Nama Ketua (Tampil di Layar) */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-500" />
              <span>Ketua Kelompok (Tampil):</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nama Ketua / Penampil..."
              className="w-full px-3 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 2. Anggota Kelompok */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>Anggota Kelompok:</span>
            </label>
            <input
              type="text"
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              placeholder="Nama 3-4 anggota regu..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 3. Kelas (11 SMK Classes Dropdown) */}
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Pilih Kelas (11 Kelas):</span>
            </label>
            <select
              value={className}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-extrabold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SMK_CLASSES.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stopwatch Waktu Berjalan Controls (Auto-Stop saat Kirim & Rekap) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 self-center lg:self-auto shrink-0">
          <div className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-2xl font-mono text-2xl sm:text-3xl font-black flex items-center gap-2 border-2 transition-all ${
              isTimerRunning
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                : recordedDuration !== null
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-500'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
            }`}>
              <Clock className={`w-6 h-6 shrink-0 ${isTimerRunning ? 'animate-spin text-emerald-500' : 'text-slate-400'}`} style={{ animationDuration: '4s' }} />
              <span>
                {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
                {String(elapsedSeconds % 60).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {!isTimerRunning ? (
                <button
                  onClick={handleStartTimer}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
                  title="Lanjutkan Stopwatch"
                >
                  <Play className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition-colors"
                  title="Jeda Stopwatch"
                >
                  <Pause className="w-5 h-5 fill-current" />
                </button>
              )}

              <button
                onClick={handleResetTimer}
                className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                title="Reset Waktu ke 00:00"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Time & Speed Bonus Status Tag */}
          <div className="text-[11px] font-bold text-center sm:text-left">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${
              isTimerRunning 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                : recordedDuration !== null
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isTimerRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
              {isTimerRunning ? 'Waktu Berjalan (Auto-Stop saat Kirim)' : recordedDuration !== null ? `Tercatat: ${Math.floor(recordedDuration / 60)}m ${recordedDuration % 60}s` : 'Stopwatch Siaga'}
            </span>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Bonus Kecepatan: {elapsedSeconds <= 60 ? '⚡ +10 Poin (Kilat)' : elapsedSeconds <= 120 ? '🔥 +5 Poin (Cepat)' : elapsedSeconds <= 180 ? '⏱️ +2 Poin' : '0 Poin (Standar)'}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW TABS: FORM RTCL vs HASIL GENERATIF AI */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'editor'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Form Input RTCL</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-result')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'ai-result'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>⚡ Hasil Generatif AI</span>
            {aiResult && (
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            )}
          </button>
        </div>

        {/* Quick Action: Uji Prompt ke AI */}
        <button
          onClick={handleExecuteAI}
          disabled={isExecutingAI}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
        >
          {isExecutingAI ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>Memproses AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Uji Jalankan ke AI</span>
            </>
          )}
        </button>
      </div>

      {/* TAB 1: SMARTBOARD 4 LARGE RTCL BOXES */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in-50">
          {/* 1. ROLE (R) */}
          <div className="p-4 rounded-2xl border-2 border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-blue-950 dark:text-blue-300 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black">
                  R
                </span>
                <span>1. Peran AI (Role)</span>
              </label>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                auditScore.roleScore >= 20 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {auditScore.roleScore} / 25 Poin
              </span>
            </div>
            <textarea
              rows={2}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Tulis peran & keahlian spesifik AI (misal: 'Ahli Jaringan Komputer Senior bersertifikasi MikroTik MTCNA')..."
              className="w-full p-3 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 2. TASK (T) */}
          <div className="p-4 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-indigo-950 dark:text-indigo-300 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                  T
                </span>
                <span>2. Tugas Utama (Task)</span>
              </label>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                auditScore.taskScore >= 20 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {auditScore.taskScore} / 25 Poin
              </span>
            </div>
            <textarea
              rows={2}
              value={form.task}
              onChange={(e) => setForm({ ...form, task: e.target.value })}
              placeholder="Tulis kata kerja operasional & hasil kerja (misal: 'Rancang skema IP Address, subnetting, dan aturan firewall VLAN')..."
              className="w-full p-3 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 3. CONTEXT (C) */}
          <div className="p-4 rounded-2xl border-2 border-teal-200 dark:border-teal-900/60 bg-teal-50/30 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-teal-950 dark:text-teal-300 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-black">
                  C
                </span>
                <span>3. Konteks Masalah (Context)</span>
              </label>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                auditScore.contextScore >= 20 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {auditScore.contextScore} / 25 Poin
              </span>
            </div>
            <textarea
              rows={2}
              value={form.context}
              onChange={(e) => setForm({ ...form, context: e.target.value })}
              placeholder="Tulis informasi latar belakang, situasi sekolah/industri, atau perangkat yang digunakan..."
              className="w-full p-3 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* 4. LIMITATIONS (L) */}
          <div className="p-4 rounded-2xl border-2 border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-extrabold text-amber-950 dark:text-amber-300 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-black">
                  L
                </span>
                <span>4. Batasan & Format (Limitations)</span>
              </label>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                auditScore.limitationsScore >= 20 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {auditScore.limitationsScore} / 25 Poin
              </span>
            </div>
            <textarea
              rows={2}
              value={form.limitations}
              onChange={(e) => setForm({ ...form, limitations: e.target.value })}
              placeholder="Tulis aturan format output (misal: 'Format tabel Markdown, bahasa baku, maksimal 300 kata, sertakan perintah CLI')..."
              className="w-full p-3 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}

      {/* TAB 2: HASIL GENERATIF AI (REAL TIME SIMULATOR & PROMPT RUNNER) */}
      {activeTab === 'ai-result' && (
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-100 border-2 border-emerald-500/50 shadow-xl space-y-4 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  Hasil Luaran Generatif AI
                  {aiResult && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                      {aiResult.model} • {aiResult.executionTimeMs}ms
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400">
                  Respon kecerdasan artifisial berdasarkan susunan prompt RTCL murid
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Tersalin' : 'Salin Prompt'}</span>
              </button>

              <button
                onClick={handleExecuteAI}
                disabled={isExecutingAI}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Eksekusi Ulang</span>
              </button>
            </div>
          </div>

          {/* Compliance Checklist Banner */}
          {aiResult && (
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  aiResult.evaluatedCompliance.followedRole ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> Role Dipatuhi
                </span>
                <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  aiResult.evaluatedCompliance.followedTask ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> Task Jelas
                </span>
                <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  aiResult.evaluatedCompliance.followedContext ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/60 text-amber-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> Konteks Relevan
                </span>
                <span className={`px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  aiResult.evaluatedCompliance.followedLimitations ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> Batasan Format
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {aiResult.evaluatedCompliance.summaryNotes}
              </p>
            </div>
          )}

          {/* AI Result Content Box */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 min-h-60 max-h-96 overflow-y-auto text-xs sm:text-sm leading-relaxed font-mono whitespace-pre-wrap selection:bg-blue-600">
            {isExecutingAI ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
                <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
                <p className="text-xs font-semibold">Menghasilkan luaran AI sesuai kaidah RTCL...</p>
              </div>
            ) : aiResult ? (
              aiResult.content
            ) : (
              <div className="py-10 text-center text-slate-500 space-y-2">
                <Bot className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-xs">
                  Belum ada hasil generatif. Klik tombol <strong>"Uji Jalankan ke AI"</strong> untuk melihat bagaimana AI menjawab prompt ini!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCOREBOARD SUMMARY & SUBMIT BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl">
        {/* Big Live Score & Accumulated Status */}
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black border-2 shadow-inner ${
            auditScore.totalScore >= 85
              ? 'bg-emerald-600 border-emerald-400 text-white'
              : auditScore.totalScore >= 70
              ? 'bg-blue-600 border-blue-400 text-white'
              : auditScore.totalScore >= 50
              ? 'bg-amber-600 border-amber-400 text-white'
              : 'bg-rose-600 border-rose-400 text-white'
          }`}>
            <span className="text-2xl leading-none">{auditScore.totalScore}</span>
            <span className="text-[10px] uppercase font-bold text-white/80">/ 100</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-bold">
                Predikat: <span className="text-amber-400">{auditScore.grade}</span>
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-bold">
                Waktu: {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:{String(elapsedSeconds % 60).padStart(2, '0')}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {auditScore.totalScore >= 85
                ? '⭐ Kualitas Sangat Baik! Klik Kirim & Rekap untuk mengunci waktu dan akumulasi nilai.'
                : 'Lengkapi kriteria R, T, C, L di atas untuk memaksimalkan akumulasi skor ke level Master.'}
            </p>
          </div>
        </div>

        {/* Action Submit */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSubmitScore}
            className="px-6 py-3.5 text-sm sm:text-base font-black rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Kirim &amp; Rekap Nilai</span>
          </button>

          <button
            onClick={handleNextStudent}
            className="px-4 py-3.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            title="Bersihkan papan dan mulai stopwatch untuk giliran regu berikutnya"
          >
            <span>Giliran Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Submission Success Banner (Menampilkan Waktu Tercatat & Akumulasi Skor) */}
      {justSubmitted && submittedScore && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/80 dark:to-teal-950/80 border-2 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-md">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase text-emerald-700 dark:text-emerald-300 tracking-wider block">
                  Nilai Berhasil Direkam &amp; Stopwatch Otomatis Berhenti!
                </span>
                <h4 className="text-base sm:text-lg font-black">
                  {studentName || teamName} ({className})
                </h4>
              </div>
            </div>

            <button
              onClick={onOpenGradebook}
              className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors shrink-0"
            >
              Buka Rekapitulasi Nilai
            </button>
          </div>

          {/* Breakdown: Durasi, Kualitas RTCL, Bonus Kecepatan, Total Akumulasi */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                ⏱️ Waktu Tercatat:
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                {recordedDuration !== null ? `${Math.floor(recordedDuration / 60)}m ${recordedDuration % 60}s` : '-'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                ⭐ Skor Dasar RTCL:
              </span>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400">
                {submittedScore.totalScore} / 100
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                ⚡ Bonus Kecepatan:
              </span>
              <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                +{accumulatedSpeedBonus} Poin
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md">
              <span className="text-[10px] font-bold text-emerald-100 block">
                🏆 Total Akumulasi:
              </span>
              <span className="text-lg font-black leading-tight">
                {finalScoreRecorded} / 100
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
