import { RTCLForm, RTCLAuditScore } from '../types/rtcl';

export function evaluateRTCLPrompt(form: RTCLForm): RTCLAuditScore {
  const role = form.role.trim();
  const task = form.task.trim();
  const context = form.context.trim();
  const limitations = form.limitations.trim();

  let roleScore = 0;
  let taskScore = 0;
  let contextScore = 0;
  let limitationsScore = 0;

  const feedback = {
    role: [] as string[],
    task: [] as string[],
    context: [] as string[],
    limitations: [] as string[]
  };

  // 1. EVALUASI ROLE (Bobot 25 poin)
  if (!role) {
    feedback.role.push('Peran (Role) masih kosong. Tentukan keahlian AI (misal: "Ahli Jaringan Komputer" atau "Guru Penggerak").');
  } else {
    roleScore += 10;
    if (role.length >= 15) {
      roleScore += 8;
    } else {
      feedback.role.push('Peran terlalu singkat. Tambahkan spesialisasi atau tingkat pengalaman.');
    }

    const expertKeywords = [
      'ahli', 'spesialis', 'guru', 'instruktur', 'engineer', 'supervisor', 
      'konsultan', 'praktisi', 'profesional', 'pengawas', 'manajer', 'arsitek', 'penulis', 'kepala'
    ];
    const hasExpertKeyword = expertKeywords.some(kw => role.toLowerCase().includes(kw));
    if (hasExpertKeyword) {
      roleScore += 7;
    } else {
      feedback.role.push('Saran: Tambahkan kata kualifikasi seperti "Spesialis...", "Praktisi Senior...", atau "Ahli...".');
    }
  }

  // 2. EVALUASI TASK (Bobot 25 poin)
  if (!task) {
    feedback.task.push('Tugas (Task) belum diisi. Tuliskan instruksi yang harus dilakukan AI.');
  } else {
    taskScore += 10;
    if (task.length >= 25) {
      taskScore += 8;
    } else {
      feedback.task.push('Tugas masih singkat. Jelaskan hasil akhir yang spesifik (misal: draf laporan, butir soal, skenario).');
    }

    const actionVerbs = [
      'buat', 'susun', 'rancang', 'analisis', 'tulis', 'identifikasi', 
      'jelaskan', 'evaluasi', 'kembangkan', 'formulasikan', 'bandingkan', 'simulasikan'
    ];
    const hasActionVerb = actionVerbs.some(verb => task.toLowerCase().includes(verb));
    if (hasActionVerb) {
      taskScore += 7;
    } else {
      feedback.task.push('Gunakan kata kerja operasional yang jelas, seperti "Buat...", "Rancang...", atau "Susun...".');
    }
  }

  // 3. EVALUASI CONTEXT (Bobot 25 poin)
  if (!context) {
    feedback.context.push('Konteks (Context) kosong. AI akan menebak latar belakang sendiri jika tidak diisi.');
  } else {
    contextScore += 10;
    if (context.length >= 35) {
      contextScore += 10;
    } else {
      feedback.context.push('Konteks masih minim. Tambahkan target audiens, kelas/fase, situasi nyata, atau kendala yang dihadapi.');
    }

    const contextKeywords = ['siswa', 'kelas', 'sekolah', 'target', 'waktu', 'materi', 'smk', 'sma', 'jurusan', 'fase', 'anggaran', 'durasi'];
    const hasContextDetail = contextKeywords.some(kw => context.toLowerCase().includes(kw));
    if (hasContextDetail) {
      contextScore += 5;
    } else {
      feedback.context.push('Saran: Sebutkan siapa target penggunanya atau situasi spesifik tugas.');
    }
  }

  // 4. EVALUASI LIMITATIONS (Bobot 25 poin)
  if (!limitations) {
    feedback.limitations.push('Batasan (Limitations) kosong. Hasil AI bisa terlalu panjang, klise, atau formatnya tidak sesuai.');
  } else {
    limitationsScore += 10;
    if (limitations.length >= 25) {
      limitationsScore += 8;
    } else {
      feedback.limitations.push('Batasan masih sedikit. Tentukan format output dan batasan panjang kata.');
    }

    const limitationKeywords = [
      'format', 'tabel', 'markdown', 'kata', 'bahasa', 'poin', 'maksimal', 
      'hindari', 'rubrik', 'formal', 'santai', 'cta', 'langkah', 'baku'
    ];
    const hasLimitationKeywords = limitationKeywords.some(kw => limitations.toLowerCase().includes(kw));
    if (hasLimitationKeywords) {
      limitationsScore += 7;
    } else {
      feedback.limitations.push('Saran batasan: Tentukan format (misal "format tabel Markdown"), gaya bahasa, atau batas maksimal kata.');
    }
  }

  const totalScore = Math.min(100, roleScore + taskScore + contextScore + limitationsScore);

  let grade: 'Perlu Perbaikan' | 'Cukup' | 'Baik' | 'Sangat Baik (Master)' = 'Perlu Perbaikan';
  if (totalScore >= 85) {
    grade = 'Sangat Baik (Master)';
  } else if (totalScore >= 70) {
    grade = 'Baik';
  } else if (totalScore >= 50) {
    grade = 'Cukup';
  } else {
    grade = 'Perlu Perbaikan';
  }

  return {
    roleScore,
    taskScore,
    contextScore,
    limitationsScore,
    totalScore,
    grade,
    feedback
  };
}
