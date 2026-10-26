import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Trophy, 
  Flame, 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  Users, 
  ArrowRight,
  Music,
  Smile,
  Timer
} from 'lucide-react';

interface IceBreakingSectionProps {
  onGoToArena: () => void;
  onGoToLKPD: () => void;
}

interface QuizScenario {
  id: number;
  jurusan: string;
  context: string;
  optionA: {
    text: string;
    isCorrect: boolean;
    reason: string;
  };
  optionB: {
    text: string;
    isCorrect: boolean;
    reason: string;
  };
}

const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: 1,
    jurusan: 'TKJ (Jaringan)',
    context: 'Lab TKJ butuh pembagian IP dan VLAN untuk 36 PC siswa agar tidak bentrok dengan server ujian CBT.',
    optionA: {
      text: 'AI tolong buatkan IP address yang bagus buat lab komputer sekolah.',
      isCorrect: false,
      reason: 'Prompt ambigu! Tidak ada subnet mask, tidak ada alokasi VLAN, dan tidak ada batasan format.'
    },
    optionB: {
      text: 'Role: Network Engineer. Task: Buat tabel subnetting /24 dan /28 serta script VLAN MikroTik. Context: 36 PC klien & 1 server CBT. Limitations: Format tabel Markdown & script CLI Winbox.',
      isCorrect: true,
      reason: 'Hebat! Memenuhi 4 pilar RTCL lengkap: Role, Task, Context, dan Limitations teknis.'
    }
  },
  {
    id: 2,
    jurusan: 'APHPi (Perikanan)',
    context: 'Siswa ingin membuat SOP pengalengan ikan tuna agar steril dan tidak melembung.',
    optionA: {
      text: 'Role: Quality Control Pangan. Task: Susun SOP sterilisasi autoclave retort. Context: Kaleng tuna 185g saus minyak. Limitations: Urutan nomor 1-5, cantumkan suhu 121°C dan tekanan 0.15 MPa.',
      isCorrect: true,
      reason: 'Sangat presisi! Batasan parameter kritis retort (121°C & 0.15 MPa) mencegah bahaya botulinum.'
    },
    optionB: {
      text: 'Bagaimana cara memasak kaleng sarden agar enak dan tahan berbulan-bulan?',
      isCorrect: false,
      reason: 'Bahaya! "Enak" adalah penilaian subjektif tanpa parameter sterilisasi termal industri pangan.'
    }
  },
  {
    id: 3,
    jurusan: 'TKR (Otomotif)',
    context: 'Mobil Avanza Dual VVT-i 2018 mesinnya tersendat-sendat (brebet) saat putaran gas tinggi.',
    optionA: {
      text: 'Kenapa mobil saya brebet saat digas kencang tolong perbaiki.',
      isCorrect: false,
      reason: 'AI akan memberi jawaban umum yang belum tentu sesuai dengan sistem injeksi EFI.'
    },
    optionB: {
      text: 'Role: Kepala Mekanik Otomotif BNSP. Task: Buat tabel diagnosis 4 langkah fuel pump & pengapian. Context: Avanza 2018 RPM >3000. Limitations: Format tabel (Komponen, Nilai Standar psi/ohm, Tindakan).',
      isCorrect: true,
      reason: 'Mantap! Ada parameter standar pengukuran (psi / ohm) yang wajib bagi mekanik profesional.'
    }
  },
  {
    id: 4,
    jurusan: 'TITL (Listrik)',
    context: 'Motor listrik 3 fasa 15 kW untuk konveyor sering trip pengaman overload saat dihidupkan langsung (DOL).',
    optionA: {
      text: 'Role: Instalatir Listrik PUIL. Task: Buat tabel rating komponen panel kendali Star-Delta. Context: Motor 3 fasa 15 kW 380V konveyor. Limitations: Tentukan ampere MCCB, Kontaktor, dan TOR berpedoman PUIL.',
      isCorrect: true,
      reason: 'Luar biasa! Konsep transisi Star-Delta dan regulasi PUIL 2011 diterapkan dengan benar.'
    },
    optionB: {
      text: 'Berapa ampere kontaktor motor?',
      isCorrect: false,
      reason: 'Terlalu pendek! AI tidak tahu tegangan kerja, daya kilowatt motor, maupun sistem kendalinya.'
    }
  }
];

