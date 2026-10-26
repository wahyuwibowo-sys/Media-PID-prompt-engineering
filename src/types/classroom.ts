import { RTCLForm, RTCLAuditScore } from './rtcl';

export type JurusanSMK = 'APHPi' | 'TKJ' | 'TKR' | 'TITL' | 'Umum / P5';

export interface ClassroomTopic {
  id: string;
  title: string;
  jurusan: JurusanSMK;
  category: string;
  description: string;
  challengeGoal: string;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan Tinggi';
  isCustom?: boolean;
}

export interface StudentScoreRecord {
  id: string;
  studentName: string; // Ketua Kelompok / Peserta
  teamMembers?: string; // Anggota kelompok
  teamName?: string;
  className: string;
  jurusan: JurusanSMK;
  topicTitle: string;
  promptData: RTCLForm;
  compiledPrompt?: string; // Teks lengkap prompt RTCL yang dihasilkan
  aiResponse?: string;     // Hasil respons AI generatif yang diperoleh murid
  auditScore: RTCLAuditScore;
  timeSpentSeconds: number;
  timestamp: number;
  teacherNotes?: string;
  manualBonus?: number;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: {
    key: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  targetConcept: 'Role' | 'Task' | 'Context' | 'Limitations' | 'Halusinasi AI';
}
