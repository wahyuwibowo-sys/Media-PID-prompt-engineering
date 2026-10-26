import { RTCLTemplate, TemplateCategory } from '../types/rtcl';

export const RTCL_TEMPLATES: RTCLTemplate[] = [
  // 1. GURU
  {
    id: 'guru-modul-ajar',
    title: 'Modul Ajar Berdiferensiasi',
    description: 'Penyusunan modul ajar Kurikulum Merdeka yang ramah kebutuhan murid.',
    category: 'Guru',
    iconName: 'GraduationCap',
    data: {
      role: 'Guru Penggerak dan Ahli Perancang Pembelajaran Berdiferensiasi Kurikulum Merdeka',
      task: 'Rancang Modul Ajar (RPP) 1 pertemuan (2 JP) lengkap dengan asesmen awal, kegiatan inti berdiferensiasi (proses & produk), dan asesmen formatif',
      context: 'Mata pelajaran Informatika / IPA kelas 10 SMK/SMA dengan materi "Etika & Pemanfaatan AI secara Bertanggung Jawab". Karakteristik siswa: 35% pembelajar visual, 40% kinestetik/praktik, 25% auditori',
      limitations: 'Gunakan format tabel terstruktur, cantumkan tujuan pembelajaran (TP) operasional (ABCD), bahasa komunikatif dan mudah dieksekusi, sertakan rubrik penilaian skala 1-4, maksimal 500 kata'
    }
  },
  {
    id: 'guru-asesmen-rubrik',
    title: 'Asesmen Formatif & Rubrik Analitis',
    description: 'Membuat instrumen asesmen bermakna beserta panduan penskoran.',
    category: 'Guru',
    iconName: 'ClipboardCheck',
    data: {
      role: 'Spesialis Evaluasi Pendidikan dan Asesmen Otentik',
      task: 'Buat 5 butir soal pemecahan masalah (HOTS) tingkat analisis (C4) dan evaluasi (C5) beserta rubrik penskoran analitis 4 kriteria',
      context: 'Materi Literasi Finansial & Pengelolaan Anggaran untuk siswa Fase E (Kelas 10). Siswa diharapkan dapat menyelesaikan studi kasus nyata pengeluaran remaja',
      limitations: 'Hindari pertanyaan hafalan tertutup, sertakan kunci jawaban komprehensif, format penilaian disajikan dalam tabel Markdown, sertakan umpan balik perbaikan'
    }
  },

  // 2. KEPALA SEKOLAH
  {
    id: 'ks-rencana-kerja',
    title: 'Rencana Peningkatan Mutu Sekolah (RKT)',
    description: 'Menyusun strategi tindak lanjut berdasarkan indikator Rapor Pendidikan.',
    category: 'Kepala Sekolah',
    iconName: 'Building2',
    data: {
      role: 'Kepala Sekolah Berprestasi dan Konsultan Manajemen Strategis Satuan Pendidikan',
      task: 'Susun matriks Rencana Kerja Tahunan (RKT) berbasis data Rapor Pendidikan untuk meningkatkan skor Iklim Keamanan Sekolah dan Literasi Siswa',
      context: 'SMK Negeri dengan 850 siswa dan 60 guru. Rapor Pendidikan tahun ini menunjukkan skor Literasi kategori Kuning (sedang) dan Indeks Kebinekaan kategori Hijau. Anggaran BOS/BOSP terbatas namun kemitraan komite aktif',
      limitations: 'Sajikan dalam 5 program prioritas dengan format: Nama Program, Tujuan, Sasaran, PJ, Indikator Keberhasilan, dan Estimasi Timeline triwulan. Bahasa formal dinas, padat, dan realistis'
    }
  },
  {
    id: 'ks-budaya-positif',
    title: 'Pengembangan Budaya Positif Sekolah',
    description: 'Inisiatif tata kelola kedisiplinan berbasis kesepakatan kelas dan restitusi.',
    category: 'Kepala Sekolah',
    iconName: 'ShieldCheck',
    data: {
      role: 'Kepala Sekolah Penggerak dan Ahli Disiplin Positif Ki Hadjar Dewantara',
      task: 'Rancang panduan implementasi Budaya Positif dan Segitiga Restitusi untuk seluruh warga sekolah (guru, tenaga kependidikan, dan murid)',
      context: 'Sekolah ingin bertransisi dari sistem poin hukuman fisik/denda ke pendekatan pembinaan karakter berbasis kesadaran diri dan restitusi bermartabat',
      limitations: 'Berikan alur tahapan konkret sosialisasi, contoh dialog penanganan kasus keterlambatan siswa, hindari kata-kata bernada intimidatif, maksimal 450 kata'
    }
  },

  // 3. SUPERVISI AKADEMIK
  {
    id: 'supervisi-instrumen',
    title: 'Instrumen Observasi Kelas & Catatan Balikan',
    description: 'Panduan observasi pembelajaran berpusat pada peserta didik.',
    category: 'Supervisi Akademik',
    iconName: 'Eye',
    data: {
      role: 'Supervisor Akademik Senior dan Pengawas Pembelajaran Berkelanjutan',
      task: 'Buat instrumen lembar observasi supervisi akademik kelas yang menitikberatkan pada keterlibatan aktif murid (Student Engagement) dan budaya belajar positif',
      context: 'Supervisi klinis untuk guru mata pelajaran Produktif/Kejuruan saat pembelajaran di laboratorium komputer/bengkel praktik',
      limitations: 'Gunakan 3 bagian utama: Pra-Observasi, Observasi Pembelajaran (10 indikator terukur), dan Pasca-Observasi (teknik coaching berbasis TIRTA). Format Markdown siap cetak'
    }
  },
  {
    id: 'supervisi-coaching-feedback',
    title: 'Pertanyaan Coaching Pasca-Observasi',
    description: 'Daftar pertanyaan pemantik refleksi guru tanpa nada menghakimi.',
    category: 'Supervisi Akademik',
    iconName: 'MessageSquareHeart',
    data: {
      role: 'Coach Profesional Bidang Pendidikan bersertifikasi ICF & Pendamping Guru',
      task: 'Buat 12 pertanyaan pemantik reflektif berbasis alur TIRTA (Tujuan, Identifikasi, Rencana Aksi, Tanggung Jawab) untuk sesi umpan balik setelah supervisi kelas',
      context: 'Guru merasa gugup karena murid di baris belakang kurang antusias saat sesi ceramah dan guru ingin meningkatkan interaksi dua arah pada pertemuan berikutnya',
      limitations: 'Gunakan pertanyaan terbuka berawalan "Apa", "Bagaimana", "Ceritakan". Larang penggunaan pertanyaan yang menginterogasi seperti "Mengapa kamu tidak...". Kategorikan per fase TIRTA'
    }
  },

  // 4. PEMBELAJARAN MENDALAM
  {
    id: 'deep-learning-pbl',
    title: 'Desain Problem-Based Learning (PBL) Kontekstual',
    description: 'Skenario pembelajaran mendalam yang merangsang nalar kritis & kolaborasi.',
    category: 'Pembelajaran Mendalam',
    iconName: 'BrainCircuit',
    data: {
      role: 'Pakar Desain Pembelajaran Mendalam (Deep Learning) & Pedagogi Abad 21',
      task: 'Rancang skenario pembelajaran berbasis proyek (Project/Problem-Based Learning) dengan tahapan 6C (Critical thinking, Collaboration, Communication, Creativity, Character, Citizenship)',
      context: 'Topik: "Pengurangan Jejak Karbon dan Sampah Plastik di Lingkungan Sekolah". Diterapkan untuk kelompok siswa lintas disiplin ilmu selama 3 siklus pertemuan',
      limitations: 'Sertakan pemantik masalah autentik (driving question), peran pembagian tim, kriteria solusi bernilai tambah, dan bentuk artefak akhir. Sajikan dalam langkah-langkah runtut bersistem'
    }
  },
  {
    id: 'deep-learning-scaffolding',
    title: 'Scaffolding Berpikir Kritis & Metakognisi',
    description: 'Lembar kerja pemantik metakognisi agar murid memahami proses berpikirnya.',
    category: 'Pembelajaran Mendalam',
    iconName: 'Sparkles',
    data: {
      role: 'Spesialis Neurosains Kognitif dan Perancang Pengalaman Belajar',
      task: 'Buat lembar jurnal metakognitif (Thinking Routine) "I used to think... Now I think..." disertai 5 pertanyaan pemantik untuk memperdalam pemahaman konsep rumit',
      context: 'Siswa baru saja menyelesaikan bab materi yang menuntut analisis dampak perubahan iklim terhadap ketahanan pangan global',
      limitations: 'Bahasa santun yang akrab bagi siswa sekolah menengah, dorong siswa mengaitkan konsep dengan pengalaman personal mereka, cantumkan instruksi guru singkat (3 baris)'
    }
  },

  // 5. PENDIDIKAN (UMUM)
  {
    id: 'pendidikan-parent-comm',
    title: 'Surat Komunikasi Efektif dengan Orang Tua',
    description: 'Membangun sinergi positif antara sekolah dan wali murid.',
    category: 'Pendidikan',
    iconName: 'BookOpen',
    data: {
      role: 'Konselor Sekolah dan Praktisi Komunikasi Keluarga-Sekolah',
      task: 'Tulis draf pesan WhatsApp/Surat resmi yang hangat namun profesional kepada orang tua murid mengenai perkembangan belajar anak dan ajakan kolaborasi',
      context: 'Menjelaskan jadwal pekan pameran karya siswa (Gelar Karya P5) serta tips mendampingi anak mempersiapkan presentasi di rumah tanpa membebani',
      limitations: 'Maksimal 250 kata, bahasa santun dan mengapresiasi, cantumkan tanggal konfirmasi kehadiran, sertakan nomor kontak narahubung guru kelas'
    }
  },

  // 6. MARKETING
  {
    id: 'marketing-campaign',
    title: 'Kampanye Peluncuran Produk & Copywriting',
    description: 'Strategi funneling dan naskah iklan digital bertarget konversi.',
    category: 'Marketing',
    iconName: 'Megaphone',
    data: {
      role: 'Head of Growth Marketing dan Senior Direct-Response Copywriter',
      task: 'Buat 5 variasi hook iklan, 3 naskah caption Instagram, dan 1 struktur penawaran bundle eksklusif menggunakan formula PAS (Problem - Agitate - Solve)',
      context: 'Peluncuran produk kopi susu botolan premium rendah gula untuk kalangan pekerja muda dan mahasiswa yang peduli kesehatan',
      limitations: 'Gunakan nada bahasa energik, sertakan emoji yang relevan, wajib sertakan Call To Action (CTA) yang mendesak (scarcity), cantumkan estimasi durasi baca'
    }
  },

  // 7. KONTEN KREATOR
  {
    id: 'konten-kreator-reels-tiktok',
    title: 'Script Video Pendek (TikTok/Reels/Shorts)',
    description: 'Skrip video viral dengan hook 3 detik pertama dan alur retensi tinggi.',
    category: 'Konten Kreator',
    iconName: 'Video',
    data: {
      role: 'Viral Short-Form Content Strategist dan Scriptwriter Spesialis TikTok & Reels',
      task: 'Buat 3 naskah script video durasi 60 detik lengkap dengan Visual Direction, Audio/SFX, On-screen Text, dan Narasi Lisan per detik',
      context: 'Topik: "5 Fitur AI Tersembunyi yang Jarang Diketahui untuk Menyelesaikan Tugas Kuliah/Kantor dalam 10 Menit". Target: Generasi Z dan Milenial',
      limitations: 'Hook 3 detik pertama wajib memicu rasa penasaran (curiosity gap), alur cepat, tanpa basa-basi intro panjang, berikan rekomendasi lagu trending'
    }
  },

  // 8. PROGRAMMER
  {
    id: 'programmer-code-review-refactor',
    title: 'Code Review & Refactor Full Stack',
    description: 'Menganalisis keamanan, performa, dan arsitektur kode secara mendalam.',
    category: 'Programmer',
    iconName: 'Code2',
    data: {
      role: 'Principal Software Engineer & Clean Code Architect (TypeScript/Python/Go)',
      task: 'Lakukan code review komprehensif terhadap cuplikan kode yang diberikan, identifikasi code smell, potensi memory leak, bug concurrency, dan berikan versi perbaikan yang telah dioptimalkan',
      context: 'Aplikasi web e-commerce skala menengah dengan traffic tinggi, menggunakan React Frontend dan Node.js/Express REST API dengan koneksi PostgreSQL',
      limitations: 'Gunakan prinsip SOLID dan DRY, sertakan penjelasan mengapa perubahan tersebut lebih efisien dalam hal Time/Space Complexity (Big O), sertakan TypeScript strict typing'
    }
  },
  // 10. JURUSAN APHPi
  {
    id: 'aphpi-bandeng-sop',
    title: 'SOP Bandeng Cabut Duri & Sanitasi GMP (APHPi)',
    description: 'Penyusunan standar kebersihan, alur pencabutan duri, dan kemasan vakum beku.',
    category: 'APHPi (Hasil Perikanan)',
    iconName: 'Fish',
    data: {
      role: 'Quality Control (QC) Manager & Pengawas Mutu Hasil Perikanan BPOM/SNI',
      task: 'Rancang Standar Operasional Prosedur (SOP) pengolahan bandeng cabut duri kemasan vakum lengkap dengan tahapan sanitasi GMP',
      context: 'Unit produksi perikanan sekolah mengolah 50 kg bandeng segar lokal Gresik Utara dengan standar rantai dingin di bawah 4 derajat Celsius',
      limitations: 'Sajikan dalam bentuk tabel tahapan kerja, cantumkan batas kritis suhu penyimpanan, tindakan pencegahan lalat/kontaminasi, maksimal 350 kata'
    }
  },

  // 11. JURUSAN TKJ
  {
    id: 'tkj-vlan-trunk',
    title: 'VLAN Trunking & Firewall Filtering MikroTik (TKJ)',
    description: 'Segmentasi jaringan sekolah dan proteksi broadcast storm.',
    category: 'TKJ (Jaringan)',
    iconName: 'Network',
    data: {
      role: 'Senior Network Engineer & Instruktur Jaringan MikroTik (MTCNA/MTCRE)',
      task: 'Buat skrip konfigurasi CLI MikroTik RouterOS v7 untuk pembagian 3 VLAN (Guru, Siswa, Server) beserta DHCP Server dan Firewall Filter antar-VLAN',
      context: 'Router MikroTik RB4011 terhubung ke Switch Manageable 24 port. Siswa VLAN 20 tidak boleh mengakses server VLAN 30 kecuali port HTTP (80/443)',
      limitations: 'Sertakan sintaks skrip terminal RouterOS lengkap dengan penjelasan komentar per baris, format rapi siap copy-paste ke terminal Winbox'
    }
  },

  // 12. JURUSAN TKR
  {
    id: 'tkr-diagnosa-dtc',
    title: 'Diagnosa Scan Tool OBD-II Sistem EFI (TKR)',
    description: 'Analisis trouble code mesin tersendat dan live stream sensor.',
    category: 'TKR (Otomotif)',
    iconName: 'Wrench',
    data: {
      role: 'Kepala Mekanik Bengkel Resmi & Spesialis Sistem EFI Mesin Modern',
      task: 'Rancang panduan inspeksi troubleshooting DTC P0300 (Random Misfire) dan P0171 (System Too Lean) menggunakan scanner OBD-II dan osiloskop',
      context: 'Kendaraan bensin 1500cc VVT-i mengalami tarikan brebet saat akselerasi. Tekanan fuel pump terbaca 3.0 bar, busi elektroda berwarna abu-abu keputihan',
      limitations: 'Sajikan alur pemeriksaan berurutan dari sistem bahan bakar, pengapian, hingga sensor MAF/O2. Cantumkan nilai standar multimeter (Volt/Ohm)'
    }
  },

  // 13. JURUSAN TITL
  {
    id: 'titl-star-delta',
    title: 'Rangkaian Daya & Kendali Star-Delta Otomatis (TITL)',
    description: 'Pengasutan motor 3 fasa dengan 3 kontaktor & timer TDR standar PUIL.',
    category: 'TITL (Listrik)',
    iconName: 'Zap',
    data: {
      role: 'Electrical Control Engineer & Instruktur Pemasangan Panel Listrik Industri',
      task: 'Susun instruksi kerja perakitan rangkaian daya dan kendali pengasutan motor induksi 3 fasa 15 kW sistem Star-Delta otomatis menggunakan TDR',
      context: 'Panel listrik tegangan 380V dengan pengaman Thermal Overload Relay (TOR) dan tombol Push Button Start-Stop. Standar keselamatan PUIL 2011',
      limitations: 'Cantumkan penomoran terminal kontaktor magnet (A1-A2, NO 13-14, NC 21-22), rumus perhitungan arus TOR fasa, dan diagram alur kerja terstruktur'
    }
  }
];

export const CATEGORIES: TemplateCategory[] = [
  'APHPi (Hasil Perikanan)',
  'TKJ (Jaringan)',
  'TKR (Otomotif)',
  'TITL (Listrik)',
  'Tugas Siswa',
  'Guru',
  'Kepala Sekolah',
  'Supervisi Akademik',
  'Pembelajaran Mendalam',
  'Pendidikan',
  'Marketing',
  'Konten Kreator',
  'Programmer'
];
