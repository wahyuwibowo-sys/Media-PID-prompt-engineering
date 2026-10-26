import { useState } from 'react';
import { 
  X, 
  Terminal, 
  FolderTree, 
  Copy, 
  Check, 
  BookOpen, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

interface ProjectDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopyNotice: () => void;
}

export function ProjectDocsModal({ isOpen, onClose, onCopyNotice }: ProjectDocsModalProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    onCopyNotice();
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const folderStructureText = `rtcl-prompt-generator/
├── index.html                  # Dokumen HTML utama & font Google Plus Jakarta Sans
├── metadata.json               # Metadata aplikasi untuk Google AI Studio
├── package.json                # Dependensi (React 19, Tailwind CSS v4, Lucide)
├── tsconfig.json               # Konfigurasi TypeScript
├── vite.config.ts              # Konfigurasi Vite build tool
└── src/
    ├── main.tsx                # Entry point render React DOM
    ├── App.tsx                 # Root component orchestrator
    ├── index.css               # Import Tailwind CSS & styling kustom
    ├── types/
    │   └── rtcl.ts             # Definisi interface TypeScript (RTCLForm, History, etc.)
    ├── data/
    │   ├── templates.ts        # 8 Kategori template siap pakai (Guru, Kepala Sekolah, dll)
    │   └── quickChips.ts       # Rekomendasi chip cepat untuk tiap elemen RTCL
    ├── utils/
    │   ├── formatters.ts       # Generator format RTCL, metrik kata/token, & export TXT
    │   └── storage.ts          # Sinkronisasi LocalStorage untuk riwayat 20 prompt & tema
    └── components/
        ├── Header.tsx          # Navigasi atas, kontrol tema, & toggle panduan
        ├── TemplateSelector.tsx# Pilihan template kategori & pencarian instan
        ├── RTCLForm.tsx        # Form 4 elemen RTCL dengan validasi & saran chip
        ├── PromptOutput.tsx    # Live preview output, copy prompt, unduh TXT, & link AI
        ├── PromptHistory.tsx   # Panel riwayat 20 prompt terakhir tersimpan lokal
        ├── GuideModal.tsx      # Edukasi metode RTCL & tips prompt engineering
        ├── ProjectDocsModal.tsx# Dokumentasi arsitektur & cara instalasi dari nol
        └── Toast.tsx           # Notifikasi pop-up saat copy berhasil`;

  const installScriptText = `# 1. Clone repository atau buat folder baru
mkdir rtcl-prompt-generator
cd rtcl-prompt-generator

# 2. Inisialisasi proyek dan instalasi dependensi
npm install

# 3. Jalankan server pengembangan lokal (Vite)
npm run dev

# 4. Buka di browser:
# http://localhost:5173 atau http://localhost:3000

# 5. Build untuk produksi (output di folder /dist)
npm run build`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Struktur Folder & Panduan Instalasi dari Nol
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dokumentasi teknis untuk pengembang dan tenaga pendidik IT
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
          {/* Section 1: Folder Tree */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>1. Struktur Folder Proyek (Modular Architecture)</span>
              </h4>
              <button
                onClick={() => copyToClipboard(folderStructureText, 'tree')}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copiedCode === 'tree' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Struktur</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
              {folderStructureText}
            </pre>
          </div>

          {/* Section 2: Installation steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>2. Langkah Instalasi & Menjalankan Proyek dari Nol</span>
              </h4>
              <button
                onClick={() => copyToClipboard(installScriptText, 'install')}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copiedCode === 'install' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Perintah</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
              {installScriptText}
            </pre>
          </div>

          {/* Section 3: Technical Highlights */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <h5 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-500" />
              Keunggulan Arsitektur Aplikasi
            </h5>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>Zero-Backend:</strong> Seluruh komputasi berjalan di browser klien tanpa dependensi server atau API eksternal.</li>
              <li><strong>Privasi Aman:</strong> Data prompt dan riwayat hanya disimpan di LocalStorage perangkat Anda.</li>
              <li><strong>Desain Aksesibel:</strong> Dilengkapi Dark & Light mode kontras tinggi dan ramah gawai seluler.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-xl shadow-xs transition-colors"
          >
            Tutup Dokumentasi
          </button>
        </div>
      </div>
    </div>
  );
}
