import { useState } from 'react';
import { 
  UserCheck, 
  Target, 
  Layers, 
  ShieldAlert, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  X,
  AlertCircle
} from 'lucide-react';
import { RTCLForm } from '../types/rtcl';
import { 
  QUICK_ROLE_CHIPS, 
  QUICK_TASK_CHIPS, 
  QUICK_CONTEXT_CHIPS, 
  QUICK_LIMITATIONS_CHIPS 
} from '../data/quickChips';

interface RTCLFormComponentProps {
  form: RTCLForm;
  onChange: (updated: RTCLForm) => void;
  onGenerate: () => void;
  onReset: () => void;
  isGenerating?: boolean;
}

export function RTCLFormComponent({
  form,
  onChange,
  onGenerate,
  onReset,
  isGenerating = false
}: RTCLFormComponentProps) {
  const [activeChipField, setActiveChipField] = useState<'role' | 'task' | 'context' | 'limitations' | null>(null);
  const [errors, setErrors] = useState<{ role?: string; task?: string }>({});

  const handleFieldChange = (field: keyof RTCLForm, value: string) => {
    onChange({
      ...form,
      [field]: value
    });

    if (field === 'role' && value.trim()) {
      setErrors((prev) => ({ ...prev, role: undefined }));
    }
    if (field === 'task' && value.trim()) {
      setErrors((prev) => ({ ...prev, task: undefined }));
    }
  };

  const addChipValue = (field: keyof RTCLForm, text: string) => {
    const current = form[field] || '';
    if (!current.trim()) {
      handleFieldChange(field, text);
    } else if (field === 'limitations' || field === 'context') {
      handleFieldChange(field, `${current.trim()}, ${text}`);
    } else {
      handleFieldChange(field, text);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { role?: string; task?: string } = {};

    if (!form.role.trim()) {
      newErrors.role = 'Peran (Role) wajib diisi agar AI memahami posisi & persona keahliannya.';
    }
    if (!form.task.trim()) {
      newErrors.task = 'Tugas (Task) wajib diisi untuk menentukan instruksi yang harus dieksekusi.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onGenerate();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm transition-colors">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              1
            </span>
            Parameter RTCL
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lengkapi 4 elemen berikut untuk menghasilkan prompt yang presisi dan tidak bertele-tele.
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          title="Kosongkan form input"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* FIELD 1: ROLE */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[11px]">
                R
              </span>
              <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Role (Peran AI)</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <button
              type="button"
              onClick={() => setActiveChipField(activeChipField === 'role' ? null : 'role')}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              {activeChipField === 'role' ? 'Tutup Saran' : 'Contoh Peran'}
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={form.role}
              onChange={(e) => handleFieldChange('role', e.target.value)}
              placeholder="Contoh: Guru Penggerak dan Ahli Perancang Modul Ajar Kurikulum Merdeka..."
              className={`w-full p-3 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.role
                  ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
              }`}
            />
            {form.role && (
              <button
                type="button"
                onClick={() => handleFieldChange('role', '')}
                className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Hapus teks"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {errors.role && (
            <p className="flex items-center gap-1.5 text-xs text-rose-500 font-medium mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.role}
            </p>
          )}

          {/* Role suggestion chips */}
          {activeChipField === 'role' && (
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-2 animate-in fade-in-50">
              <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300">
                Pilih atau klik peran untuk mengisi:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ROLE_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleFieldChange('role', chip)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FIELD 2: TASK */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[11px]">
                T
              </span>
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Task (Tugas Utama AI)</span>
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <button
              type="button"
              onClick={() => setActiveChipField(activeChipField === 'task' ? null : 'task')}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              {activeChipField === 'task' ? 'Tutup Saran' : 'Contoh Tugas'}
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={form.task}
              onChange={(e) => handleFieldChange('task', e.target.value)}
              placeholder="Contoh: Rancang 1 set Modul Ajar lengkap dengan asesmen diagnostik dan diferensiasi..."
              className={`w-full p-3 text-sm rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.task
                  ? 'border-rose-400 dark:border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 dark:border-slate-700 focus:border-blue-500'
              }`}
            />
            {form.task && (
              <button
                type="button"
                onClick={() => handleFieldChange('task', '')}
                className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Hapus teks"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {errors.task && (
            <p className="flex items-center gap-1.5 text-xs text-rose-500 font-medium mt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.task}
            </p>
          )}

          {/* Task suggestion chips */}
          {activeChipField === 'task' && (
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-2 animate-in fade-in-50">
              <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300">
                Pilih atau klik tugas untuk mengisi:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TASK_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleFieldChange('task', chip)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FIELD 3: CONTEXT */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[11px]">
                C
              </span>
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Context (Konteks / Latar Belakang)</span>
            </label>
            <button
              type="button"
              onClick={() => setActiveChipField(activeChipField === 'context' ? null : 'context')}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              {activeChipField === 'context' ? 'Tutup Saran' : 'Contoh Konteks'}
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={form.context}
              onChange={(e) => handleFieldChange('context', e.target.value)}
              placeholder="Contoh: Mata pelajaran Informatika Fase E (Kelas 10 SMK) materi Literasi Digital, waktu 2 x 45 menit..."
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {form.context && (
              <button
                type="button"
                onClick={() => handleFieldChange('context', '')}
                className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Hapus teks"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Context suggestion chips */}
          {activeChipField === 'context' && (
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-2 animate-in fade-in-50">
              <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300">
                Klik opsi untuk menambahkan ke konteks:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CONTEXT_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addChipValue('context', chip)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FIELD 4: LIMITATIONS */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              <span className="w-5 h-5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-[11px]">
                L
              </span>
              <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Limitations (Batasan & Format Output)</span>
            </label>
            <button
              type="button"
              onClick={() => setActiveChipField(activeChipField === 'limitations' ? null : 'limitations')}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              {activeChipField === 'limitations' ? 'Tutup Saran' : 'Contoh Batasan'}
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={form.limitations}
              onChange={(e) => handleFieldChange('limitations', e.target.value)}
              placeholder="Contoh: Sajikan dalam format tabel Markdown, gunakan bahasa formal dan lugas, maksimal 400 kata..."
              className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {form.limitations && (
              <button
                type="button"
                onClick={() => handleFieldChange('limitations', '')}
                className="absolute right-2.5 top-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Hapus teks"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Limitations suggestion chips */}
          {activeChipField === 'limitations' && (
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 space-y-2 animate-in fade-in-50">
              <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300">
                Klik opsi untuk menambahkan ke batasan:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_LIMITATIONS_CHIPS.map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addChipValue('limitations', chip)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors shadow-2xs"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-blue-200 animate-pulse" />
            <span>Generate Prompt RTCL</span>
          </button>
          <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2">
            💡 Tip: Prompt juga diperbarui secara otomatis di panel kanan saat Anda mengetik
          </p>
        </div>
      </form>
    </div>
  );
}
