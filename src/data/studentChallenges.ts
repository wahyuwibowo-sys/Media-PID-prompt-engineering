import { StudentChallenge } from '../types/rtcl';

export const STUDENT_CHALLENGES: StudentChallenge[] = [
  // 1. APHPi
  {
    id: 'challenge-aphpi',
    title: 'Pengolahan & Pengemasan Bandeng Cabut Duri (APHPi)',
    subject: 'Agribisnis Pengolahan Hasil Perikanan (APHPi)',
    scenario: 'Siswa kelas 11 APHPi sedang melakukan praktik diversifikasi olahan hasil perikanan yaitu Bandeng Cabut Duri higienis dalam kemasan vakum beku agar dapat dipasarkan ke luar kota tanpa bahan pengawet kimia.',
    goal: 'Buat prompt RTCL agar AI menyusun SOP sanitasi peralatan, langkah pencabutan 164 duri halus bandeng, dan pengaturan suhu vacuum sealer.',
    sampleRole: 'Supervisor Pengendalian Mutu (Quality Control) Industri Pengolahan Ikan Modern',
    sampleTask: 'Susun draf Standar Operasional Prosedur (SOP) pengolahan bandeng cabut duri mulai dari penyiangan, pencabutan duri, perendaman air es garam, hingga pengemasan vakum',
    sampleContext: 'Bahan baku 50 kg bandeng segar ukuran 3-4 ekor/kg di laboratorium pengolahan perikanan sekolah dengan suhu ruang olah terjaga 18-20°C',
    sampleLimitations: 'Gunakan Bahasa Indonesia baku, sajikan dalam bentuk tabel urutan proses, cantumkan titik kritis HACCP, dan batas maksimal 350 kata'
  },

  // 2. TKJ
  {
    id: 'challenge-tkj',
    title: 'Troubleshooting Jaringan Fiber Optic & MikroTik (TKJ)',
    subject: 'Teknik Komputer & Jaringan (TKJ)',
    scenario: 'Koneksi internet antar-gedung sekolah mengalami penurunan bandwidth drastis dan packet loss tinggi. Jalur menggunakan kabel fiber optic single-mode dan router MikroTik RB4011.',
    goal: 'Buat prompt RTCL agar AI memandu pengecekan redaman kabel dengan Optical Power Meter (OPM) dan analisis bottleneck antarmuka SFP MikroTik.',
    sampleRole: 'Senior Network Infrastructure & Fiber Optic Specialist (MikroTik MTCNA/MTCRE)',
    sampleTask: 'Rancang panduan sistematis tahap demi tahap untuk mendiagnosis redaman tinggi fiber optic dan optimasi routing queue pada router utama',
    sampleContext: 'Jarak kabel 450 meter antar-gedung sekolah, redaman terbaca -28 dBm (melebihi standar aman -20 dBm), lampu indikator link berkedip tidak stabil',
    sampleLimitations: 'Urutkan dari inspeksi konektor patchcord SC-UPC, pengukuran titik putus via OTDR, hingga perintah terminal CLI MikroTik. Bahasa teknis lugas, maksimal 300 kata'
  },

  // 3. TKR
  {
    id: 'challenge-tkr',
    title: 'Diagnosa Kerusakan Mesin EFI & Sensor Oksigen (TKR)',
    subject: 'Teknik Kendaraan Ringan (TKR / Otomotif)',
    scenario: 'Mobil praktik bengkel otomotif mengeluarkan asap hitam berbau bensin mentah, konsumsi bahan bakar sangat boros, dan lampu MIL Check Engine menyala terus.',
    goal: 'Buat prompt RTCL agar AI menjelaskan pembacaan data live stream scanner OBD-II pada parameter Short Term Fuel Trim (STFT) dan tegangan Sensor Oksigen (O2).',
    sampleRole: 'Instruktur Master Otomotif Spesialis Engine Management System (EMS)',
    sampleTask: 'Berikan alur diagnosa komprehensif untuk melacak penyebab campuran bahan bakar terlalu gemuk (rich mixture) dan langkah pengujian sensor',
    sampleContext: 'Mesin bensin 1300cc 4 silinder DOHC VVT-i, scanner menampilkan DTC P0172 (System Too Rich Bank 1), busi menghitam tertutup jelaga karbon',
    sampleLimitations: 'Gunakan prinsip diagnosa 5W+1H, sertakan nilai spesifikasi tegangan multimeter normal (0.1 - 0.9 Volt), format poin bernomor teratur, maksimal 350 kata'
  },

  // 4. TITL
  {
    id: 'challenge-titl',
    title: 'Rangkaian Kontrol Motor 3 Fasa Star-Delta Otomatis (TITL)',
    subject: 'Teknik Instalasi Tenaga Listrik (TITL)',
    scenario: 'Siswa ditugaskan merakit panel kendali motor induksi 3 fasa 11 kW di bengkel listrik dengan sistem pengasutan Star-Delta otomatis menggunakan 3 kontaktor magnet dan timer TDR.',
    goal: 'Buat prompt RTCL agar AI menyajikan cara pengawatan rangkaian daya dan kontrol serta setting waktu timer yang aman sesuai standar PUIL 2011.',
    sampleRole: 'Electrical Installation Engineer & Instruktur Otomasi Industri Tenaga Listrik',
    sampleTask: 'Rancang penjelasan alur kerja rangkaian daya dan rangkaian kendali pengasutan bintang-segitiga lengkap dengan proteksi beban lebih (TOR)',
    sampleContext: 'Tegangan jala-jala 380V fasa-fasa, arus nominal motor 22A, kontaktor utama (K1), kontaktor delta (K2), kontaktor star (K3), dan relay penunda waktu (Timer)',
    sampleLimitations: 'Sertakan urutan penomoran kontak bantu NO/NC (13-14, 21-22), rumus setting arus TOR (1 x Inominal atau 0.58 x Inominal), bahasa baku teknik listrik'
  },

  // 5. P5 / UMUM
  {
    id: 'challenge-p5',
    title: 'Projek P5 Kewirausahaan Inovasi Produk Pesisir',
    subject: 'P5 (Projek Penguatan Profil Pelajar Pancasila)',
    scenario: 'Kelompok siswa lintas jurusan merancang ide usaha produk inovatif memanfaatkan potensi pesisir wilayah Gresik Utara (seperti abon ikan, kerupuk bandeng, solar dryer limbah) dengan kemasan ramah lingkungan.',
    goal: 'Buat prompt RTCL agar AI bertindak sebagai mentor inkubator bisnis siswa yang menyusun rencana bisnis sederhana (Business Model Canvas).',
    sampleRole: 'Fasilitator Inovasi Kewirausahaan Pemuda & Mentor Bisnis Vokasi',
    sampleTask: 'Rancang 9 blok Business Model Canvas (BMC) sederhana dan rencana pameran Gelar Karya P5 sekolah',
    sampleContext: 'Kelompok siswa kelas 10 SMK di wilayah pesisir Sidayu Gresik, modal awal patungan Rp150.000, target penjualan wali murid dan masyarakat lokal',
    sampleLimitations: 'Sajikan dalam bentuk tabel ringkas 9 blok BMC, bahasa komunikatif dan mudah dipahami siswa SMA/SMK, sertakan estimasi keuntungan'
  }
];
