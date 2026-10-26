import { 
  X, 
  Lightbulb, 
  UserCheck, 
  Target, 
  Layers, 
  ShieldAlert, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Panduan Prompt Engineering: Metode RTCL
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Standar emas menyusun instruksi AI berdaya guna tinggi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Introduction */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Mengapa Metode RTCL Sangat Efektif?
            </p>
            Model AI seperti GPT-4o, Claude 3.5, dan Gemini 2.0 bekerja optimal ketika diberikan batasan dan ruang lingkup spesifik. Tanpa RTCL, AI cenderung memberikan jawaban umum dan klise. Dengan RTCL, AI bertransformasi menjadi mitra ahli yang tepat sasaran.
          </div>

          {/* 4 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* R */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs">
                  R
                </span>
                <UserCheck className="w-4 h-4" />
                <span>Role (Peran AI)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Menentukan persona, tingkat keahlian, dan sudut pandang AI. Misalnya: <em>&quot;Bertindaklah sebagai Guru Penggerak dan Ahli Kurikulum Merdeka&quot;</em>.
              </p>
            </div>

            {/* T */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs">
                  T
                </span>
                <Target className="w-4 h-4" />
                <span>Task (Tugas Utama)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Menentukan instruksi kerja spesifik yang harus diselesaikan. Gunakan kata kerja aktif: <em>&quot;Rancang Modul Ajar berdiferensiasi...&quot;</em> atau <em>&quot;Susun instrumen supervisi klinis...&quot;</em>.
              </p>
            </div>

            {/* C */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-md bg-teal-600 text-white flex items-center justify-center text-xs">
                  C
                </span>
                <Layers className="w-4 h-4" />
                <span>Context (Konteks)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Memberikan latar belakang, profil audiens, jenjang kelas, data sekolah, kendala waktu, atau fasilitas yang dimiliki agar solusi AI tidak generik.
              </p>
            </div>

            {/* L */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <span className="w-6 h-6 rounded-md bg-amber-600 text-white flex items-center justify-center text-xs">
                  L
                </span>
                <ShieldAlert className="w-4 h-4" />
                <span>Limitations (Batasan)</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Mengunci gaya bahasa (formal/santai), format penyajian (tabel Markdown/poin), batasan jumlah kata, hingga hal-hal yang dilarang muncul dalam jawaban.
              </p>
            </div>
          </div>

          {/* Quick Checklist for Educators & Professionals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Tips Penerapan di Satuan Pendidikan
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">1.</span>
                <span><strong>Untuk Guru:</strong> Cantumkan Fase (A/B/C/D/E/F), capaian pembelajaran (CP), dan gaya belajar murid pada kolom <em>Context</em>.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">2.</span>
                <span><strong>Untuk Kepala Sekolah:</strong> Kaitkan tugas dengan indikator prioritas Rapor Pendidikan dan program kerja sekolah.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">3.</span>
                <span><strong>Format Tabel:</strong> Minta format tabel Markdown di kolom <em>Limitations</em> untuk instrumen penilaian atau jadwal kerja.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
