import { ClassroomTopic, StudentScoreRecord, JurusanSMK } from '../types/classroom';
import { DEFAULT_CLASSROOM_TOPICS } from '../data/classroomTopics';
import { RTCLForm, RTCLAuditScore } from '../types/rtcl';

const GRADEBOOK_KEY = 'rtcl_classroom_gradebook_v1';
const CUSTOM_TOPICS_KEY = 'rtcl_classroom_custom_topics_v1';

// TOPICS MANAGEMENT
export function loadAllTopics(): ClassroomTopic[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TOPICS_KEY);
    const custom: ClassroomTopic[] = raw ? JSON.parse(raw) : [];
    return [...DEFAULT_CLASSROOM_TOPICS, ...custom];
  } catch (error) {
    console.error('Error loading topics:', error);
    return DEFAULT_CLASSROOM_TOPICS;
  }
}

export function saveCustomTopic(topic: Omit<ClassroomTopic, 'id' | 'isCustom'>): ClassroomTopic[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TOPICS_KEY);
    const existing: ClassroomTopic[] = raw ? JSON.parse(raw) : [];
    const newTopic: ClassroomTopic = {
      ...topic,
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isCustom: true
    };
    const updated = [newTopic, ...existing];
    localStorage.setItem(CUSTOM_TOPICS_KEY, JSON.stringify(updated));
    return [...DEFAULT_CLASSROOM_TOPICS, ...updated];
  } catch (error) {
    console.error('Error saving custom topic:', error);
    return DEFAULT_CLASSROOM_TOPICS;
  }
}

export function deleteCustomTopic(id: string): ClassroomTopic[] {
  try {
    const raw = localStorage.getItem(CUSTOM_TOPICS_KEY);
    const existing: ClassroomTopic[] = raw ? JSON.parse(raw) : [];
    const updated = existing.filter(t => t.id !== id);
    localStorage.setItem(CUSTOM_TOPICS_KEY, JSON.stringify(updated));
    return [...DEFAULT_CLASSROOM_TOPICS, ...updated];
  } catch (error) {
    console.error('Error deleting topic:', error);
    return DEFAULT_CLASSROOM_TOPICS;
  }
}

// GRADEBOOK MANAGEMENT
export function loadGradebook(): StudentScoreRecord[] {
  try {
    const raw = localStorage.getItem(GRADEBOOK_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error loading gradebook:', error);
    return [];
  }
}

export function recordStudentScore(
  studentName: string,
  className: string,
  jurusan: JurusanSMK,
  teamName: string | undefined,
  topicTitle: string,
  promptData: RTCLForm,
  auditScore: RTCLAuditScore,
  timeSpentSeconds: number,
  teamMembers?: string,
  teacherNotes?: string
): StudentScoreRecord[] {
  try {
    const current = loadGradebook();
    const newRecord: StudentScoreRecord = {
      id: `score_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentName: studentName.trim() || 'Ketua Kelompok',
      teamMembers: teamMembers?.trim(),
      teamName: teamName?.trim(),
      className: className.trim() || 'X APHPi 1',
      jurusan: jurusan || 'APHPi',
      topicTitle,
      promptData,
      auditScore,
      timeSpentSeconds,
      timestamp: Date.now(),
      teacherNotes
    };

    const updated = [newRecord, ...current];
    localStorage.setItem(GRADEBOOK_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error recording student score:', error);
    return [];
  }
}

export function updateTeacherNoteOrBonus(id: string, notes?: string, manualBonus?: number): StudentScoreRecord[] {
  try {
    const current = loadGradebook();
    const updated = current.map(item => {
      if (item.id === id) {
        return {
          ...item,
          teacherNotes: notes !== undefined ? notes : item.teacherNotes,
          manualBonus: manualBonus !== undefined ? manualBonus : item.manualBonus
        };
      }
      return item;
    });
    localStorage.setItem(GRADEBOOK_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error updating note:', error);
    return [];
  }
}

export function deleteScoreRecord(id: string): StudentScoreRecord[] {
  try {
    const current = loadGradebook();
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem(GRADEBOOK_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error deleting score record:', error);
    return [];
  }
}

export function clearAllGradebook(): void {
  try {
    localStorage.removeItem(GRADEBOOK_KEY);
  } catch (error) {
    console.error('Error clearing gradebook:', error);
  }
}

// EXPORT TO CSV (Supports Excel Semicolon ; and Google Sheets Comma ,)
export interface CSVExportOptions {
  jurusanFilter?: string;
  classFilter?: string;
  delimiter?: ';' | ',';
}

export function exportGradebookToCSV(
  records: StudentScoreRecord[], 
  options: CSVExportOptions = {}
) {
  const { jurusanFilter = 'Semua', classFilter = 'Semua', delimiter = ';' } = options;

  const filtered = records.filter(r => {
    const matchJurusan = jurusanFilter === 'Semua' || r.jurusan === jurusanFilter;
    const matchClass = classFilter === 'Semua' || r.className === classFilter;
    return matchJurusan && matchClass;
  });

  const headers = [
    'No',
    'Ketua Kelompok (Tampil)',
    'Anggota Kelompok',
    'Tim Regu',
    'Jurusan',
    'Kelas',
    'Topik Tantangan RTCL',
    'Skor Role (Maks 25)',
    'Skor Task (Maks 25)',
    'Skor Context (Maks 25)',
    'Skor Limitations (Maks 25)',
    'Total Skor RTCL (0-100)',
    'Bonus Keaktifan Guru',
    'Nilai Akhir',
    'Predikat Kualitas',
    'Waktu Pengerjaan (Detik)',
    'Catatan Evaluasi Guru',
    'Tanggal dan Jam'
  ];

  const escapeCSV = (val: any) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = filtered.map((rec, index) => {
    const finalScore = Math.min(100, rec.auditScore.totalScore + (rec.manualBonus || 0));
    const dateFormatted = new Date(rec.timestamp).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return [
      index + 1,
      escapeCSV(rec.studentName),
      escapeCSV(rec.teamMembers || '-'),
      escapeCSV(rec.teamName || '-'),
      escapeCSV(rec.jurusan || 'APHPi'),
      escapeCSV(rec.className),
      escapeCSV(rec.topicTitle),
      rec.auditScore.roleScore,
      rec.auditScore.taskScore,
      rec.auditScore.contextScore,
      rec.auditScore.limitationsScore,
      rec.auditScore.totalScore,
      rec.manualBonus || 0,
      finalScore,
      escapeCSV(rec.auditScore.grade),
      rec.timeSpentSeconds,
      escapeCSV(rec.teacherNotes || '-'),
      escapeCSV(dateFormatted)
    ].join(delimiter);
  });

  // Include UTF-8 BOM (\uFEFF) so Excel on Windows parses special characters, Indonesian letters, and commas perfectly
  const csvContent = '\uFEFF' + [headers.join(delimiter), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const cleanJurusan = jurusanFilter !== 'Semua' ? `_${jurusanFilter}` : '';
  const cleanClass = classFilter !== 'Semua' ? `_${classFilter.replace(/[^a-z0-9]/gi, '_')}` : '';
  const dateStr = new Date().toISOString().slice(0, 10);
  
  link.href = url;
  link.download = `Rekap_Nilai_RTCL${cleanJurusan}${cleanClass}_${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
