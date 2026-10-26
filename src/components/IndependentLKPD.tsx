import React, { useState } from 'react';
import { 
  FileEdit, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Copy, 
  RotateCcw, 
  Send, 
  Bot, 
  Award, 
  User, 
  Users, 
  Layers, 
  BookOpen, 
  Check, 
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { RTCLForm, RTCLAuditScore } from '../types/rtcl';
import { JurusanSMK, StudentScoreRecord, ClassroomTopic } from '../types/classroom';
import { SMK_CLASSES, getJurusanFromClass } from '../data/classrooms';
import { evaluateRTCLPrompt } from '../utils/evaluator';
import { formatRTCLPrompt } from '../utils/formatters';
import { executeRTCLPromptWithAI, AIExecutionResult } from '../utils/aiGenerator';
import { recordStudentScore } from '../utils/classroomDb';

interface IndependentLKPDProps {
  topics: ClassroomTopic[];
  onRecordSuccess: (record: StudentScoreRecord) => void;
  onOpenGradebook: () => void;
  onNotice: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export function IndependentLKPD({
  topics,
  onRecordSuccess,
  onOpenGradebook,
  onNotice
}: IndependentLKPDProps) {
  // Identity
  const [studentName, setStudentName] = useState<string>('');
  const [teamMembers, setTeamMembers] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [className, setClassName] = useState<string>('X APHPi 1');
  const [selectedJurusan, setSelectedJurusan] = useState<JurusanSMK>('APHPi');

  // Form RTCL
  const [form, setForm] = useState<RTCLForm>({
    role: '',
    task: '',
    context: '',
    limitations: ''
  });

  // AI Generative Output
  const [isExecutingAI, setIsExecutingAI] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIExecutionResult | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Live evaluation
  const auditScore = evaluateRTCLPrompt(form);

  const handleClassChange = (newClass: string) => {
    setClassName(newClass);
    const j = getJurusanFromClass(newClass);
    setSelectedJurusan(j);
  };

  const handleLoadSampleTopic = (j: JurusanSMK) => {
    const topic = topics.find((t) => t.jurusan === j);
    if (topic) {
      setForm({
        role: j === 'TKJ' 
          ? 'Network Engineer bersertifikasi MikroTik MTCNA' 
          : j === 'APHPi' 
          ? 'Quality Assurance Industri Pengolahan Hasil Perikanan' 
          : j === 'TKR' 
          ? 'Mekanik Kepala Bengkel Resmi Otomotif' 
          : 'Instalatir Listrik Industri PUIL 2011',
        task: topic.challengeGoal,
        context: topic.description,
        limitations: 'Format tabel Markdown, bahasa teknis baku, maksimal 200 kata'
      });
      onNotice('Kasus Dimuat', `Skenario ${j}: "${topic.title}" berhasil dimuat ke LKPD.`, 'info');
    }
  };

  const handleExecuteAI = async () => {
    if (!form.role.trim() && !form.task.trim()) {
      onNotice('Data Belum Lengkap', 'Tuliskan minimal Role dan Task sebelum menguji respons AI.', 'warning');
      return;
    }
    setIsExecutingAI(true);
    try {
      const result = await executeRTCLPromptWithAI(form);
      setAiResult(result);
      onNotice('Respons AI Berhasil Diperoleh', 'Silakan evaluasi apakah AI mematuhi batasan Anda.', 'success');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecutingAI(false);
    }
  };

  const handleSubmitToGradebook = () => {
    if (!studentName.trim()) {
      onNotice('Nama Wajib Diisi', 'Silakan tuliskan Nama Siswa / Ketua Kelompok terlebih dahulu.', 'warning');
      return;
    }

    const compiled = formatRTCLPrompt(form, 'standard_id');
    const aiText = aiResult?.content || 'Prompt disusun melalui LKPD Mandiri.';

    const records = recordStudentScore(
      studentName,
      className,
      selectedJurusan,
      teamName || 'Tugas LKPD Mandiri',
      `LKPD: ${form.task ? form.task.slice(0, 40) + '...' : `Tugas Mandiri ${selectedJurusan}`}`,
      form,
      auditScore,
      60,
      teamMembers,
      'Penyerahan dari LKPD Mandiri Siswa',
      compiled,
      aiText
    );

    const latest = records[0];
    onRecordSuccess(latest);
    setIsSubmitted(true);
    onNotice('LKPD Terkirim ke Rekap Nilai', `Nilai ${studentName} (${auditScore.totalScore}/100) tersimpan di database guru.`, 'success');
  };

  const handleDownloadLKPD = () => {
    const content = `=====================================================
LEMBAR KERJA PESERTA DIDIK (LKPD) DIGITAL
Materi: Prompt Engineering Berbasis RTCL
SMK Negeri 1 Sidayu
=====================================================

IDENTITAS PESERTA DIDIK:
- Nama Siswa / Ketua : ${studentName || '-'}
- Anggota Kelompok   : ${teamMembers || '-'}
- Kelas              : ${className}
- Jurusan            : ${selectedJurusan}
- Tanggal            : ${new Date().toLocaleDateString('id-ID')}

SKOR EVALUASI RUBRIK:
- Role Score        : ${auditScore.roleScore} / 25
- Task Score        : ${auditScore.taskScore} / 25
- Context Score     : ${auditScore.contextScore} / 25
- Limitations Score : ${auditScore.limitationsScore} / 25
- Total Skor Akhir  : ${auditScore.totalScore} / 100 (${auditScore.grade})

PROMPT RTCL YANG DISUSUN:
-----------------------------------------------------
PERAN (ROLE):
${form.role || '-'}

TUGAS (TASK):
${form.task || '-'}

KONTEKS (CONTEXT):
${form.context || '-'}

BATASAN (LIMITATIONS):
${form.limitations || '-'}
-----------------------------------------------------

HASIL LUARAN GENERATIF AI:
-----------------------------------------------------
${aiResult?.content || '(Belum dieksekusi ke AI)'}
-----------------------------------------------------
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LKPD_RTCL_${(studentName || 'Siswa').replace(/\s+/g, '_')}_${className.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onNotice('Berkas Terunduh', 'File LKPD berekstensi TXT siap dikumpulkan atau dicetak.', 'success');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-blue-800 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-xs font-bold text-emerald-100 mb-2 border border-white/20">
            <FileEdit className="w-4 h-4 text-amber-300" />
            <span>Lembar Kerja Peserta Didik (LKPD) Interaktif</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            LKPD Mandiri: Perumusan Prompt RTCL
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-2xl leading-relaxed">
            Kerjakan penugasan terstruktur sesuai kejuruan masing-masing (APHPi, TKJ, TITL, TKR). 
            Uji respons AI generatif secara langsung dan kirimkan hasil nilai ke database guru.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadLKPD}
            className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Berkas LKPD (.txt)</span>
          </button>

          <button
            onClick={onOpenGradebook}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Buka Rekap Nilai</span>
          </button>
        </div>
      </div>

      {/* Identitas Siswa Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>A. Identitas Peserta Didik / Kelompok</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Nama Siswa / Ketua: *
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nama lengkap..."
              className="w-full px-3 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Anggota Kelompok (Jika Kelompok):
            </label>
            <input
              type="text"
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              placeholder="Nama rekan regu..."
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Pilihan Kelas:
            </label>
            <select
              value={className}
              onChange={(e) => handleClassChange(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SMK_CLASSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Muat Skenario Kejuruan:
            </label>
            <div className="flex items-center gap-1">
              {(['APHPi', 'TKJ', 'TKR', 'TITL'] as JurusanSMK[]).map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => handleLoadSampleTopic(j)}
                  className={`px-2 py-2 rounded-xl text-xs font-extrabold flex-1 transition-colors ${
                    selectedJurusan === j
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title={`Muat Kasus ${j}`}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Langkah Kerja RTCL & Rubrik Live */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form RTCL */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                <span>B. Perumusan 4 Pilar RTCL</span>
              </h3>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                Total: {auditScore.totalScore} / 100 Poin
              </span>
            </div>

            {/* 1. ROLE */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-blue-50/40 dark:bg-slate-800/60 border border-blue-200 dark:border-blue-900/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-blue-950 dark:text-blue-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">R</span>
                  <span>1. Role (Peran & Kredensial AI)</span>
                </label>
                <span className="text-[11px] font-bold text-blue-600">{auditScore.roleScore}/25 Poin</span>
              </div>
              <textarea
                rows={2}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Tuliskan peran ahli profesional spesifik..."
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 2. TASK */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-slate-800/60 border border-indigo-200 dark:border-indigo-900/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-indigo-950 dark:text-indigo-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">T</span>
                  <span>2. Task (Tugas Operasional)</span>
                </label>
                <span className="text-[11px] font-bold text-indigo-600">{auditScore.taskScore}/25 Poin</span>
              </div>
              <textarea
                rows={2}
                value={form.task}
                onChange={(e) => setForm({ ...form, task: e.target.value })}
                placeholder="Tuliskan kata kerja operasional dan luaran yang diinginkan..."
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* 3. CONTEXT */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-teal-50/40 dark:bg-slate-800/60 border border-teal-200 dark:border-teal-900/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-teal-950 dark:text-teal-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">C</span>
                  <span>3. Context (Konteks & Fakta Kasus)</span>
                </label>
                <span className="text-[11px] font-bold text-teal-600">{auditScore.contextScore}/25 Poin</span>
              </div>
              <textarea
                rows={2}
                value={form.context}
                onChange={(e) => setForm({ ...form, context: e.target.value })}
                placeholder="Tuliskan situasi nyata, perangkat bengkel/lab, atau kendala lapangan..."
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* 4. LIMITATIONS */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-amber-50/40 dark:bg-slate-800/60 border border-amber-200 dark:border-amber-900/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center text-[10px] font-black">L</span>
                  <span>4. Limitations (Batasan & Format)</span>
                </label>
                <span className="text-[11px] font-bold text-amber-600">{auditScore.limitationsScore}/25 Poin</span>
              </div>
              <textarea
                rows={2}
                value={form.limitations}
                onChange={(e) => setForm({ ...form, limitations: e.target.value })}
                placeholder="Tuliskan aturan format output (tabel, poin, bahasa baku, larangan halusinasi)..."
                className="w-full p-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleExecuteAI}
                disabled={isExecutingAI}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                {isExecutingAI ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Mengeksekusi AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Uji Prompt ke AI Generatif</span>
                  </>
                )}
              </button>

              <button
                onClick={handleSubmitToGradebook}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Nilai ke Rekap Guru</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Generative Output & Preview */}
        <div className="lg:col-span-5 space-y-4">
          {/* Hasil Generatif AI Card */}
          <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                  Hasil Luaran Generatif AI
                </h4>
              </div>
              {aiResult && (
                <span className="text-[10px] text-slate-400">
                  {aiResult.model}
                </span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 min-h-64 max-h-96 overflow-y-auto text-xs font-mono leading-relaxed whitespace-pre-wrap">
              {isExecutingAI ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Sparkles className="w-7 h-7 text-amber-400 animate-spin mx-auto" />
                  <p className="text-xs font-medium">Model AI sedang merespons prompt Anda...</p>
                </div>
              ) : aiResult ? (
                aiResult.content
              ) : (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Bot className="w-8 h-8 mx-auto stroke-1" />
                  <p className="text-xs">
                    Klik tombol <strong>"Uji Prompt ke AI Generatif"</strong> di sebelah kiri untuk melihat tanggapan AI terhadap formula RTCL Anda.
                  </p>
                </div>
              )}
            </div>

            {aiResult && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300">
                <strong>Analisis Kepatuhan:</strong> {aiResult.evaluatedCompliance.summaryNotes}
              </div>
            )}
          </div>

          {/* Submission Notice */}
          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  LKPD siswa <strong>{studentName}</strong> ({auditScore.totalScore}/100) telah terekam di database nilai!
                </span>
              </div>
              <button
                onClick={onOpenGradebook}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0"
              >
                Lihat Rekap
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
