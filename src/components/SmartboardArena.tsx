import { useState, useEffect, useRef } from 'react';
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
  Layers
} from 'lucide-react';
import { ClassroomTopic, StudentScoreRecord, JurusanSMK } from '../types/classroom';
import { SMK_CLASSES, getJurusanFromClass } from '../data/classrooms';
import { RTCLForm, RTCLAuditScore } from '../types/rtcl';
import { evaluateRTCLPrompt } from '../utils/evaluator';
import { recordStudentScore } from '../utils/classroomDb';

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

  // Timer states
  const [timerDuration, setTimerDuration] = useState<number>(90); // default 90 seconds
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Form State on Smartboard
  const [form, setForm] = useState<RTCLForm>({
    role: '',
    task: '',
    context: '',
    limitations: ''
  });

  // Submitted victory state
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);
  const [submittedScore, setSubmittedScore] = useState<RTCLAuditScore | null>(null);

  // Live evaluation of RTCL
  const auditScore = evaluateRTCLPrompt(form);

  // Timer interval effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  // Handle Pick Random Topic (filtered by selected jurusan)
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

  // Timer controls
  const handleStartTimer = () => {
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = (duration: number = timerDuration) => {
    setIsTimerRunning(false);
    setTimerDuration(duration);
    setTimeLeft(duration);
    setTimeSpent(0);
  };

  // Submit and save to database
  const handleSubmitScore = () => {
    if (!studentName.trim() && !teamName.trim()) {
      alert('Silakan tuliskan Nama Siswa atau Nama Tim yang sedang tampil di papan tulis!');
      return;
    }

    const evaluation = evaluateRTCLPrompt(form);
    const displayName = studentName.trim() || teamName;

    const records = recordStudentScore(
      displayName,
      className,
      selectedJurusan,
      teamName,
      currentTopic ? currentTopic.title : `Tantangan ${selectedJurusan}`,
      form,
      evaluation,
      timeSpent,
      teamMembers
    );

    const latest = records[0];
    onRecordSuccess(latest);
    setSubmittedScore(evaluation);
    setJustSubmitted(true);
    setIsTimerRunning(false);
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
    handleResetTimer(timerDuration);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-2 border-blue-500/30 rounded-3xl p-4 sm:p-7 shadow-xl space-y-6">
      {/* Top Bar: Arena Header & Topic Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
              <Trophy className="w-5 h-5 animate-bounce" />
            </span>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                Arena Papan Tulis Interaktif
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  Lomba RTCL
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Layar sentuh papan tulis digital (IFP) untuk kompetisi menyusun prompt terstruktur
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
            <span>Acak Topik Otomatis</span>
          </button>

          <button
            onClick={onOpenTopicManager}
            className="px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-emerald-500" />
            <span>Pilih / Tambah Topik</span>
          </button>

          <button
            onClick={onOpenGradebook}
            className="px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Rekap Skor & Nilai</span>
          </button>
        </div>
      </div>

      {/* JURUSAN SELECTOR TABS (APHPi, TKJ, TKR, TITL, P5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shrink-0">
            <Layers className="w-4 h-4 text-blue-600" />
            Pilih Jurusan:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['APHPi', 'TKJ', 'TKR', 'TITL', 'Umum / P5'] as JurusanSMK[]).map((j) => {
            const isSelected = selectedJurusan === j;
            return (
              <button
                key={j}
                onClick={() => handleSelectJurusanPill(j)}
                className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 ${
                  isSelected
                    ? j === 'APHPi'
                      ? 'bg-teal-600 text-white ring-2 ring-teal-400'
                      : j === 'TKJ'
                      ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                      : j === 'TKR'
                      ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                      : j === 'TITL'
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                      : 'bg-purple-600 text-white ring-2 ring-purple-400'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-650'
                }`}
              >
                <span>{j}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-950 animate-pulse"></span>}
              </button>
            );
          })}

          <button
            onClick={() => handlePickRandomTopic()}
            className="px-2.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors flex items-center gap-1"
            title="Acak Topik Sesuai Jurusan Ini"
          >
            <Shuffle className="w-3 h-3" />
            <span>Acak Topik {selectedJurusan}</span>
          </button>
        </div>
      </div>

      {/* TOPIC BANNER SECTION */}
      {currentTopic && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-sky-500/10 border-2 border-blue-400/40 dark:border-blue-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-600 text-white">
                {currentTopic.category}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Tingkat: {currentTopic.difficulty}
              </span>
            </div>
            <h3 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {currentTopic.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
              <strong>Studi Kasus:</strong> {currentTopic.description}
            </p>
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 pt-1 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span><strong>Misi Siswa:</strong> {currentTopic.challengeGoal}</span>
            </p>
          </div>
        </div>
      )}

      {/* BATTLE CONTROLS: STUDENT/TEAM INPUT & COUNTDOWN TIMER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Participant Name, Members & Class (7 Cols) */}
        <div className="md:col-span-7 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* Ketua Kelompok */}
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Ketua Kelompok (Tampil) *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Nama ketua di papan tulis..."
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            {/* Tim / Regu */}
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Tim / Regu
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Kelompok 1"
                className="w-full px-3 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            {/* Auto Model Select Kelas SMK */}
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Kelas (Pilih Auto) *
              </label>
              <select
                value={className}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-2.5 py-2 text-xs sm:text-sm font-black rounded-xl border-2 border-blue-400 dark:border-blue-700 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
              >
                {SMK_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tempat Anggota Kelompok */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Anggota Kelompok:</span>
              <span className="text-[10px] text-slate-400 font-normal">(Tulis nama anggota, pisahkan koma)</span>
            </label>
            <input
              type="text"
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              placeholder="Contoh: Ahmad, Siti, Dimas, Rian, Wahyu..."
              className="w-full px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Countdown Timer Display (5 Cols) */}
        <div className="md:col-span-5 flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-700">
          {/* Giant Timer Numbers */}
          <div className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-2xl font-mono text-2xl sm:text-3xl font-black flex items-center gap-2 border-2 ${
              timeLeft <= 10 && isTimerRunning
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : timeLeft <= 30
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-400'
                : 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 border-blue-400/50'
            }`}>
              <Clock className="w-6 h-6 shrink-0" />
              <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>

            {/* Timer Action Buttons */}
            <div className="flex items-center gap-1">
              {!isTimerRunning ? (
                <button
                  onClick={handleStartTimer}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
                  title="Mulai Waktu Lomba"
                >
                  <Play className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition-colors"
                  title="Jeda Waktu"
                >
                  <Pause className="w-5 h-5 fill-current" />
                </button>
              )}

              <button
                onClick={() => handleResetTimer(timerDuration)}
                className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                title="Reset Waktu"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preset Duration Buttons */}
          <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => handleResetTimer(60)}
              className={`px-2 py-1 rounded-lg ${timerDuration === 60 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              60s
            </button>
            <button
              onClick={() => handleResetTimer(90)}
              className={`px-2 py-1 rounded-lg ${timerDuration === 90 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              90s
            </button>
            <button
              onClick={() => handleResetTimer(120)}
              className={`px-2 py-1 rounded-lg ${timerDuration === 120 ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
            >
              120s
            </button>
          </div>
        </div>
      </div>

      {/* SMARTBOARD 4 LARGE RTCL BOXES (Touch-Friendly for Students) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* SCOREBOARD SUMMARY & SUBMIT BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl">
        {/* Big Live Score */}
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
            </div>
            <p className="text-xs text-slate-300">
              {auditScore.totalScore >= 85
                ? '⭐ Kualitas Luar Biasa! Siap untuk disubmit ke Database Nilai Kelas.'
                : 'Lengkapi kriteria R, T, C, L di atas untuk menaikkan skor ke level Master.'}
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
            <span>Kirim & Rekap Nilai</span>
          </button>

          <button
            onClick={handleNextStudent}
            className="px-4 py-3.5 text-xs sm:text-sm font-bold rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
            title="Bersihkan papan untuk siswa selanjutnya"
          >
            <span>Giliran Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Submission Success Banner */}
      {justSubmitted && submittedScore && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-white">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">
                Nilai Berhasil Direkam ke Database Kelas!
              </h4>
              <p className="text-xs">
                Siswa: <strong>{studentName || teamName}</strong> ({className}) • Skor: <strong>{submittedScore.totalScore}/100 ({submittedScore.grade})</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onOpenGradebook}
            className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shrink-0"
          >
            Buka Rekapitulasi Nilai
          </button>
        </div>
      )}
    </div>
  );
}
