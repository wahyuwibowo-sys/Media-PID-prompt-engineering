import { AssessmentQuestion } from '../types/classroom';

export interface PertanyaanPemantikItem {
  id: number;
  pertanyaan: string;
  jawaban: string;
  poinKunci: string[];
  panduanApersepsiGuru: string;
}

export interface CurriculumInfo {
  elemen: string;
  fase: string;
  capaianPembelajaran: string;
  tujuanPembelajaran: string[];
  alurTujuanPembelajaran: string[];
  pertanyaanPemantik: PertanyaanPemantikItem[];
  pemahamanBermakna: {
    ringkasan: string;
    poinKunci: {
      huruf: 'R' | 'T' | 'C' | 'L';
      nama: string;
      fungsi: string;
      contohVocational: string;
    }[];
  };
}

export const CURRICULUM_DATA: CurriculumInfo = {
  elemen: 'Pemanfaatan dan Pengembangan Kecerdasan Artifisial',
  fase: 'Fase E (SMK Kelas X)',
  capaianPembelajaran: 
    'Pada akhir Fase E, murid mampu menerapkan prompt engineering pada KA generatif sebagai evaluasi dari pemahaman rencana proyek, desain dan pengembangan produk berupa barang/jasa.',
  tujuanPembelajaran: [
    'Menerapkan prompt engineering',
    'Mengevaluasi konten berbasis Kecerdasan Artifisial',
    'Menerapkan perancangan sistem Kecerdasan Artifisial melalui proses design thinking'
  ],
  alurTujuanPembelajaran: [
    '12. Memahami profesi di bidang Kecerdasan Artifisial',
    '13. Memahami konsekuensi pemanfaatan Kecerdasan Artifisial',
    '14. Menerapkan prompt engineering',
    '15. Mengevaluasi konten berbasis Kecerdasan Artifisial',
    '16. Menerapkan perancangan sistem Kecerdasan Artifisial melalui proses design thinking'
  ],
  pertanyaanPemantik: [
    {
      id: 1,
      pertanyaan: 'Pernahkah kalian bertanya ke AI (ChatGPT/Gemini) tetapi jawabannya terlalu umum, melantur, atau bahkan keliru? Mengapa itu bisa terjadi?',
      jawaban: 'Hal ini terjadi karena berlakunya prinsip "Garbage In, Garbage Out" (GIGO) pada sistem AI. Model AI Generatif (LLM) bekerja dengan memprediksi kata berikutnya secara probabilistik dari miliaran data teks internet umum. Ketika instruksi yang kita berikan terlalu singkat, tanpa peran spesifik (Role), tanpa data situasi nyata (Context), dan tanpa format tegas (Limitations), AI akan menebak secara acak atau melakukan generalisasi dangkal, hingga memicu fenomena "Halusinasi AI" (mengarang fakta yang terdengar meyakinkan padahal salah).',
      poinKunci: [
        'Prinsip "Garbage In, Garbage Out": Kualitas respon AI berbanding lurus dengan ketepatan perintah pengguna.',
        'AI tidak memiliki intuisi atau kesadaran fisik; AI sangat membutuhkan parameter konteks operasional riil.',
        'Kurangnya batasan (Limitations) membuka celah lebar bagi AI untuk berhalusinasi atau memberikan jawaban fiktif.'
      ],
      panduanApersepsiGuru: 'Minta 1-2 siswa menceritakan pengalaman pribadi saat jawaban AI tidak sesuai harapan ketika mengerjakan tugas kejuruan atau kehidupan sehari-hari.'
    },
    {
      id: 2,
      pertanyaan: 'Jika dua orang menanyakan masalah yang sama ke AI, apa yang membuat hasil jawaban orang pertama jauh lebih cerdas dan praktis daripada orang kedua?',
      jawaban: 'Perbedaan utamanya terletak pada penguasaan teknik Prompt Engineering dengan formula RTCL. Orang pertama menyusun perintah terstruktur: menetapkan identitas ahli (Role), menetapkan kata kerja operasional dan target luaran konkret (Task), menyertakan kondisi teknis spesifik lapangan seperti merek/tipe mesin atau gejala kerusakan riil (Context), serta membatasi format jawaban (Limitations). Sebaliknya, orang kedua hanya mengajukan pertanyaan mentah satu baris, sehingga AI hanya memberikan jawaban ensiklopedia umum yang tidak aplikatif.',
      poinKunci: [
        'Struktur Formula RTCL mengubah peran AI dari sekadar mesin pencari menjadi konsultan teknis spesialis.',
        'Kedalaman Konteks Vokasi membedakan instruksi amatir dengan instruksi standar bengkel/industri.',
        'Batasan format (tabel, poin berurutan, batas kata) membuat hasil AI langsung siap digunakan pada lembar kerja praktikum.'
      ],
      panduanApersepsiGuru: 'Lakukan demonstrasi perbandingan langsung di papan tulis interaktif: ketik prompt polos vs prompt terstruktur RTCL untuk kasus kejuruan siswa.'
    },
    {
      id: 3,
      pertanyaan: 'Bagaimana cara memerintahkan AI agar berpikir dan menjawab persis seperti teknisi bengkel senior, mekanik bersertifikat, atau laboran berpengalaman?',
      jawaban: 'Kuncinya adalah mengunci elemen "Role" (Peran) di kalimat pembuka prompt dengan identitas profesi kredibel (misal: "Bertindaklah sebagai Teknisi Jaringan Senior bersertifikat MikroTik MTCNA..." atau "Sebagai Mekanik Kepala Bengkel Mobil Resmi..."). Langkah ini mengarahkan AI untuk menggunakan bobot pengetahuan teknis spesialis. Selanjutnya padukan dengan rujukan standar industri pada "Context" (seperti PUIL 2011, standar HACCP, atau buku manual servis resmi pabrikan) serta "Limitations" yang mewajibkan istilah teknis baku dan melarang tebakan/asumsi fiktif.',
      poinKunci: [
        'Mengunci persona profesional spesifik bersertifikasi pada elemen Role sejak awal kalimat.',
        'Menyertakan rujukan dokumen/standar operasional industri resmi pada elemen Context.',
        'Menambahkan instruksi proteksi pada Limitations: "Jika data kurang lengkap, tanyakan kembali kepada saya dan jangan berasumsi."'
      ],
      panduanApersepsiGuru: 'Tantang siswa menyebutkan jabatan profesional tertinggi di bidang kejuruan mereka (APHPi, TKJ, TKR, TITL) yang ingin mereka jadikan persona AI.'
    }
  ],
  pemahamanBermakna: {
    ringkasan: 
      'Kecerdasan Artifisial tidak bisa membaca pikiran manusia; AI merespons berdasarkan kualitas instruksi yang diterimanya (Garbage In, Garbage Out). Keterampilan Prompt Engineering dengan formula RTCL memberdayakan siswa SMK menjadi pengendali AI yang kritis, efisien, dan siap kerja.',
    poinKunci: [
      {
        huruf: 'R',
        nama: 'Role (Peran AI)',
        fungsi: 'Menetapkan identitas, persona profesional, dan kedalaman pengetahuan AI.',
        contohVocational: 'Teknisi Jaringan Komputer Senior bersertifikat MikroTik MTCNA / Mekanik Kepala Bengkel Mobil Resmi.'
      },
      {
        huruf: 'T',
        nama: 'Task (Tugas Utama)',
        fungsi: 'Menjelaskan kata kerja operasional dan target luaran konkret yang harus dihasilkan.',
        contohVocational: 'Buat tabel troubleshooting kerusakan sistem EFI mobil saat mesin brebet di putaran tinggi.'
      },
      {
        huruf: 'C',
        nama: 'Context (Konteks Masalah)',
        fungsi: 'Memberikan latar belakang situasi, spesifikasi alat, kendala lapangan, atau data awal.',
        contohVocational: 'Mobil Toyota Avanza 2018 dengan sensor O2 kotor dan tekanan fuel pump menurun.'
      },
      {
        huruf: 'L',
        nama: 'Limitations (Batasan Format)',
        fungsi: 'Membatasi panjang jawaban, gaya bahasa, struktur penyajian, dan larangan halusinasi.',
        contohVocational: 'Format tabel Markdown 4 kolom, bahasa Indonesia teknis baku, maksimal 250 kata, sertakan nilai resistansi standar.'
      }
    ]
  }
};

