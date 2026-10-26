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
  auditScore: RTCLAuditScore;
  timeSpentSeconds: number;
  timestamp: number;
  teacherNotes?: string;
  manualBonus?: number;
}
