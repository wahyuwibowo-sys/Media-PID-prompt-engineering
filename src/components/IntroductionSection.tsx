import React, { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Fish, 
  Wrench, 
  Zap,
  Award,
  ListOrdered,
  FileText,
  Brain,
  ShieldCheck,
  Flame,
  Check,
  Copy,
  Eye,
  EyeOff,
  ChevronDown
} from 'lucide-react';
import { CURRICULUM_DATA, ESSENTIAL_MATERIALS } from '../data/curriculumData';

interface IntroductionSectionProps {
  onStartAssessment: () => void;
  onGoToArena: () => void;
  onGoToLKPD: () => void;
  onGoToIceBreaking?: () => void;
}

export function IntroductionSection({
  onStartAssessment,
  onGoToArena,
  onGoToLKPD,
  onGoToIceBreaking
}: IntroductionSectionProps) {
  const [activeTab, setActiveTab] = useState<'kurikulum' | 'materi-esensial'>('kurikulum');
  const [selectedPillar, setSelectedPillar] = useState<'R' | 'T' | 'C' | 'L'>('R');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const toggleAnswer = (id: number) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const isAllAnswersOpen = CURRICULUM_DATA.pertanyaanPemantik.every((q) => revealedAnswers[q.id]);

  const handleToggleAllAnswers = () => {
    const nextState = !isAllAnswersOpen;
    const updated: Record<number, boolean> = {};
    CURRICULUM_DATA.pertanyaanPemantik.forEach((q) => {
      updated[q.id] = nextState;
    });
    setRevealedAnswers(updated);
  };

  const activePillarData = CURRICULUM_DATA.pemahamanBermakna.poinKunci.find(
    (p) => p.huruf === selectedPillar
  );

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold text-sky-100 border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Kurikulum Merdeka SMK • Fase E</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Pemanfaatan &amp; Pengembangan Kecerdasan Artifisial
          </h1>
          
          <p className="text-sm sm:text-base text-sky-100 leading-relaxed font-normal">
            Modul pembelajaran interaktif dan arena kompetisi prompt engineering berbasis kaidah 
            <strong> RTCL (Role, Task, Context, Limitations)</strong> untuk murid SMK.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            {onGoToIceBreaking && (
              <button
                onClick={onGoToIceBreaking}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4 fill-current text-rose-600" />
                <span>Mulai Ice Breaking Seru!</span>
              </button>
            )}

            <button
              onClick={onStartAssessment}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-sm backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>Asesmen Awal</span>
            </button>

            <button
              onClick={onGoToArena}
              className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-sm backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-sky-300" />
              <span>Buka Arena Papan Tulis</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      </div>

      {/* SUB-NAVIGATION TABS: KURIKULUM (CP/TP/ATP) vs MATERI ESENSIAL */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 w-fit">
        <button
          onClick={() => setActiveTab('kurikulum')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'kurikulum'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Kurikulum (CP, Elemen, TP &amp; ATP)</span>
        </button>

        <button
          onClick={() => setActiveTab('materi-esensial')}
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'materi-esensial'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Materi Esensial Prompt Engineering</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        </button>
      </div>

      {/* TAB 1: KURIKULUM (CP, ELEMEN, TP, ATP, DAN PEMANTIK) */}
      {activeTab === 'kurikulum' && (
        <div className="space-y-6 animate-in fade-in-50">
          {/* Grid: CP/TP/ATP dan Pertanyaan Pemantik */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Elemen, CP & TP & ATP */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    {CURRICULUM_DATA.fase}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                    Elemen &amp; Capaian Pembelajaran
                  </h2>
                </div>
              </div>

              {/* Elemen Box */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
                <span className="text-[11px] font-black uppercase text-blue-700 dark:text-blue-300 tracking-wider block mb-0.5">
                  Elemen Pembelajaran:
                </span>
                <p className="text-sm font-black text-blue-950 dark:text-blue-100">
                  {CURRICULUM_DATA.elemen}
                </p>
              </div>

              {/* CP Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                  Capaian Pembelajaran (CP):
                </h3>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  "{CURRICULUM_DATA.capaianPembelajaran}"
                </p>
              </div>

              {/* TP List */}
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wide">
                  Tujuan Pembelajaran (TP):
                </h3>
                <ul className="space-y-2">
                  {CURRICULUM_DATA.tujuanPembelajaran.map((tp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{tp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ATP List */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wide flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4" />
                  <span>Alur Tujuan Pembelajaran (ATP):</span>
                </h3>
                <div className="space-y-1.5">
                  {CURRICULUM_DATA.alurTujuanPembelajaran.map((atp, idx) => (
                    <div 
                      key={idx}
                      className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2"
                    >
                      <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                        {idx + 12}
                      </span>
                      <span>{atp.replace(/^\d+\.\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Pertanyaan Pemantik */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Refleksi Awal Siswa
                    </span>
                    <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
                      Pertanyaan Pemantik
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleAllAnswers}
                  className="px-3.5 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  {isAllAnswersOpen ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Tutup Semua Jawaban</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Buka Semua Jawaban</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                {CURRICULUM_DATA.pertanyaanPemantik.map((item) => {
                  const isAnswerOpen = Boolean(revealedAnswers[item.id]);
                  const isCopied = copiedPromptId === `pemantik_${item.id}`;

                  return (
                    <div 
                      key={item.id} 
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                        isAnswerOpen
                          ? 'bg-amber-50/70 dark:bg-slate-850 border-amber-300 dark:border-amber-700 shadow-sm'
                          : 'bg-amber-50/30 dark:bg-slate-800/60 border-amber-200/60 dark:border-slate-700/80 hover:border-amber-300'
                      }`}
                    >
                      {/* Question Row */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-xs">
                          {item.id}
                        </div>
                        <div className="flex-1 space-y-2.5">
                          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed">
                            "{item.pertanyaan}"
                          </p>

                          {/* Action Button: Show / Hide Answer for this point */}
                          <div className="flex items-center gap-2 pt-0.5">
                            <button
                              type="button"
                              onClick={() => toggleAnswer(item.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 border cursor-pointer ${
                                isAnswerOpen
                                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                                  : 'bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/80 hover:bg-amber-100/70 dark:hover:bg-amber-950/50'
                              }`}
                            >
                              {isAnswerOpen ? (
                                <>
                                  <EyeOff className="w-3.5 h-3.5" />
                                  <span>Sembunyikan Kunci Jawaban</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                  <span>Lihat Kunci Jawaban &amp; Pembahasan</span>
                                </>
                              )}
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAnswerOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isAnswerOpen && (
                              <button
                                type="button"
                                onClick={() => handleCopyText(`pemantik_${item.id}`, item.jawaban)}
                                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                                title="Salin Kunci Jawaban"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Tersalin</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span className="text-[11px]">Salin</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Revealed Answer Box */}
                      {isAnswerOpen && (
                        <div className="mt-4 pt-3.5 border-t border-amber-200/80 dark:border-slate-700/80 space-y-3 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                          {/* Ideal Answer Content */}
                          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 space-y-1.5 shadow-2xs">
                            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Konsep &amp; Jawaban Ideal:</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                              {item.jawaban}
                            </p>
                          </div>

                          {/* Key Points Checklist */}
                          <div className="space-y-1.5">
                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                              Poin Refleksi Utama:
                            </span>
                            <ul className="space-y-1">
                              {item.poinKunci.map((point, pIdx) => (
                                <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Teacher Apperception Guide */}
                          <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 text-xs flex items-start gap-2">
                            <span className="font-black shrink-0">💡 Panduan Guru:</span>
                            <span className="italic">{item.panduanApersepsiGuru}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 text-xs leading-relaxed space-y-2">
                <div>
                  💡 <strong>Panduan Guru di Layar Smartboard:</strong>
                </div>
                <p>
                  Tampilkan pertanyaan pemantik terlebih dahulu di layar depan kelas sebelum membuka tombol <strong>"Lihat Kunci Jawaban &amp; Pembahasan"</strong>. Berikan kesempatan kepada siswa atau ketua kelompok untuk merespons secara lisan sebelum memverifikasi jawaban bersama.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATERI ESENSIAL PROMPT ENGINEERING */}
      {activeTab === 'materi-esensial' && (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                Bahan Ajar Lengkap
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                Materi Esensial: Prompt Engineering untuk Siswa SMK
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Panduan komprehensif memahami arsitektur perintah AI generatif, teknik penalaran, dan pencegahan halusinasi dalam perancangan produk barang dan jasa vokasi.
              </p>
            </div>

            {/* Grid of Essential Topics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ESSENTIAL_MATERIALS.map((topic) => (
                <div
                  key={topic.id}
                  className="p-5 sm:p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-blue-400 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
                      <Brain className="w-5 h-5" />
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                      {topic.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {topic.summary}
                  </p>

                  {/* Key Points */}
                  <div className="space-y-1.5 pt-1">
                    <h4 className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                      Poin Kunci:
                    </h4>
                    <ul className="space-y-1.5">
                      {topic.keyPoints.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sample Comparison (Bad vs Good) */}
                  {topic.sampleBadVsGood && (
                    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 space-y-1">
                        <span className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-400 block">
                          ❌ Contoh Prompt Lemah (Pemicu Halusinasi):
                        </span>
                        <p className="text-xs font-semibold text-rose-900 dark:text-rose-200 italic">
                          "{topic.sampleBadVsGood.bad}"
                        </p>
                        <p className="text-[11px] text-rose-700 dark:text-rose-400">
                          {topic.sampleBadVsGood.badReason}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 block">
                            ✅ Contoh Prompt RTCL Bermutu Tinggi:
                          </span>
                          <button
                            onClick={() => handleCopyText(topic.id, topic.sampleBadVsGood!.good)}
                            className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1"
                          >
                            {copiedPromptId === topic.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedPromptId === topic.id ? 'Tersalin' : 'Salin'}</span>
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                          "{topic.sampleBadVsGood.good}"
                        </p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          {topic.sampleBadVsGood.goodReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 text-[11px] text-blue-900 dark:text-blue-300 space-y-1">
                    <span className="font-extrabold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Tips Penerapan:
                    </span>
                    <ul className="space-y-0.5 list-disc list-inside">
                      {topic.tips.map((tip, tIdx) => (
                        <li key={tIdx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Card 3: Pemahaman Bermakna & 4 Pilar RTCL */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
              Konsep Inti
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
            Pemahaman Bermakna: Formula RTCL
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {CURRICULUM_DATA.pemahamanBermakna.ringkasan}
          </p>
        </div>

        {/* 4 Pilar Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CURRICULUM_DATA.pemahamanBermakna.poinKunci.map((pillar) => {
            const isSelected = selectedPillar === pillar.huruf;
            const colors = {
              R: 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300',
              T: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300',
              C: 'border-teal-500 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300',
              L: 'border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300'
            };

            return (
              <button
                key={pillar.huruf}
                onClick={() => setSelectedPillar(pillar.huruf)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected 
                    ? `${colors[pillar.huruf]} ring-2 ring-offset-2 ring-blue-500 shadow-md` 
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-black text-sm mb-2">
                  {pillar.huruf}
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {pillar.nama}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {pillar.fungsi}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detailed Explanation for Active Pillar */}
        {activePillarData && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-blue-600 dark:text-blue-400">
                Pilar Terpilih: {activePillarData.nama}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                Bobot Nilai: 25 Poin
              </span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
              <strong>Fungsi Utama:</strong> {activePillarData.fungsi}
            </p>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Contoh Penerapan Kasus Kejuruan SMK:
              </span>
              <p className="text-xs sm:text-sm font-semibold text-blue-900 dark:text-blue-300 italic">
                "{activePillarData.contohVocational}"
              </p>
            </div>
          </div>
        )}

        {/* 4 Majors Showcase */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-3">
            Relevansi pada 4 Kompetensi Keahlian di SMKN 1 Sidayu:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500 text-white shrink-0">
                <Fish className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-sky-950 dark:text-sky-200">APHPi</h5>
                <p className="text-[11px] text-sky-800 dark:text-sky-400 leading-tight">Pengolahan Hasil Perikanan & HACCP</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500 text-white shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-blue-950 dark:text-blue-200">TKJ</h5>
                <p className="text-[11px] text-blue-800 dark:text-blue-400 leading-tight">Jaringan MikroTik, Server & VLAN</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500 text-white shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-orange-950 dark:text-orange-200">TKR</h5>
                <p className="text-[11px] text-orange-800 dark:text-orange-400 leading-tight">Otomotif EFI, Kelistrikan & Mesin</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-slate-950 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-amber-950 dark:text-amber-200">TITL</h5>
                <p className="text-[11px] text-amber-800 dark:text-amber-400 leading-tight">Instalasi Listrik, Motor & PUIL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