export interface EssentialMaterialTopic {
  id: string;
  title: string;
  icon: string;
  summary: string;
  keyPoints: string[];
  sampleBadVsGood?: {
    bad: string;
    badReason: string;
    good: string;
    goodReason: string;
  };
  tips: string[];
}

export const ESSENTIAL_MATERIALS: EssentialMaterialTopic[] = [
  {
    id: 'konsep-dasar',
    title: '1. Konsep Dasar & Cara Kerja Prompt Engineering',
    icon: 'Brain',
    summary: 'Prompt Engineering adalah seni dan disiplin menyusun instruksi yang jelas, terstruktur, dan kontekstual agar Model Kecerdasan Artifisial Generatif (LLM) menghasilkan respon yang presisi, relevan, dan bebas dari halusinasi data.',
    keyPoints: [
      'Model AI Generatif bekerja memprediksi probabilitas kata berikutnya (next-token prediction) berdasarkan instruksi yang masuk.',
      'Prinsip "Garbage In, Garbage Out": Jika instruksi samar dan tanpa batasan, AI akan menebak secara acak atau mengarang jawaban fiktif.',
      'Prompt yang baik mentransformasikan AI dari ensiklopedia umum menjadi asisten spesialis teknis bersertifikasi.'
    ],
    sampleBadVsGood: {
      bad: 'Tolong jelaskan kerusakan motor listrik.',
      badReason: 'Terlalu umum, tidak ada identitas peran, tidak ada tipe motor, dan tidak ada format luaran.',
      good: 'Bertindaklah sebagai Teknisi Listrik Industri PUIL. Buat tabel diagnosis 4 langkah pemeriksaan motor induksi 3 fasa 11 kW yang berdengung saat dihidupkan. Format tabel 3 kolom (Gejala, Kemungkinan Kerusakan, Alat Ukur).',
      goodReason: 'Memiliki Role (Teknisi PUIL), Task (tabel diagnosis 4 langkah), Context (motor 3 fasa 11 kW berdengung), dan Limitations (tabel 3 kolom).'
    },
    tips: [
      'Gunakan kata kerja operasional spesifik (Susun, Rancang, Identifikasi, Analisis, Bandingkan).',
      'Hindari kata kerja ambigu seperti "Pikirkan", "Coba lihat", atau "Bantu saya".'
    ]
  },
  {
    id: 'formula-rtcl',
    title: '2. Formula Emas RTCL (Role, Task, Context, Limitations)',
    icon: 'Layers',
    summary: 'Metode RTCL adalah kerangka kerja sistematis yang dirancang khusus untuk memandu siswa vokasi menyusun prompt industri yang teruji.',
    keyPoints: [
      'R = Role (Peran): Siapa AI yang berbicara? (Mekanik Kepala, Auditor Mutu HACCP, Network Engineer). Memberikan sudut pandang teknis.',
      'T = Task (Tugas): Apa hasil konkret yang harus dibuat? (SOP, Skrip CLI Winbox, Tabel Kalkulasi, Analisis Bahaya).',
      'C = Context (Konteks): Apa situasi riilnya? (Merek perangkat, spesifikasi kapasitas, suhu operasional, gejala error).',
      'L = Limitations (Batasan): Apa aturan ketatnya? (Panjang kata, gaya bahasa baku/santai, format tabel/poin, larangan asumsi).'
    ],
    tips: [
      'Letakkan Role di kalimat pembuka: "Bertindaklah sebagai..."',
      'Sertakan batasan bahasa dan format luaran agar hasil langsung siap dimasukkan ke lembar kerja.'
    ]
  },
  {
    id: 'teknik-lanjutan',
    title: '3. Teknik Lanjutan: Few-Shot Prompting & Chain-of-Thought',
    icon: 'Sparkles',
    summary: 'Meningkatkan akurasi AI dengan memberikan contoh pola jawaban (Few-Shot) dan memerintahkan AI bernalar langkah-demi-langkah (Chain of Thought).',
    keyPoints: [
      'Zero-Shot Prompting: Menanyakan perintah langsung tanpa contoh.',
      'Few-Shot Prompting: Memberikan 1-3 contoh format input dan output yang diinginkan sebelum meminta AI menyelesaikan tugas utama.',
      'Chain-of-Thought (CoT): Memerintahkan AI menjelaskan proses analisis langkah demi langkah sebelum menyimpulkan jawaban.'
    ],
    sampleBadVsGood: {
      bad: 'Berapa ukuran kabel NYA untuk beban 45 Ampere?',
      badReason: 'AI bisa langsung memberi angka tanpa memperhitungkan faktor keamanan KHA PUIL 2011.',
      good: 'Sebagai Instalatir Listrik PUIL 2011, hitung Kuat Hantar Arus (KHA = 125% x In) untuk beban 45A. Tunjukkan langkah perhitungannya sebelum menyimpulkan luas penampang nominal kabel yang wajib dipakai.',
      goodReason: 'Memerintahkan penalaran bertahap (CoT) sehingga murid dan guru dapat memverifikasi kebenaran rumus.'
    },
    tips: [
      'Tambahkan frasa: "Jelaskan langkah demi langkah analisis teknismu sebelum membuat rekomendasi final."',
      'Gunakan format Few-Shot jika Anda menginginkan struktur output yang sangat spesifik.'
    ]
  },
  {
    id: 'pencegahan-halusinasi',
    title: '4. Pencegahan Halusinasi & Evaluasi Kritis Output AI',
    icon: 'ShieldCheck',
    summary: 'Halusinasi AI adalah kondisi di mana AI mengarang fakta fiktif dengan nada yang meyakinkan. Siswa SMK wajib memiliki nalar kritis dalam mengevaluasi hasil generative AI.',
    keyPoints: [
      'AI tidak memiliki kesadaran; AI menghasilkan teks berdasarkan korelasi statistik, bukan verifikasi fisik di lapangan.',
      'Jangan pernah menerima nilai tegangan listrik, torsi baut, atau takaran bahan kimia pengawet tanpa verifikasi SOP bengkel/lab.',
      'Gunakan Limitation penangkal halusinasi: "Jika ada data yang kurang atau tidak pasti, tanyakan kembali kepada saya dan jangan berasumsi."'
    ],
    tips: [
      'Selalu cantumkan dokumen rujukan dalam Konteks (misal: "Berdasarkan manual servis pabrikan Toyota 2018" atau "Standar Nasional Indonesia SNI").',
      'Cek silang hasil luaran AI dengan modul pembelajaran resmi atau guru pembimbing.'
    ]
  }
];

