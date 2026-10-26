import { ClassroomTopic, StudentScoreRecord, JurusanSMK } from '../types/classroom';
import { DEFAULT_CLASSROOM_TOPICS } from '../data/classroomTopics';
import { RTCLForm, RTCLAuditScore } from '../types/rtcl';

const GRADEBOOK_KEY = 'rtcl_classroom_gradebook_v2';
const CUSTOM_TOPICS_KEY = 'rtcl_classroom_custom_topics_v1';

// Initial Sample Records for SMK Majors (APHPi, TKJ, TITL, TKR)
const INITIAL_SAMPLE_RECORDS: StudentScoreRecord[] = [
  {
    id: 'score_demo_1',
    studentName: 'Ahmad Faiz (Ketua)',
    teamMembers: 'Budi Santoso, Cindy Aurelia, Dimas Pratama',
    teamName: 'Regu MikroTik Alpha',
    className: 'X TKJ 1',
    jurusan: 'TKJ',
    topicTitle: 'Konfigurasi VLAN & Keamanan Jaringan Lab TKJ',
    promptData: {
      role: 'Network Administrator Senior bersertifikasi MikroTik MTCNA',
      task: 'Rancang skema pengalamatan IP, tabel VLAN, dan konfigurasi firewall dasar untuk lab sekolah',
      context: 'Laboratorium TKJ memiliki 36 PC klien, 1 server ujian CBT lokal, dan koneksi internet bandwidth 50 Mbps',
      limitations: 'Format tabel Markdown, bahasa teknis baku, sertakan script CLI Winbox, maksimal 200 kata'
    },
    compiledPrompt: `PERAN (ROLE):
Bertindaklah sebagai Network Administrator Senior bersertifikasi MikroTik MTCNA.

TUGAS (TASK):
Rancang skema pengalamatan IP, tabel VLAN, dan konfigurasi firewall dasar untuk lab sekolah.

KONTEKS (CONTEXT):
Laboratorium TKJ memiliki 36 PC klien, 1 server ujian CBT lokal, dan koneksi internet bandwidth 50 Mbps.

BATASAN (LIMITATIONS):
Format tabel Markdown, bahasa teknis baku, sertakan script CLI Winbox, maksimal 200 kata.`,
    aiResponse: `Berikut rancangan tabel VLAN Lab TKJ:
| VLAN ID | Nama Segmen | Subnet IP | Gateway | Alokasi Klien |
| 10 | Siswa-Lab | 192.168.10.0/24 | 192.168.10.1 | 36 PC |
| 20 | Server-CBT | 192.168.20.0/28 | 192.168.20.1 | 1 Server |

Script CLI:
/interface vlan add name=vlan10 vlan-id=10 interface=ether2
/ip address add address=192.168.10.1/24 interface=vlan10`,
    auditScore: {
      roleScore: 25,
      taskScore: 25,
      contextScore: 25,
      limitationsScore: 25,
      totalScore: 100,
      grade: 'Sangat Baik (Master)',
      feedback: {
        role: ['Peran sangat jelas dengan kredensial MTCNA.'],
        task: ['Tugas terperinci dan menggunakan kata kerja terukur.'],
        context: ['Konteks riil 36 PC dan bandwidth 50 Mbps.'],
        limitations: ['Batasan tabel markdown dan script CLI sangat spesifik.']
      }
    },
    timeSpentSeconds: 78,
    timestamp: Date.now() - 3600000 * 2,
    teacherNotes: 'Prompt sangat lengkap, kerja sama tim sangat aktif di smartboard!',
    manualBonus: 0
  },
  {
    id: 'score_demo_2',
    studentName: 'Siti Nur Aisyah (Ketua)',
    teamMembers: 'Rina Wulandari, Dewi Sartika, Maya Anggraini',
    teamName: 'Regu Quality Assurance APHPi',
    className: 'X APHPi 1',
    jurusan: 'APHPi',
    topicTitle: 'SOP Sterilisasi Autoclave Pengalengan Ikan Sarden',
    promptData: {
      role: 'Ahli Teknologi Pangan & Pengawas Mutu HACCP Perikanan',
      task: 'Susun SOP tahap sterilisasi termal retort autoclave untuk produk pengalengan ikan',
      context: 'Produk sarden dalam kaleng ukuran 155 gram dengan saus tomat pada industri pengolahan ikan pesisir',
      limitations: 'Format poin terurut 1-5, cantumkan suhu (121°C) dan tekanan (0.15 MPa), bahasa Indonesia baku'
    },
    compiledPrompt: `PERAN (ROLE):
Bertindaklah sebagai Ahli Teknologi Pangan & Pengawas Mutu HACCP Perikanan.

TUGAS (TASK):
Susun SOP tahap sterilisasi termal retort autoclave untuk produk pengalengan ikan.

KONTEKS (CONTEXT):
Produk sarden dalam kaleng ukuran 155 gram dengan saus tomat pada industri pengolahan ikan pesisir.

BATASAN (LIMITATIONS):
Format poin terurut 1-5, cantumkan suhu (121°C) dan tekanan (0.15 MPa), bahasa Indonesia baku.`,
    aiResponse: `SOP Sterilisasi Retort Autoclave Kaleng Sarden:
1. Pemuatan: Susun kaleng 155g ke dalam keranjang autoclave secara rapi.
2. Venting: Buka katup uap selama 5-7 menit untuk membuang seluruh udara dingin hingga suhu mencapai 100°C.
3. Holding Time: Naikkan suhu hingga 121°C pada tekanan 0.15 MPa (1.5 bar) dan pertahankan selama 60 menit.
4. Cooling: Turunkan suhu perlahan dengan memasukkan air pendingin bertekanan agar kaleng tidak melembung.
5. Inspeksi: Periksa integritas seal kaleng setelah dingin (< 40°C).`,
    auditScore: {
      roleScore: 25,
      taskScore: 24,
      contextScore: 25,
      limitationsScore: 24,
      totalScore: 98,
      grade: 'Sangat Baik (Master)',
      feedback: {
        role: ['Peran HACCP sangat relevan.'],
        task: ['Instruksi SOP spesifik.'],
        context: ['Ukuran kaleng dan produk jelas.'],
        limitations: ['Suhu dan tekanan dicantumkan dengan tepat.']
      }
    },
    timeSpentSeconds: 85,
    timestamp: Date.now() - 3600000 * 4,
    teacherNotes: 'Sangat teliti dalam mencantumkan parameter kritis HACCP.',
    manualBonus: 2
  },
  {
    id: 'score_demo_3',
    studentName: 'Rizky Ramadhan (Ketua)',
    teamMembers: 'Gilang Pratama, Hendra Saputra',
    teamName: 'Regu Otomotif Turbo',
    className: 'X TKR 1',
    jurusan: 'TKR',
    topicTitle: 'Troubleshooting Mesin Bensin EFI Brebet di Putaran Tinggi',
    promptData: {
      role: 'Kepala Mekanik Bengkel Resmi Otomotif Bersertifikasi BNSP',
      task: 'Buat tabel panduan diagnosis dan urutan pemeriksaan sistem bahan bakar dan pengapian',
      context: 'Mobil Avanza Dual VVT-i 2018 dengan keluhan brebet saat RPM di atas 3000 dan lampu Check Engine menyala',
      limitations: 'Format tabel Markdown 4 kolom (Komponen, Gejala, Nilai Standar, Tindakan), maksimal 250 kata'
    },
    compiledPrompt: `PERAN (ROLE):
Bertindaklah sebagai Kepala Mekanik Bengkel Resmi Otomotif Bersertifikasi BNSP.

TUGAS (TASK):
Buat tabel panduan diagnosis dan urutan pemeriksaan sistem bahan bakar dan pengapian.

KONTEKS (CONTEXT):
Mobil Avanza Dual VVT-i 2018 dengan keluhan brebet saat RPM di atas 3000 dan lampu Check Engine menyala.

BATASAN (LIMITATIONS):
Format tabel Markdown 4 kolom (Komponen, Gejala, Nilai Standar, Tindakan), maksimal 250 kata.`,
    aiResponse: `| Komponen | Gejala | Nilai Standar | Tindakan |
|:---|:---|:---|:---|
| Tekanan Fuel Pump | Mesin brebet RPM >3000 | 3.1 - 3.5 bar (45 psi) | Ukur pakai fuel pressure gauge; ganti filter jika mampet |
| Busi (Spark Plug) | Missfire silinder | Celah 1.0 - 1.1 mm | Bersihkan kerak atau ganti busi Iridium |
| Sensor MAF | Data udara kurus | Voltase 1.2 - 1.8 V saat idle | Semprot MAF cleaner khusus |
| Filter Udara | Aliran udara tercekik | Bersih tanpa jelaga tebal | Tiup kompresor dari arah dalam |`,
    auditScore: {
      roleScore: 25,
      taskScore: 23,
      contextScore: 25,
      limitationsScore: 25,
      totalScore: 98,
      grade: 'Sangat Baik (Master)',
      feedback: {
        role: ['Peran kepala mekanik BNSP sangat meyakinkan.'],
        task: ['Tabel diagnosis komprehensif.'],
        context: ['Spesifikasi mobil Avanza 2018 jelas.'],
        limitations: ['Tabel 4 kolom rapi.']
      }
    },
    timeSpentSeconds: 92,
    timestamp: Date.now() - 3600000 * 6,
    teacherNotes: 'Solusi mekanik sangat realistis dan aplikatif.',
    manualBonus: 0
  },
  {
    id: 'score_demo_4',
    studentName: 'Bayu Saputra (Ketua)',
    teamMembers: 'Fajar Nugraha, Galih Hidayat',
    teamName: 'Regu Arus Kuat TITL',
    className: 'X TITL 1',
    jurusan: 'TITL',
    topicTitle: 'Rangkaian Kontrol Motor Induksi 3 Fasa Star-Delta Otomatis',
    promptData: {
      role: 'Instalatir Listrik Industri Madya berpedoman PUIL 2011',
      task: 'Rancang spesifikasi komponen panel kontrol motor listrik induksi 3 fasa 15 kW',
      context: 'Motor penggerak konveyor pabrik sering trip saat starting langsung (DOL)',
      limitations: 'Sajikan tabel komponen beserta rating ampere (MCCB, Kontaktor, TOR, Timer), bahasa baku'
    },
    compiledPrompt: `PERAN (ROLE):
Bertindaklah sebagai Instalatir Listrik Industri Madya berpedoman PUIL 2011.

TUGAS (TASK):
Rancang spesifikasi komponen panel kontrol motor listrik induksi 3 fasa 15 kW.

KONTEKS (CONTEXT):
Motor penggerak konveyor pabrik sering trip saat starting langsung (DOL).

BATASAN (LIMITATIONS):
Sajikan tabel komponen beserta rating ampere (MCCB, Kontaktor, TOR, Timer), bahasa baku.`,
    aiResponse: `| Komponen | Tipe / Model | Rating Spesifikasi | Acuan PUIL |
|:---|:---|:---|:---|
| MCCB Utama | 3 Pole | 50 A (Icu 25 kA) | PUIL 2011 Bag. 5 |
| Kontaktor Utama & Delta | AC-3 | Rating 32 A | IEC 60947 |
| Kontaktor Bintang (Star) | AC-3 | Rating 20 A (0.58 x In) | PUIL 2011 |
| Thermal Overload Relay | TOR | Setting 28 - 30 A | Pengaman Beban Lebih |
| Timer On-Delay | Elektronik | Setting 5 - 7 detik | Transisi Star ke Delta |`,
    auditScore: {
      roleScore: 24,
      taskScore: 24,
      contextScore: 24,
      limitationsScore: 24,
      totalScore: 96,
      grade: 'Sangat Baik (Master)',
      feedback: {
        role: ['Pedoman PUIL 2011 disertakan.'],
        task: ['Spesifikasi panel motor 15 kW detail.'],
        context: ['Masalah motor konveyor jelas.'],
        limitations: ['Tabel rating komponen tepat.']
      }
    },
    timeSpentSeconds: 88,
    timestamp: Date.now() - 3600000 * 8,
    teacherNotes: 'Sangat memahami perhitungan arus nominal motor 15 kW.',
    manualBonus: 0
  }
];

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
    if (!raw) {
      // Seed initial sample data for demonstration if first time
      localStorage.setItem(GRADEBOOK_KEY, JSON.stringify(INITIAL_SAMPLE_RECORDS));
      return INITIAL_SAMPLE_RECORDS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('Error loading gradebook:', error);
    return INITIAL_SAMPLE_RECORDS;
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
  teacherNotes?: string,
  compiledPrompt?: string,
  aiResponse?: string,
  manualBonus?: number
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
      compiledPrompt,
      aiResponse,
      auditScore,
      timeSpentSeconds,
      timestamp: Date.now(),
      teacherNotes,
      manualBonus: manualBonus !== undefined ? manualBonus : 0
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
    localStorage.setItem(GRADEBOOK_KEY, JSON.stringify([]));
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
    'Prompt RTCL Murid',
    'Hasil AI Generatif',
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
      escapeCSV(rec.compiledPrompt || '-'),
      escapeCSV(rec.aiResponse || '-'),
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
