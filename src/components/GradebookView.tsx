import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  Trophy, 
  Award, 
  Clock, 
  Trash2, 
  Edit3, 
  Check, 
  Eye, 
  RotateCcw, 
  UserCheck, 
  Users, 
  Layers, 
  BookOpen, 
  X,
  PlusCircle,
  Copy,
  Sparkles
} from 'lucide-react';
import { StudentScoreRecord, JurusanSMK } from '../types/classroom';
import { SMK_CLASSES } from '../data/classrooms';
import { 
  exportGradebookToCSV, 
  updateTeacherNoteOrBonus, 
  deleteScoreRecord, 
  clearAllGradebook,
  recordStudentScore
} from '../utils/classroomDb';

interface GradebookViewProps {
  records: StudentScoreRecord[];
  onRefreshRecords: (records: StudentScoreRecord[]) => void;
  onNotice: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  onGoToArena: () => void;
  onGoToLKPD: () => void;
}

export function GradebookView({
  records,
  onRefreshRecords,
  onNotice,
  onGoToArena,
  onGoToLKPD
}: GradebookViewProps) {
  // Filters
  const [selectedJurusan, setSelectedJurusan] = useState<string>('Semua');
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [delimiter, setDelimiter] = useState<';' | ','>(';');

  // Inspect Modal
  const [inspectRecord, setInspectRecord] = useState<StudentScoreRecord | null>(null);

  // Edit Inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editBonus, setEditBonus] = useState<number>(0);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchJurusan = selectedJurusan === 'Semua' || r.jurusan === selectedJurusan;
      const matchClass = selectedClass === 'Semua' || r.className === selectedClass;
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        r.studentName.toLowerCase().includes(q) ||
        (r.teamMembers && r.teamMembers.toLowerCase().includes(q)) ||
        (r.teamName && r.teamName.toLowerCase().includes(q)) ||
        r.topicTitle.toLowerCase().includes(q);
      return matchJurusan && matchClass && matchSearch;
    });
  }, [records, selectedJurusan, selectedClass, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    if (filteredRecords.length === 0) {
      return { total: 0, avg: 0, highest: 0, masterCount: 0 };
    }
    const total = filteredRecords.length;
    let sum = 0;
    let max = 0;
    let master = 0;
    filteredRecords.forEach((r) => {
      const finalScore = Math.min(100, r.auditScore.totalScore + (r.manualBonus || 0));
      sum += finalScore;
      if (finalScore > max) max = finalScore;
      if (finalScore >= 85) master++;
    });
    return {
      total,
      avg: Math.round(sum / total),
      highest: max,
      masterCount: master
    };
  }, [filteredRecords]);

  // Export CSV
  const handleExportCSV = () => {
    if (records.length === 0) {
      onNotice('Data Masih Kosong', 'Belum ada rekaman nilai untuk diekspor.', 'warning');
      return;
    }
    exportGradebookToCSV(records, {
      jurusanFilter: selectedJurusan,
      classFilter: selectedClass,
      delimiter: delimiter
    });
    onNotice(
      'File CSV Berhasil Diunduh',
      `Data nilai (${filteredRecords.length} siswa/kelompok) siap dibuka di Microsoft Excel atau Google Sheets.`,
      'success'
    );
  };

  // Start Edit
  const handleStartEdit = (record: StudentScoreRecord) => {
    setEditingId(record.id);
    setEditNotes(record.teacherNotes || '');
    setEditBonus(record.manualBonus || 0);
  };

  // Save Edit
  const handleSaveEdit = (id: string) => {
    const updated = updateTeacherNoteOrBonus(id, editNotes, editBonus);
    onRefreshRecords(updated);
    setEditingId(null);
    onNotice('Catatan Disimpan', 'Catatan guru dan bonus nilai berhasil diperbarui.', 'success');
  };

  // Delete Record
  const handleDeleteItem = (id: string) => {
    if (window.confirm('Hapus baris rekaman nilai ini dari database?')) {
      const updated = deleteScoreRecord(id);
      onRefreshRecords(updated);
      onNotice('Data Dihapus', 'Satu baris nilai telah dihapus.', 'info');
    }
  };

  // Clear All
  const handleClearAll = () => {
    if (window.confirm('PERINGATAN GURU: Yakin ingin mengosongkan SELURUH rekaman database nilai kelas? Tindakan ini tidak dapat dibatalkan.')) {
      clearAllGradebook();
      onRefreshRecords([]);
      onNotice('Database Dikosongkan', 'Seluruh rekaman nilai telah dibersihkan.', 'warning');
    }
  };

  // Copy Prompt to Clipboard
  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    onNotice('Prompt Disalin', 'Teks prompt berhasil disalin ke clipboard.', 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-800 via-blue-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-xs font-bold text-blue-200 mb-2 border border-white/20">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Database & Rekapitulasi Nilai Siswa</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight">
            Rekap Nilai Prompt Engineering (RTCL)
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
            Data penilaian otomatis dari <strong>Arena Papan Tulis Interaktif</strong> dan <strong>LKPD Mandiri</strong>. 
            Tersimpan langsung di memori browser dan dapat diekspor ke Microsoft Excel atau Google Sheets.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor File CSV ({delimiter === ';' ? 'Excel' : 'Google Sheets'})</span>
          </button>

          <button
            onClick={onGoToArena}
            className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md active:scale-95 transition-all flex items-center gap-2"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Nilai di Papan Tulis</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Total Rekaman</span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.total} Siswa / Regu</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Rata-Rata Nilai</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.avg} / 100</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Nilai Tertinggi</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.highest} / 100</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Predikat Master (≥85)</span>
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{stats.masterCount} Kelompok</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama ketua, anggota, atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Jurusan */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Jurusan:</span>
            <select
              value={selectedJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua Jurusan</option>
              <option value="APHPi">APHPi (Perikanan)</option>
              <option value="TKJ">TKJ (Komputer Jaringan)</option>
              <option value="TKR">TKR (Otomotif)</option>
              <option value="TITL">TITL (Listrik)</option>
            </select>
          </div>

          {/* Filter Kelas */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500">Kelas:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua 11 Kelas</option>
              {SMK_CLASSES.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Options: Delimiter & Clear DB */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => setDelimiter(';')}
              className={`px-2 py-1 rounded-lg ${delimiter === ';' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-2xs' : 'text-slate-500'}`}
              title="Pemisah Titik Koma (Standar Excel Regional Indonesia)"
            >
              Excel (;)
            </button>
            <button
              onClick={() => setDelimiter(',')}
              className={`px-2 py-1 rounded-lg ${delimiter === ',' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-2xs' : 'text-slate-500'}`}
              title="Pemisah Koma (Standar Google Sheets & US)"
            >
              Sheets (,)
            </button>
          </div>

          {records.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
              title="Kosongkan Semua Data Nilai"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold">
                <th className="py-3.5 px-4 text-center w-12">No</th>
                <th className="py-3.5 px-4 min-w-44">Ketua (Tampil) & Anggota</th>
                <th className="py-3.5 px-3 min-w-28">Regu / Tim</th>
                <th className="py-3.5 px-3 min-w-24">Kelas</th>
                <th className="py-3.5 px-3 min-w-48">Topik Tantangan RTCL</th>
                <th className="py-3.5 px-2 text-center" title="Role (0-25)">R</th>
                <th className="py-3.5 px-2 text-center" title="Task (0-25)">T</th>
                <th className="py-3.5 px-2 text-center" title="Context (0-25)">C</th>
                <th className="py-3.5 px-2 text-center" title="Limitations (0-25)">L</th>
                <th className="py-3.5 px-3 text-center min-w-20">Total RTCL</th>
                <th className="py-3.5 px-2 text-center">Bonus</th>
                <th className="py-3.5 px-3 text-center min-w-20">Nilai Akhir</th>
                <th className="py-3.5 px-3 min-w-28">Predikat</th>
                <th className="py-3.5 px-3 text-center min-w-28">Aksi Guru</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="max-w-md mx-auto space-y-3">
                      <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto stroke-1" />
                      <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                        Belum Ada Data Nilai yang Cocok
                      </h4>
                      <p className="text-xs">
                        Silakan buka <strong>Arena Papan Tulis</strong> untuk memulai lomba murid di IFP atau <strong>LKPD Mandiri</strong> untuk memasukkan tugas siswa.
                      </p>
                      <button
                        onClick={onGoToArena}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        Buka Arena Papan Tulis
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec, index) => {
                  const finalScore = Math.min(100, rec.auditScore.totalScore + (rec.manualBonus || 0));
                  const isEditing = editingId === rec.id;

                  return (
                    <tr 
                      key={rec.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-bold text-slate-500">
                        {index + 1}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{rec.studentName}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                            Ketua
                          </span>
                        </div>
                        {rec.teamMembers ? (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1" title={rec.teamMembers}>
                            Anggota: {rec.teamMembers}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 italic">Anggota: -</div>
                        )}
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                        {rec.teamName || '-'}
                      </td>

                      <td className="py-3 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-extrabold text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {rec.className}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1" title={rec.topicTitle}>
                          {rec.topicTitle}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{new Date(rec.timestamp).toLocaleDateString('id-ID')}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {rec.timeSpentSeconds}s
                          </span>
                        </div>
                      </td>

                      {/* RTCL Components Breakdown */}
                      <td className="py-3 px-2 text-center font-bold text-blue-600 dark:text-blue-400">
                        {rec.auditScore.roleScore}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-indigo-600 dark:text-indigo-400">
                        {rec.auditScore.taskScore}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-teal-600 dark:text-teal-400">
                        {rec.auditScore.contextScore}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-amber-600 dark:text-amber-400">
                        {rec.auditScore.limitationsScore}
                      </td>

                      {/* Total RTCL */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">
                          {rec.auditScore.totalScore}
                        </span>
                      </td>

                      {/* Bonus Guru */}
                      <td className="py-3 px-2 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={editBonus}
                            onChange={(e) => setEditBonus(Number(e.target.value))}
                            className="w-12 px-1 py-0.5 text-center text-xs border rounded-sm bg-white dark:bg-slate-800"
                          />
                        ) : (
                          <span className={`text-xs font-bold ${rec.manualBonus ? 'text-emerald-600' : 'text-slate-400'}`}>
                            +{rec.manualBonus || 0}
                          </span>
                        )}
                      </td>

                      {/* Final Score */}
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-xl font-black text-xs ${
                          finalScore >= 85
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : finalScore >= 70
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {finalScore}
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="py-3 px-3">
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                          {rec.auditScore.grade}
                        </span>
                        {rec.teacherNotes && !isEditing && (
                          <div className="text-[11px] text-slate-500 italic line-clamp-1 mt-0.5" title={rec.teacherNotes}>
                            Catatan: {rec.teacherNotes}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Inspect Prompt & AI Result */}
                          <button
                            onClick={() => setInspectRecord(rec)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                            title="Lihat Prompt Lengkap & Hasil Generatif AI Murid"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Edit note / bonus */}
                          {isEditing ? (
                            <button
                              onClick={() => handleSaveEdit(rec.id)}
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                              title="Simpan Catatan"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(rec)}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Edit Catatan & Bonus Guru"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete record */}
                          <button
                            onClick={() => handleDeleteItem(rec.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                            title="Hapus Nilai"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Prompt & AI Result Modal */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                    Detail Prompt RTCL & Hasil AI Murid
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Siswa/Ketua: <strong>{inspectRecord.studentName}</strong> • Kelas: <strong>{inspectRecord.className}</strong> ({inspectRecord.jurusan})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Score Breakdown Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex flex-col items-center justify-center font-black">
                    <span className="text-lg leading-none">{inspectRecord.auditScore.totalScore}</span>
                    <span className="text-[9px] uppercase">Poin</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Predikat: {inspectRecord.auditScore.grade}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Topik: {inspectRecord.topicTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg">R: {inspectRecord.auditScore.roleScore}</span>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg">T: {inspectRecord.auditScore.taskScore}</span>
                  <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-lg">C: {inspectRecord.auditScore.contextScore}</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg">L: {inspectRecord.auditScore.limitationsScore}</span>
                </div>
              </div>

              {/* 1. Prompt RTCL yang Disusun Murid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    1. Prompt RTCL yang Disusun Murid:
                  </h4>
                  <button
                    onClick={() => handleCopyPrompt(inspectRecord.compiledPrompt || '')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Prompt</span>
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed whitespace-pre-wrap border border-slate-700">
                  {inspectRecord.compiledPrompt || `PERAN: ${inspectRecord.promptData.role}\nTUGAS: ${inspectRecord.promptData.task}\nKONTEKS: ${inspectRecord.promptData.context}\nBATASAN: ${inspectRecord.promptData.limitations}`}
                </div>
              </div>

              {/* 2. Hasil Respons AI Generatif */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>2. Hasil Generatif AI (Luaran yang Diperoleh):</span>
                </h4>
                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-950/80 border border-emerald-300 dark:border-emerald-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {inspectRecord.aiResponse || 'Hasil AI Generatif tersimpan otomatis saat pengujian simulasi prompt murid.'}
                </div>
              </div>

              {/* Anggota Kelompok Details */}
              {inspectRecord.teamMembers && (
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <strong>Anggota Kelompok Lengkap:</strong> {inspectRecord.teamMembers}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setInspectRecord(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold hover:bg-slate-300"
              >
                Tutup Tampilan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