export const INITIAL_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    question: 'Ketika kita memberikan perintah ke AI, apa yang dimaksud dengan istilah "Halusinasi AI" (AI Hallucination)?',
    options: [
      { key: 'A', text: 'AI mati mendadak karena kehabisan baterai server.', isCorrect: false },
      { key: 'B', text: 'AI menghasilkan jawaban yang terdengar meyakinkan padahal datanya salah atau mengada-ada.', isCorrect: true },
      { key: 'C', text: 'AI menolak menjawab karena perintah terlalu panjang.', isCorrect: false },
      { key: 'D', text: 'AI menggunakan bahasa asing yang tidak dipahami pengguna.', isCorrect: false }
    ],
    explanation: 'Halusinasi AI adalah fenomena ketika model bahasa AI mengarang fakta palsu atau menyajikan informasi keliru dengan gaya bahasa yang sangat meyakinkan. Ini sering terjadi jika prompt tidak memiliki Konteks (Context) dan Batasan (Limitations) yang kuat.',
    targetConcept: 'Halusinasi AI'
  },
  {
    id: 2,
    question: 'Di dalam akronim metode RTCL, huruf "R" mewakili elemen apa dan apa fungsinya?',
    options: [
      { key: 'A', text: 'Result, untuk menampilkan hasil akhir dari pencarian web.', isCorrect: false },
      { key: 'B', text: 'Review, untuk memeriksa ejaan kalimat dalam pertanyaan.', isCorrect: false },
      { key: 'C', text: 'Role, untuk menetapkan identitas atau peran profesional yang harus diambil oleh AI.', isCorrect: true },
      { key: 'D', text: 'Requirement, untuk memesan lisensi perangkat lunak AI.', isCorrect: false }
    ],
    explanation: 'Role (Peran) menentukan sudut pandang, tingkat keahlian, dan kosakata yang akan digunakan AI dalam menjawab (misal: Ahli Jaringan TKJ, Mekanik TKR, Ahli Pangan APHPi).',
    targetConcept: 'Role'
  },
  {
    id: 3,
    question: 'Manakah di bawah ini yang merupakan contoh penulisan "Task" (Tugas) yang spesifik dan efektif?',
    options: [
      { key: 'A', text: '"Jelaskan tentang listrik."', isCorrect: false },
      { key: 'B', text: '"Susun 5 langkah troubleshooting instalasi motor listrik 3 fasa yang mengalami overload panas."', isCorrect: true },
      { key: 'C', text: '"Bantu saya belajar."', isCorrect: false },
      { key: 'D', text: '"Coba kamu pikirkan tentang masa depan otomotif."', isCorrect: false }
    ],
    explanation: 'Task yang baik menggunakan kata kerja operasional spesifik (Susun, Rancang, Analisis) dan mencantumkan output konkret (5 langkah troubleshooting motor 3 fasa).',
    targetConcept: 'Task'
  },
  {
    id: 4,
    question: 'Mengapa elemen "Context" (Konteks) sangat krusial dalam menyusun prompt untuk bidang kejuruan SMK?',
    options: [
      { key: 'A', text: 'Supaya AI mengetahui situasi nyata, jenis peralatan bengkel/lab, dan kondisi spesifik permasalahan.', isCorrect: true },
      { key: 'B', text: 'Supaya AI otomatis memberikan nilai 100 kepada siswa.', isCorrect: false },
      { key: 'C', text: 'Agar ukuran file teks prompt menjadi lebih dari 1 Megabyte.', isCorrect: false },
      { key: 'D', text: 'Hanya sebagai hiasan kata agar prompt terlihat panjang.', isCorrect: false }
    ],
    explanation: 'Konteks memberikan fakta penting seperti tipe perangkat (MikroTik RB750, PLC Omron, mesin diesel), kondisi lingkungan, atau gejala kerusakan nyata.',
    targetConcept: 'Context'
  },
  {
    id: 5,
    question: 'Perhatikan kalimat instruksi ini: "Sajikan dalam tabel Markdown 3 kolom, gunakan istilah teknis otomotif, maksimal 150 kata". Kalimat ini termasuk dalam elemen RTCL apa?',
    options: [
      { key: 'A', text: 'Role (Peran)', isCorrect: false },
      { key: 'B', text: 'Task (Tugas)', isCorrect: false },
      { key: 'C', text: 'Context (Konteks)', isCorrect: false },
      { key: 'D', text: 'Limitations (Batasan)', isCorrect: true }
    ],
    explanation: 'Limitations mengatur bentuk penyajian (tabel Markdown), batasan panjang (maksimal 150 kata), dan aturan gaya bahasa (istilah teknis).',
    targetConcept: 'Limitations'
  },
  {
    id: 6,
    question: 'Seorang siswa jurusan APHPi (Pengolahan Hasil Perikanan) ingin membuat SOP pengalengan ikan sarden. Prompt mana yang paling memenuhi kaidah RTCL lengkap?',
    options: [
      { key: 'A', text: '"Tolong jelaskan pengalengan ikan sarden yang enak."', isCorrect: false },
      { key: 'B', text: '"Role: Ahli Teknologi Pangan Perikanan. Task: Susun SOP sterilisasi retort autoclave ikan sarden. Context: Industri UMKM skala 500 kaleng/hari. Limitations: Format poin 1-5, bahasa Indonesia baku, sertakan suhu & waktu pemanasan."', isCorrect: true },
      { key: 'C', text: '"Ikan sarden kaleng adalah makanan bergizi tinggi tolong ceritakan sejarahnya."', isCorrect: false },
      { key: 'D', text: '"Buat SOP ikan sarden sekarang."', isCorrect: false }
    ],
    explanation: 'Pilihan B memenuhi keempat pilar: Role (Ahli Teknologi Pangan), Task (SOP sterilisasi retort), Context (UMKM 500 kaleng/hari), dan Limitations (poin 1-5, bahasa baku, suhu & waktu).',
    targetConcept: 'Limitations'
  }
];