export function IceBreakingSection({
  onGoToArena,
  onGoToLKPD
}: IceBreakingSectionProps) {
  const [activeTab, setActiveTab] = useState<'spinner' | 'duel' | 'tepuk'>('spinner');

  // SPINNER WHEEL STATE
  const [wheelTeams, setWheelTeams] = useState<string[]>([
    'Kelompok 1 (Alpha)',
    'Kelompok 2 (Beta)',
    'Kelompok 3 (Gamma)',
    'Kelompok 4 (Delta)',
    'Kelompok 5 (Epsilon)',
    'Kelompok 6 (Zeta)'
  ]);
  const [newTeamInput, setNewTeamInput] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [rotationDegrees, setRotationDegrees] = useState<number>(0);
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);

  // SPEED DUEL STATE
  const [scenarioIndex, setScenarioIndex] = useState<number>(0);
  const [userScore, setUserScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [answeredState, setAnsweredState] = useState<{
    chosenOption: 'A' | 'B' | null;
    isCorrect: boolean | null;
    reason: string;
  } | null>(null);

  // Spin wheel logic
  const handleSpinWheel = () => {
    if (isSpinning || wheelTeams.length === 0) return;
    setIsSpinning(true);
    setSelectedWinner(null);

    // Random rotations (min 5 full spins + random slice)
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalNewRotation = rotationDegrees + 1800 + extraDegrees;
    setRotationDegrees(totalNewRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Calculate which slice landed at the top (pointer is at 0/360 degrees top)
      const degreesNormalized = (360 - (totalNewRotation % 360)) % 360;
      const sliceSize = 360 / wheelTeams.length;
      const winnerIndex = Math.floor(degreesNormalized / sliceSize) % wheelTeams.length;
      setSelectedWinner(wheelTeams[winnerIndex]);
    }, 3500);
  };

  const handleAddTeam = () => {
    if (newTeamInput.trim()) {
      setWheelTeams([...wheelTeams, newTeamInput.trim()]);
      setNewTeamInput('');
    }
  };

  const handleRemoveTeam = (index: number) => {
    if (wheelTeams.length > 2) {
      setWheelTeams(wheelTeams.filter((_, i) => i !== index));
    }
  };

  // Speed Duel logic
  const currentScenario = QUIZ_SCENARIOS[scenarioIndex];

  const handleChooseOption = (optionKey: 'A' | 'B') => {
    if (answeredState) return;
    const chosen = optionKey === 'A' ? currentScenario.optionA : currentScenario.optionB;
    const isCorrect = chosen.isCorrect;

    if (isCorrect) {
      setUserScore(prev => prev + 25 + streak * 5);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setAnsweredState({
      chosenOption: optionKey,
      isCorrect,
      reason: chosen.reason
    });
  };

  const handleNextScenario = () => {
    setAnsweredState(null);
    if (scenarioIndex < QUIZ_SCENARIOS.length - 1) {
      setScenarioIndex(prev => prev + 1);
    } else {
      setScenarioIndex(0);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black text-amber-100 mb-2 border border-white/25">
            <Flame className="w-4 h-4 fill-current text-yellow-300" />
            <span>Pemanasan Kelas &amp; Games Interaktif Papan Tulis</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Ice Breaking: AI Prompt Duel
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl leading-relaxed">
            Bangkitkan semangat siswa di awal jam pelajaran! Gunakan <strong>Roda Keberuntungan</strong> untuk memilih giliran regu yang maju ke Smartboard, atau mainkan <strong>Duel Kilat Prompt vs Halusinasi</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToArena}
            className="px-5 py-3.5 rounded-2xl bg-white text-slate-900 font-black text-xs sm:text-sm shadow-xl hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-2"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Lanjut ke Arena Lomba RTCL</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 w-fit">
        <button
          onClick={() => setActiveTab('spinner')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'spinner'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <RotateCw className="w-4 h-4" />
          <span>1. Roda Putar Undian Regu</span>
        </button>

        <button
          onClick={() => setActiveTab('duel')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'duel'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>2. Kuis Kilat: Prompt vs Halusinasi</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold">Refleks</span>
        </button>

        <button
          onClick={() => setActiveTab('tepuk')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'tepuk'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>3. Yel-Yel &amp; Tepuk RTCL</span>
        </button>
      </div>

      {/* TAB 1: RODA PUTAR UNDIAN */}
      {activeTab === 'spinner' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in-50">
          {/* Wheel Display (Cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-6">
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              {/* Pointer Triangle */}
              <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-rose-600 filter drop-shadow-md" />

              {/* The Spinning Circle */}
              <div
                className="w-full h-full rounded-full border-8 border-slate-800 shadow-2xl overflow-hidden relative transition-transform duration-[3500ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
                style={{
                  transform: `rotate(${rotationDegrees}deg)`,
                  background: 'conic-gradient(#3b82f6 0% 16.6%, #10b981 16.6% 33.3%, #f59e0b 33.3% 50%, #ec4899 50% 66.6%, #8b5cf6 66.6% 83.3%, #06b6d4 83.3% 100%)'
                }}
              >
                {/* Wheel Labels Overlay */}
                {wheelTeams.map((team, index) => {
                  const sliceAngle = 360 / wheelTeams.length;
                  const rotateAngle = index * sliceAngle + sliceAngle / 2;
                  return (
                    <div
                      key={index}
                      className="absolute top-0 left-1/2 w-32 -ml-16 h-1/2 origin-bottom flex items-start justify-center pt-3 text-white font-black text-xs sm:text-sm drop-shadow-md select-none"
                      style={{
                        transform: `rotate(${rotateAngle}deg)`
                      }}
                    >
                      <span className="truncate max-w-[90px]">{team}</span>
                    </div>
                  );
                })}
              </div>

              {/* Center Hub Button */}
              <button
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="absolute z-10 w-20 h-20 rounded-full bg-slate-900 border-4 border-amber-400 text-amber-300 font-black text-sm flex flex-col items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-75"
              >
                <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'PUTAR' : 'SPIN!'}</span>
              </button>
            </div>

            {/* Winner Announcement Banner */}
            {selectedWinner && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-center shadow-lg animate-bounce space-y-1">
                <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-slate-900">
                  <Sparkles className="w-4 h-4" />
                  <span>Regu Terpilih Tampil di Smartboard:</span>
                </div>
                <div className="text-xl sm:text-2xl font-black">
                  🎉 {selectedWinner} 🎉
                </div>
                <p className="text-xs font-semibold text-slate-900">
                  Bonus Keaktifan Awal: <strong>+5 Poin Semangat</strong>! Silakan perwakilan maju ke papan tulis.
                </p>
              </div>
            )}
          </div>

          {/* Teams Settings (Cols 8-12) */}
          <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Daftar Regu / Siswa di Roda
              </h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTeamInput}
                onChange={(e) => setNewTeamInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                placeholder="Tambah nama kelompok..."
                className="flex-1 px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleAddTeam}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
              >
                Tambah
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {wheelTeams.map((team, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center justify-between text-slate-800 dark:text-slate-200"
                >
                  <span className="truncate">{team}</span>
                  {wheelTeams.length > 2 && (
                    <button
                      onClick={() => handleRemoveTeam(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              💡 Tips Guru: Masukkan nama 4-6 regu kelompok atau nama ketua kelompok yang akan bertanding di papan tulis hari ini.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: SPEED DUEL (KUIS KILAT REFLEKS) */}
      {activeTab === 'duel' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-in fade-in-50">
          {/* Header & Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-black uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <Zap className="w-4 h-4" /> Kuis Refleks Smartboard ({scenarioIndex + 1}/{QUIZ_SCENARIOS.length})
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
                Pilih Mana Prompt RTCL yang Layak Eksekusi ke AI?
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-black text-xs flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-current text-orange-500" />
                <span>Streak: {streak}x</span>
              </div>

              <div className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>Skor: {userScore}</span>
              </div>
            </div>
          </div>

          {/* Skenario Kasus */}
          <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 space-y-1">
            <span className="text-[11px] font-black uppercase text-blue-700 dark:text-blue-300">
              Kasus Vokasi ({currentScenario.jurusan}):
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              "{currentScenario.context}"
            </p>
          </div>

          {/* 2 Big Touch Buttons (Option A vs Option B) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OPSI A */}
            <button
              onClick={() => handleChooseOption('A')}
              disabled={answeredState !== null}
              className={`p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${
                answeredState === null
                  ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-blue-500 hover:shadow-lg active:scale-98'
                  : answeredState.chosenOption === 'A'
                  ? answeredState.isCorrect
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500'
                    : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100'
                  : currentScenario.optionA.isCorrect
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'opacity-60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  A
                </span>
                {answeredState && answeredState.chosenOption === 'A' && (
                  answeredState.isCorrect ? (
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Benar (+25 Poin)
                    </span>
                  ) : (
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-500 text-white flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Salah
                    </span>
                  )
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold leading-relaxed">
                "{currentScenario.optionA.text}"
              </p>
            </button>

            {/* OPSI B */}
            <button
              onClick={() => handleChooseOption('B')}
              disabled={answeredState !== null}
              className={`p-5 rounded-3xl border-2 text-left transition-all relative overflow-hidden ${
                answeredState === null
                  ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-blue-500 hover:shadow-lg active:scale-98'
                  : answeredState.chosenOption === 'B'
                  ? answeredState.isCorrect
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500'
                    : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100'
                  : currentScenario.optionB.isCorrect
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'opacity-60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm">
                  B
                </span>
                {answeredState && answeredState.chosenOption === 'B' && (
                  answeredState.isCorrect ? (
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Benar (+25 Poin)
                    </span>
                  ) : (
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-500 text-white flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Salah
                    </span>
                  )
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold leading-relaxed">
                "{currentScenario.optionB.text}"
              </p>
            </button>
          </div>

          {/* Feedback Explanation */}
          {answeredState && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 animate-in fade-in-50 ${
              answeredState.isCorrect 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider block">
                  {answeredState.isCorrect ? '✅ Penjelasan Analisis Jawaban:' : '❌ Mengapa Salah?'}
                </span>
                <p className="text-xs sm:text-sm font-medium">
                  {answeredState.reason}
                </p>
              </div>

              <button
                onClick={handleNextScenario}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold text-xs shrink-0 shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                Soal Berikutnya &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: YEL-YEL & TEPUK RTCL */}
      {activeTab === 'tepuk' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-in fade-in-50">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 block mb-1">
              Ritme &amp; Semangat Kelas
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              Yel-Yel &amp; Tepuk RTCL AI
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Panduan interaktif untuk guru memandu tepuk tangan berirama di kelas sebelum siswa mulai berkompetisi menyusun prompt di papan tulis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tepuk RTCL */}
            <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-black text-sm">
                <Music className="w-5 h-5 text-amber-600" />
                <span>1. Tepuk RTCL (Irama 3 Ketukan)</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
                <p>👏 👏 👏 <em>Prok prok prok</em> ... <strong>R - ROLE!</strong> (Tentukan Peran!)</p>
                <p>👏 👏 👏 <em>Prok prok prok</em> ... <strong>T - TASK!</strong> (Tugasnya Jelas!)</p>
                <p>👏 👏 👏 <em>Prok prok prok</em> ... <strong>C - CONTEXT!</strong> (Konteks Nyata!)</p>
                <p>👏 👏 👏 <em>Prok prok prok</em> ... <strong>L - LIMITATIONS!</strong> (Batasi Format!)</p>
                <p className="pt-2 text-rose-600 dark:text-rose-400 font-black">
                  🗣️ SERU BERSAMA: <strong>"RTCL JOS! AI CERDAS, SMK BISA-HEBAT!"</strong>
                </p>
              </div>
            </div>

            {/* Sumpah Anti-Halusinasi */}
            <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-3">
              <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-black text-sm">
                <Smile className="w-5 h-5 text-blue-600" />
                <span>2. Janji Teknisi Cerdas (Anti-Halusinasi)</span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <p>1. "Kami tidak akan menerima jawaban AI tanpa verifikasi modul dan SOP bengkel!"</p>
                <p>2. "Kami selalu memberi konteks riil dan batasan ketat pada setiap prompt!"</p>
                <p>3. "Kami mengendalikan kecerdasan buatan, bukan dikendalikan oleh AI!"</p>
              </div>

              <button
                onClick={onGoToArena}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Maju ke Smartboard Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
