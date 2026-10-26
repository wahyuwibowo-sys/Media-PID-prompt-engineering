import { useState, useMemo } from 'react';
import { 
  X, 
  Trophy, 
  FileSpreadsheet, 
  Trash2, 
  Printer, 
  Edit3, 
  Check, 
  Search, 
  Download, 
  Award, 
  Clock, 
  User, 
  Filter,
  BarChart3,
  Star
} from 'lucide-react';
import { StudentScoreRecord } from '../types/classroom';
import { exportGradebookToCSV, updateTeacherNoteOrBonus, deleteScoreRecord, clearAllGradebook } from '../utils/classroomDb';
import { JurusanSMK } from '../types/classroom';

interface GradebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: StudentScoreRecord[];
  onRefreshRecords: (records: StudentScoreRecord[]) => void;
  onNotice: (title: string, message: string) => void;
}

export function GradebookModal({
  isOpen,
  onClose,
  records,
  onRefreshRecords,
  onNotice
}: GradebookModalProps) {
  const [selectedJurusan, setSelectedJurusan] = useState<string>('Semua');
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [delimiter, setDelimiter] = useState<';' | ','>(';'); // Semicolon by default for Indonesian Excel
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editBonus, setEditBonus] = useState<number>(0);

  if (!isOpen) return null;

  // Extract unique classes
  const classes = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.className) set.add(r.className);
    });
    return Array.from(set);
  }, [records]);

  // Filter records by Jurusan, Class, and Search
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchJurusan = selectedJurusan === 'Semua' || r.jurusan === selectedJurusan;
      const matchClass = selectedClass === 'Semua' || r.className === selectedClass;
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        r.studentName.toLowerCase().includes(q) ||
        (r.teamName && r.teamName.toLowerCase().includes(q)) ||
        r.topicTitle.toLowerCase().includes(q);
      return matchJurusan && matchClass && matchSearch;
    });
  }, [records, selectedJurusan, selectedClass, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredRecords.length === 0) return { avg: 0, highest: 0, total: 0 };
    const total = filteredRecords.length;
    let sum = 0;
    let max = 0;
    filteredRecords.forEach(r => {
      const finalScore = Math.min(100, r.auditScore.totalScore + (r.manualBonus || 0));
      sum += finalScore;
      if (finalScore > max) max = finalScore;
    });
    return {
      avg: Math.round(sum / total),
      highest: max,
      total
    };
  }, [filteredRecords]);

  const handleExportCSV = () => {
    exportGradebookToCSV(records, {
      jurusanFilter: selectedJurusan,
      classFilter: selectedClass,
      delimiter: delimiter
    });
    onNotice(
      'File CSV Berhasil Diunduh', 
      `Data nilai (${selectedJurusan !== 'Semua' ? `Jurusan ${selectedJurusan}, ` : ''}${filteredRecords.length} siswa) siap dibuka di Microsoft Excel atau Google Sheets.`
    );
  };

  const handleStartEdit = (record: StudentScoreRecord) => {
    setEditingId(record.id);
    setEditNotes(record.teacherNotes || '');
    setEditBonus(record.manualBonus || 0);
  };

  const handleSaveEdit = (id: string) => {
    const updated = updateTeacherNoteOrBonus(id, editNotes, editBonus);
    onRefreshRecords(updated);
    setEditingId(null);
    onNotice('Catatan Disimpan', 'Nilai bonus dan catatan guru berhasil diperbarui.');
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Hapus baris nilai ini dari database?')) {
      const updated = deleteScoreRecord(id);
      onRefreshRecords(updated);
      onNotice('Data Dihapus', 'Satu rekaman nilai telah dihapus.');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mengosongkan SELURUH data rekapitulasi nilai kelas?')) {
      clearAllGradebook();
      onRefreshRecords([]);
      onNotice('Database Dikosongkan', 'Seluruh rekaman nilai telah dibersihkan.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-slate-950 shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                Database & Rekapitulasi Nilai Siswa (Papan Tulis)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Perekaman skor kompetisi menyusun prompt RTCL kelas secara langsung
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls & Statistics Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
          {/* Jurusan Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase mr-1">Jurusan:</span>
              {['Semua', 'APHPi', 'TKJ', 'TKR', 'TITL', 'Umum / P5'].map((j) => (
                <button
                  key={j}
                  onClick={() => setSelectedJurusan(j)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedJurusan === j
                      ? j === 'APHPi'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : j === 'TKJ'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : j === 'TKR'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : j === 'TITL'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {j}
                </button>
              ))}
            </div>

            {/* Delimiter Selector (Excel vs Sheets) */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-[11px] font-medium text-slate-500">Format CSV:</span>
              <button
                onClick={() => setDelimiter(';')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  delimiter === ';' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
                title="Pemisah Titik Koma (;) - Rekomendasi untuk Microsoft Excel Indonesia"
              >
                Excel (;)
              </button>
              <button
                onClick={() => setDelimiter(',')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  delimiter === ',' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
                title="Pemisah Koma (,) - Rekomendasi untuk Google Sheets"
              >
                Sheets (,)
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter class & search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                <Filter className="w-3.5 h-3.5" />
                <span>Kelas:</span>
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              >
                <option value="Semua">Semua Kelas ({records.length})</option>
                {classes.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama siswa / topik..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Export & Print actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                title="Ekspor ke Excel / CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Unduh File CSV ({filteredRecords.length})</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                title="Cetak Rekap Nilai"
              >
                <Printer className="w-4 h-4" />
              </button>

              {records.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Hapus Seluruh Database Nilai"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats Chips */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <User className="w-3.5 h-3.5 text-blue-500" />
              Total Peserta Terdata: <strong>{stats.total}</strong>
            </span>
            <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
              Rata-rata Skor: <strong>{stats.avg}/100</strong>
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              Skor Tertinggi: <strong>{stats.highest}/100</strong>
            </span>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-5">
          {filteredRecords.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Trophy className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
                Belum ada rekaman nilai di database
              </p>
              <p className="text-xs max-w-sm mx-auto">
                Mulai sesi kompetisi di papan tulis interaktif dan tekan tombol <strong>&quot;Kirim &amp; Rekap Nilai&quot;</strong> saat siswa selesai!
              </p>
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3 w-12 text-center">Peringkat</th>
                    <th className="p-3">Nama Siswa / Tim</th>
                    <th className="p-3">Jurusan</th>
                    <th className="p-3">Kelas</th>
                    <th className="p-3">Topik Tantangan</th>
                    <th className="p-3 text-center">R / T / C / L</th>
                    <th className="p-3 text-center">Skor Akhir</th>
                    <th className="p-3">Catatan Guru</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredRecords.map((rec, index) => {
                    const finalScore = Math.min(100, rec.auditScore.totalScore + (rec.manualBonus || 0));
                    const isTopThree = index < 3;
                    const isEditing = editingId === rec.id;

                    const getJurusanBadgeColor = (j: string) => {
                      switch (j) {
                        case 'APHPi': return 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700';
                        case 'TKJ': return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700';
                        case 'TKR': return 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700';
                        case 'TITL': return 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
                        default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300';
                      }
                    };

                    return (
                      <tr 
                        key={rec.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        {/* Rank */}
                        <td className="p-3 text-center font-extrabold">
                          {isTopThree ? (
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                              index === 0
                                ? 'bg-amber-400 text-slate-950 shadow-sm'
                                : index === 1
                                ? 'bg-slate-300 text-slate-900 shadow-sm'
                                : 'bg-amber-600 text-white shadow-sm'
                            }`}>
                              {index + 1}
                            </span>
                          ) : (
                            <span className="text-slate-400">{index + 1}</span>
                          )}
                        </td>

                        {/* Student / Team */}
                        <td className="p-3">
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                            {rec.studentName}
                          </div>
                          {rec.teamName && (
                            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                              {rec.teamName}
                            </div>
                          )}
                        </td>

                        {/* Jurusan Badge */}
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${getJurusanBadgeColor(rec.jurusan || 'TKJ')}`}>
                            {rec.jurusan || 'TKJ'}
                          </span>
                        </td>

                        {/* Class */}
                        <td className="p-3 font-semibold text-slate-600 dark:text-slate-300">
                          {rec.className}
                        </td>

                        {/* Topic */}
                        <td className="p-3 max-w-[200px]">
                          <div className="font-medium text-slate-800 dark:text-slate-200 truncate" title={rec.topicTitle}>
                            {rec.topicTitle}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Waktu: {rec.timeSpentSeconds}s • {new Date(rec.timestamp).toLocaleDateString('id-ID')}
                          </div>
                        </td>

                        {/* R/T/C/L scores */}
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center gap-1 text-[11px] font-mono">
                            <span className="px-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300" title="Role">
                              {rec.auditScore.roleScore}
                            </span>
                            <span className="px-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300" title="Task">
                              {rec.auditScore.taskScore}
                            </span>
                            <span className="px-1 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300" title="Context">
                              {rec.auditScore.contextScore}
                            </span>
                            <span className="px-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" title="Limitations">
                              {rec.auditScore.limitationsScore}
                            </span>
                          </div>
                        </td>

                        {/* Total Score */}
                        <td className="p-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                              finalScore >= 85
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : finalScore >= 70
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {finalScore} / 100
                            </span>
                            {rec.manualBonus ? (
                              <span className="text-[10px] text-emerald-600 font-bold mt-0.5">
                                (+{rec.manualBonus} Bonus)
                              </span>
                            ) : null}
                          </div>
                        </td>

                        {/* Teacher Notes / Inline Edit */}
                        <td className="p-3">
                          {isEditing ? (
                            <div className="space-y-1.5 min-w-[160px]">
                              <input
                                type="text"
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                placeholder="Catatan keaktifan..."
                                className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                              />
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-500">Bonus:</span>
                                <input
                                  type="number"
                                  min={0}
                                  max={20}
                                  value={editBonus}
                                  onChange={(e) => setEditBonus(Number(e.target.value))}
                                  className="w-14 px-1.5 py-0.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                                />
                                <button
                                  onClick={() => handleSaveEdit(rec.id)}
                                  className="p-1 rounded bg-emerald-600 text-white"
                                  title="Simpan"
                                >
                                  <Check className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-[11px] text-slate-600 dark:text-slate-300">
                              {rec.teacherNotes || <span className="text-slate-400 italic">-</span>}
                            </div>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            {!isEditing && (
                              <button
                                onClick={() => handleStartEdit(rec)}
                                className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                                title="Beri catatan / bonus nilai"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteItem(rec.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                              title="Hapus rekaman nilai"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Database tersimpan lokal di peramban papan tulis sekolah (SMKN 1 Sidayu).
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white rounded-xl shadow-xs"
          >
            Tutup Rekapitulasi
          </button>
        </div>
      </div>
    </div>
  );
}
