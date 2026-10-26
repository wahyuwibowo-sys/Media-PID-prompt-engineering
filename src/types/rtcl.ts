export interface RTCLForm {
  role: string;
  task: string;
  context: string;
  limitations: string;
  customTitle?: string;
}

export interface StudentProfile {
  name: string;
  className: string;
  attendanceNumber: string;
  schoolName: string;
}

export interface RTCLAuditScore {
  roleScore: number;
  taskScore: number;
  contextScore: number;
  limitationsScore: number;
  totalScore: number; // 0 - 100
  grade: 'Perlu Perbaikan' | 'Cukup' | 'Baik' | 'Sangat Baik (Master)';
  feedback: {
    role: string[];
    task: string[];
    context: string[];
    limitations: string[];
  };
}

export interface StudentChallenge {
  id: string;
  title: string;
  subject: string;
  scenario: string;
  goal: string;
  sampleRole: string;
  sampleTask: string;
  sampleContext: string;
  sampleLimitations: string;
}

export type OutputFormat = 'standard_id' | 'markdown' | 'paragraph' | 'standard_en';

export type TemplateCategory = 
  | 'Pendidikan'
  | 'Guru'
  | 'Kepala Sekolah'
  | 'Supervisi Akademik'
  | 'Pembelajaran Mendalam'
  | 'Marketing'
  | 'Konten Kreator'
  | 'Programmer'
  | 'Tugas Siswa'
  | 'APHPi (Hasil Perikanan)'
  | 'TKJ (Jaringan)'
  | 'TKR (Otomotif)'
  | 'TITL (Listrik)';

export interface RTCLTemplate {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  iconName: string;
  data: RTCLForm;
}

export interface PromptHistoryItem {
  id: string;
  timestamp: number;
  data: RTCLForm;
  format: OutputFormat;
  preview: string;
  categoryTag?: string;
  studentName?: string;
}
