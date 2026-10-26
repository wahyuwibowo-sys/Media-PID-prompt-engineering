import { useState } from 'react';
import { 
  GraduationCap, 
  User, 
  School, 
  Award, 
  ChevronRight, 
  Target, 
  Sparkles,
  Edit3,
  Check,
  Printer
} from 'lucide-react';
import { StudentProfile, RTCLAuditScore } from '../types/rtcl';
import { SMK_CLASSES } from '../data/classrooms';

interface ClassroomBannerProps {
  isStudentMode: boolean;
  onToggleStudentMode: (enabled: boolean) => void;
  studentProfile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onOpenChallenges: () => void;
  auditScore: RTCLAuditScore;
}

export function ClassroomBanner({
  isStudentMode,
  onToggleStudentMode,
  studentProfile,
  onUpdateProfile,
  onOpenChallenges,
  auditScore
}: ClassroomBannerProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempProfile, setTempProfile] = useState<StudentProfile>(studentProfile);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(tempProfile);
    setIsEditingProfile(false);
  };

  const handlePrintLKPD = () => {
    window.print();
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side: Mode toggle and student indicator */}
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                Mode Pembelajaran Kelas: Siswa & Guru
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isStudentMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {isStudentMode ? 'Mode Siswa Aktif' : 'Mode Bebas'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {isStudentMode
                ? 'Siswa mempraktikkan penyusunan prompt terstruktur dengan penilaian rubrik otomatis'
                : 'Aktifkan untuk memberikan tugas terstruktur dengan identitas siswa dan penilaian rubrik'}
            </p>
          </div>
        </div>

        {/* Right side: Action controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Toggle Button */}
          <button
            onClick={() => onToggleStudentMode(!isStudentMode)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              isStudentMode
                ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                : 'bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-xs'
            }`}
          >
            {isStudentMode ? 'Beralih ke Mode Umum' : 'Aktifkan Mode Kelas / Siswa'}
          </button>

          {isStudentMode && (
            <>
              {/* Tantangan Praktik LKPD Button */}
              <button
                onClick={onOpenChallenges}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Target className="w-3.5 h-3.5 text-amber-300" />
                <span>Pilih Tantangan Tugas LKPD</span>
              </button>

              <button
                onClick={handlePrintLKPD}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
                title="Cetak Halaman / Cetak LKPD"
              >
                <Printer className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Student Identity Drawer/Bar when in Student Mode */}
      {isStudentMode && (
        <div className="mt-4 pt-3.5 border-t border-blue-200/60 dark:border-slate-800">
          {!isEditingProfile ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/70 dark:bg-slate-800/60 p-3 rounded-xl border border-blue-100 dark:border-slate-700/80">
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1.5 font-bold">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Nama: {studentProfile.name || <span className="text-amber-600 underline font-normal">(Klik Edit untuk mengisi nama siswa)</span>}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">•</span>
                  <span>Kelas: <strong>{studentProfile.className || 'X RPL 1'}</strong></span>
                </div>
                {studentProfile.attendanceNumber && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">•</span>
                    <span>No. Absen: <strong>{studentProfile.attendanceNumber}</strong></span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">•</span>
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  <span>{studentProfile.schoolName || 'SMK Negeri 1 Sidayu'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Nilai Prompt:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                    auditScore.totalScore >= 85 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {auditScore.totalScore}/100
                  </span>
                </div>

                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Ubah Identitas</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-blue-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Lengkapi Identitas Siswa Pengumpul Tugas:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Kelas (Pilih Auto) *
                  </label>
                  <select
                    required
                    value={tempProfile.className}
                    onChange={(e) => setTempProfile({ ...tempProfile, className: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-blue-700 dark:text-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    {SMK_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Nomor Absen
                  </label>
                  <input
                    type="text"
                    value={tempProfile.attendanceNumber}
                    onChange={(e) => setTempProfile({ ...tempProfile, attendanceNumber: e.target.value })}
                    placeholder="Contoh: 12"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Nama Sekolah
                  </label>
                  <input
                    type="text"
                    value={tempProfile.schoolName}
                    onChange={(e) => setTempProfile({ ...tempProfile, schoolName: e.target.value })}
                    placeholder="SMK Negeri 1 Sidayu"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simpan Identitas</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
