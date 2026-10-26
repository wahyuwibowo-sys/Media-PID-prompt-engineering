import { RTCLForm, OutputFormat } from '../types/rtcl';

export function formatRTCLPrompt(form: RTCLForm, format: OutputFormat = 'standard_id'): string {
  const role = form.role.trim() || '[Tentukan Peran AI]';
  const task = form.task.trim() || '[Tentukan Tugas AI]';
  const context = form.context.trim() || '[Tentukan Konteks / Latar Belakang]';
  const limitations = form.limitations.trim() || '[Tentukan Batasan / Aturan Format]';

  // Make sure sentences end with proper punctuation if not empty
  const cleanRole = role.replace(/\.+$/, '');
  const cleanTask = task.endsWith('.') ? task : `${task}.`;
  const cleanContext = context.endsWith('.') ? context : `${context}.`;
  const cleanLimitations = limitations.endsWith('.') ? limitations : `${limitations}.`;

  switch (format) {
    case 'standard_id':
      return `PERAN (ROLE)
Bertindaklah sebagai ${cleanRole}.

TUGAS (TASK)
${cleanTask}

KONTEKS (CONTEXT)
${cleanContext}

BATASAN (LIMITATIONS)
${cleanLimitations}`;

    case 'markdown':
      return `# PANDUAN INSTRUKSI AI (METODE RTCL)

### 1. PERAN (ROLE)
> Bertindaklah sebagai **${cleanRole}**. Berikan perspektif mendalam dan kepakaran terbaik Anda di bidang ini.

### 2. TUGAS UTAMA (TASK)
${cleanTask}

### 3. KONTEKS & LATAR BELAKANG (CONTEXT)
${cleanContext}

### 4. BATASAN & FORMAT LUARAN (LIMITATIONS)
${cleanLimitations}
- Pastikan luaran terstruktur rapi, logis, dan langsung dapat diimplementasikan.`;

    case 'standard_en':
      return `ROLE:
Act as a seasoned ${cleanRole}.

TASK:
${cleanTask}

CONTEXT:
${cleanContext}

LIMITATIONS:
${cleanLimitations}`;

    case 'paragraph':
      return `Bertindaklah sebagai ${cleanRole}. Tugas Anda adalah: ${cleanTask} Konteks latar belakang: ${cleanContext} Harap patuhi batasan berikut: ${cleanLimitations}`;

    default:
      return `PERAN (ROLE)\nBertindaklah sebagai ${cleanRole}.\n\nTUGAS (TASK)\n${cleanTask}\n\nKONTEKS (CONTEXT)\n${cleanContext}\n\nBATASAN (LIMITATIONS)\n${cleanLimitations}`;
  }
}

export function calculateMetrics(text: string) {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Approximation: 1 token ≈ 4 characters for English / Indonesian mix
  const estimatedTokens = Math.ceil(charCount / 4);
  return { charCount, wordCount, estimatedTokens };
}

export function downloadPromptAsTxt(
  content: string, 
  filename?: string,
  studentInfo?: { name: string; className: string; attendanceNumber: string; schoolName: string; score?: number; grade?: string }
) {
  const timestamp = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let fullContent = content;

  if (studentInfo && studentInfo.name) {
    fullContent = `=======================================================
LEMBAR TUGAS PROMPT AI - METODE RTCL (SMART PROMPT)
=======================================================
Nama Siswa     : ${studentInfo.name}
Kelas / Jurusan: ${studentInfo.className}
No. Absen      : ${studentInfo.attendanceNumber || '-'}
Sekolah        : ${studentInfo.schoolName || 'SMK Negeri 1 Sidayu'}
Skor RTCL      : ${studentInfo.score !== undefined ? `${studentInfo.score}/100 (${studentInfo.grade || 'Baik'})` : '-'}
Tanggal Dibuat : ${timestamp}
=======================================================

${content}

-------------------------------------------------------
Catatan Guru / Pembimbing:

Catatan Tindak Lanjut:
=======================================================`;
  }

  const cleanStudentName = studentInfo?.name ? studentInfo.name.toLowerCase().replace(/[^a-z0-9]/g, '_') : '';
  const cleanBase = filename ? filename.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'rtcl_prompt';
  const fullFilename = cleanStudentName 
    ? `Tugas_RTCL_${cleanStudentName}_${studentInfo?.className?.replace(/[^a-z0-9]/gi, '_') || 'siswa'}.txt`
    : `${cleanBase}_${new Date().toISOString().slice(0, 10)}.txt`;

  const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fullFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
