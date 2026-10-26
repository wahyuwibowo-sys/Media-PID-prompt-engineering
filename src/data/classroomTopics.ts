import { ClassroomTopic } from '../types/classroom';

export const DEFAULT_CLASSROOM_TOPICS: ClassroomTopic[] = [
  // =========================================================================
  // 1. JURUSAN APHPi (Agribisnis Pengolahan Hasil Perikanan)
  // =========================================================================
  {
    id: 'aphpi-bandeng-cabut-duri',
    title: 'SOP Higienitas & Pengolahan Bandeng Cabut Duri Kemasan Vakum',
    jurusan: 'APHPi',
    category: 'APHPi (Agribisnis Pengolahan Hasil Perikanan)',
    description: 'Unit produksi sekolah mengolah ikan bandeng segar lokal menjadi bandeng cabut duri siap olah. Dibutuhkan SOP pencegahan kontaminasi silang bakteri Histamin dan tata cara pengemasan vakum agar tahan simpan 30 hari.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Quality Control (QC) Manager Industri Perikanan yang menyusun lembar SOP sanitasi peralatan, teknik pencabutan duri tanpa merusak daging, dan parameter seal kemasan vakum.',
    difficulty: 'Sedang'
  },
  {
    id: 'aphpi-haccp-bakso-ikan',
    title: 'Penerapan Titik Kendali Kritis (CCP) HACCP pada Produksi Bakso Ikan',
    jurusan: 'APHPi',
    category: 'APHPi (Agribisnis Pengolahan Hasil Perikanan)',
    description: 'Siswa memproduksi bakso ikan surimi dalam skala bengkel pengolahan. Guru meminta siswa mengidentifikasi potensi bahaya fisik, biologis, dan kimia pada tahap penerimaan bahan baku ikan dan perebusan (cooking).',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Auditor Keamanan Pangan SNI/BPOM yang merumuskan matriks HACCP 7 prinsip lengkap dengan batas kritis suhu rebusan dan tindakan koreksi.',
    difficulty: 'Tantangan Tinggi'
  },
  {
    id: 'aphpi-kerupuk-ikan-organoleptik',
    title: 'Formulasi Nilai Tambah Kerupuk Ikan & Lembar Uji Sensori Organoleptik',
    jurusan: 'APHPi',
    category: 'APHPi (Agribisnis Pengolahan Hasil Perikanan)',
    description: 'Meningkatkan nilai jual hasil tangkapan nelayan dengan mengolah ikan rucah menjadi kerupuk ikan kaya kalsium dan omega-3. Diperlukan pengujian sensori rasa, aroma, kerenyahan, dan warna dari panelis konsumen.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Spesialis Formulasi Produk Pangan Laut yang membuatkan komposisi resep adonan serta lembar uji skoring hedonik skala 1-9 standar BSN.',
    difficulty: 'Mudah'
  },
  {
    id: 'aphpi-pengawetan-chilling-freezing',
    title: 'Manajemen Rantai Dingin (Cold Chain) & Pembekuan Air Blast Freezer',
    jurusan: 'APHPi',
    category: 'APHPi (Agribisnis Pengolahan Hasil Perikanan)',
    description: 'Kapal latih sekolah mendaratkan 200 kg ikan kakap merah dan kerapu. Suhu ikan harus dipertahankan di bawah 4°C selama transportasi dan dibekukan cepat pada suhu -35°C di ruang ABF untuk mencegah kemunduran mutu.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Teknisi Rantai Dingin dan Pasca Panen Perikanan yang memberikan instruksi rasio es batu vs ikan, tahapan glazing, dan pencegahan freezer burn.',
    difficulty: 'Sedang'
  },

  // =========================================================================
  // 2. JURUSAN TKJ (Teknik Komputer dan Jaringan)
  // =========================================================================
  {
    id: 'tkj-vlan-mikrotik',
    title: 'Konfigurasi VLAN Trunking & Keamanan Jaringan Router MikroTik',
    jurusan: 'TKJ',
    category: 'TKJ (Teknik Komputer dan Jaringan)',
    description: 'Laboratorium komputer sekolah ingin membagi jaringan fisik menjadi 3 segmen virtual: VLAN 10 (Guru), VLAN 20 (Siswa/Praktik), dan VLAN 30 (Server). Antar-VLAN tidak boleh saling ping kecuali ke gateway internet.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Network Engineer Senior bersertifikat MTCNA yang menyusun skrip CLI konfigurasi bridge VLAN filtering, DHCP Server per VLAN, dan aturan Firewall Filter.',
    difficulty: 'Sedang'
  },
  {
    id: 'tkj-fiber-optic-ftth',
    title: 'Penyambungan Kabel Fiber Optic (Splicing) & Analisis Redaman OTDR',
    jurusan: 'TKJ',
    category: 'TKJ (Teknik Komputer dan Jaringan)',
    description: 'Terjadi pemutusan kabel drop core fiber optic akibat tertimpa dahan pohon di jalur antar-gedung sekolah. Siswa harus melakukan fusion splicing dan mengukur nilai insertion loss agar tidak melebihi 0.2 dB per splice.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Supervisor Fiber Optic Telekomunikasi yang memandu urutan pengupasan core kabel, pemotongan cleaver presisi, kalibrasi fusion splicer, dan interpretasi grafik OTDR.',
    difficulty: 'Tantangan Tinggi'
  },
  {
    id: 'tkj-server-debian-web',
    title: 'Deployment Web Server Linux Debian dengan DNS BIND9 & SSL HTTPS',
    jurusan: 'TKJ',
    category: 'TKJ (Teknik Komputer dan Jaringan)',
    description: 'Siswa ditugaskan membangun server intranet mandiri menggunakan sistem operasi Debian 12 untuk portal e-learning sekolah dengan nama domain lokal smkn1sidayu.sch.id dan enkripsi sertifikat SSL.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Linux System Administrator yang menyajikan langkah instalasi Nginx/Apache2, konfigurasi file forward/reverse zone BIND9, dan verifikasi nslookup.',
    difficulty: 'Sedang'
  },
  {
    id: 'tkj-hotspot-bandwith-qos',
    title: 'Manajemen Bandwidth Simple Queue & Captive Portal Hotspot Sekolah',
    jurusan: 'TKJ',
    category: 'TKJ (Teknik Komputer dan Jaringan)',
    description: 'Akses internet di area perpustakaan sering lambat karena beberapa perangkat mengunduh file besar tanpa batas. Diperlukan sistem voucher hotspot berbasis User Manager dan pembatasan bandwidth 2 Mbps/1 Mbps per user.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Network Administrator yang merancang skema QoS Simple Queue dengan burst threshold, login page kustom HTML, dan isolasi klien non-otentikasi.',
    difficulty: 'Mudah'
  },

  // =========================================================================
  // 3. JURUSAN TKR (Teknik Kendaraan Ringan / Otomotif)
  // =========================================================================
  {
    id: 'tkr-diagnosa-dtc-efi',
    title: 'Diagnosa Kerusakan Electronic Fuel Injection (EFI) via Scanner OBD-II',
    jurusan: 'TKR',
    category: 'TKR (Teknik Kendaraan Ringan)',
    description: 'Mobil praktik mesin Avanza/Xenia mengalami mesin pincang pada putaran idle dan lampu Check Engine menyala. Scanner mendeteksi kode DTC P0301 (Cylinder 1 Misfire) dan P0115 (Engine Coolant Temp Circuit Malfunction).',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Kepala Mekanik Otomotif Senior yang memberikan alur troubleshooting step-by-step: pengecekan koil pengapian, resistansi sensor ECT dengan multimeter, dan cara clear DTC.',
    difficulty: 'Sedang'
  },
  {
    id: 'tkr-overhaul-blok-silinder',
    title: 'Prosedur Overhaul & Pengukuran Keausan Silinder Blok Mesin',
    jurusan: 'TKR',
    category: 'TKR (Teknik Kendaraan Ringan)',
    description: 'Mesin 4 silinder mengalami penurunan kompresi dan mengeluarkan asap putih pada knalpot. Siswa harus membongkar silinder blok untuk mengukur ketirusan dan keovalan lubang silinder menggunakan Cylinder Bore Gauge.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Instruktur Engine Overhaul yang menyajikan prosedur pelepasan komponen terurut, teknik kalibrasi mikrometer ke bore gauge pada 3 posisi (atas, tengah, bawah), dan batas toleransi servis.',
    difficulty: 'Tantangan Tinggi'
  },
  {
    id: 'tkr-rem-abs-bleeding',
    title: 'Perawatan Sistem Rem Anti-lock Braking System (ABS) & Pembuangan Udara',
    jurusan: 'TKR',
    category: 'TKR (Teknik Kendaraan Ringan)',
    description: 'Pedal rem terasa empuk dan dalam saat diinjak (spongy pedal) setelah penggantian kampas rem cakram dan selang fleksibel. Siswa harus memastikan tidak ada gelembung udara yang terjebak di dalam unit hidrolik modul ABS.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Master Teknisi Chasis & Sistem Rem yang memandu urutan bleeding roda terjauh ke terdekat serta prosedur keselamatan minyak rem DOT 4.',
    difficulty: 'Sedang'
  },
  {
    id: 'tkr-tuneup-uji-emisi',
    title: 'Perawatan Berkala (Tune-Up) & Kalibrasi Emisi Gas Buang Mesin Bensin',
    jurusan: 'TKR',
    category: 'TKR (Teknik Kendaraan Ringan)',
    description: 'Siswa menyiapkan kendaraan pelanggan untuk uji kelayakan emisi gas buang tahunan. Parameter gas buang karbon monoksida (CO) dan hidrokarbon (HC) harus memenuhi ambang batas baku mutu Kementerian Lingkungan Hidup.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Penguji Uji Emisi Kendaraan Bermotor yang menyusun checklist 15 poin pemeriksaan tune-up (busi, filter udara, celah katup, timing pengapian) dan analisis rasio lambda gas buang.',
    difficulty: 'Mudah'
  },

  // =========================================================================
  // 4. JURUSAN TITL (Teknik Instalasi Tenaga Listrik)
  // =========================================================================
  {
    id: 'titl-star-delta-motor',
    title: 'Rangkaian Pengasutan Motor 3 Fasa Bintang-Segitiga (Star-Delta) Otomatis',
    jurusan: 'TITL',
    category: 'TITL (Teknik Instalasi Tenaga Listrik)',
    description: 'Motor induksi 3 fasa 15 kW untuk pompa intake air laut membutuhkan sistem starter pengasutan otomatis menggunakan 3 buah kontaktor magnet dan Time Delay Relay (TDR) guna menurunkan lonjakan arus start (inrush current).',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Electrical Control Engineer yang menjelaskan prinsip kerja rangkaian daya dan rangkaian kontrol, setting timer perpindahan Star ke Delta, serta pemasangan Thermal Overload Relay (TOR).',
    difficulty: 'Sedang'
  },
  {
    id: 'titl-panel-phb-gedung',
    title: 'Desain Panel Hubung Bagi (PHB) 3 Fasa Standar PUIL 2011 & Keseimbangan Beban',
    jurusan: 'TITL',
    category: 'TITL (Teknik Instalasi Tenaga Listrik)',
    description: 'Siswa merancang instalasi panel distribusi listrik gedung laboratorium 3 lantai. Beban penerangan dan stop kontak 1 fasa harus didistribusikan seimbang pada fasa R, S, T dengan proteksi pemutus beban MCCB dan ELCB anti-setrum.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Ahli Madya Instalasi Listrik Bangunan yang menghitung rekapitulasi daya (Watt ke Ampere), ukuran busbar tembaga, pemilihan penampang kabel NYY, dan tahanan pembumian (grounding < 5 Ohm).',
    difficulty: 'Tantangan Tinggi'
  },
  {
    id: 'titl-plc-konveyor-otomasi',
    title: 'Pemrograman PLC (Ladder Diagram) untuk Kendali Mesin Konveyor & Sensor Proximity',
    jurusan: 'TITL',
    category: 'TITL (Teknik Instalasi Tenaga Listrik)',
    description: 'Siswa membangun miniatur jalur konveyor pemilah barang otomatis di industri pengemasan. Sensor induktif mendeteksi benda logam dan mengaktifkan silinder pneumatik untuk mendorong barang ke jalur B, sedangkan benda non-logam lanjut ke jalur A.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Automation Engineer yang menyusun diagram tangga (Ladder Diagram) PLC lengkap dengan pengalamatan input sensor, timer delay, coil output solenoid, dan tombol emergency stop.',
    difficulty: 'Tantangan Tinggi'
  },
  {
    id: 'titl-plts-rooftop-on-grid',
    title: 'Instalasi Pembangkit Listrik Tenaga Surya (PLTS) Atap On-Grid 5 kWp',
    jurusan: 'TITL',
    category: 'TITL (Teknik Instalasi Tenaga Listrik)',
    description: 'Sekolah mengimplementasikan energi baru terbarukan (EBT) dengan memasang modul panel surya fotovoltaik (PV) monokristalin di atap gedung bengkel, dihubungkan ke inverter sinkron on-grid PLN dan meteran kWh net-metering.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Konsultan Energi Surya & Listrik Tenaga Surya yang menyusun diagram satu garis (Single Line Diagram), perhitungan string PV, proteksi DC Fuse, Surge Arrester SPD, dan aspek K3 pemasangan atap.',
    difficulty: 'Sedang'
  },

  // =========================================================================
  // 5. PROJEK P5 KEJURUAN / UMUM
  // =========================================================================
  {
    id: 'p5-inovasi-kemasan-pesisir',
    title: 'Projek P5 Rekayasa & Teknologi: Mesin Pengering Ikan Higienis Efek Rumah Kaca (Solar Dryer)',
    jurusan: 'Umum / P5',
    category: 'Projek P5 (Kewirausahaan & Rekayasa Teknologi)',
    description: 'Kolaborasi lintas jurusan (APHPi, TITL, TKR, TKJ): membuat solar dryer ikan tenaga surya dengan monitoring suhu/kelembaban via IoT untuk membantu nelayan setempat saat musim hujan.',
    challengeGoal: 'Susun prompt RTCL agar AI bertindak sebagai Mentor Fasilitator P5 yang memetakan pembagian peran teknis 4 jurusan, linimasa proyek 4 minggu, dan rubrik asesmen dimensi Profil Pelajar Pancasila.',
    difficulty: 'Sedang'
  }
];

export const JURUSAN_LIST: { id: string; name: string; badge: string; color: string }[] = [
  { id: 'Semua', name: 'Semua Jurusan', badge: 'Semua', color: 'bg-slate-700 text-white' },
  { id: 'APHPi', name: 'Agribisnis Pengolahan Hasil Perikanan (APHPi)', badge: 'APHPi', color: 'bg-teal-600 text-white' },
  { id: 'TKJ', name: 'Teknik Komputer & Jaringan (TKJ)', badge: 'TKJ', color: 'bg-blue-600 text-white' },
  { id: 'TKR', name: 'Teknik Kendaraan Ringan / Otomotif (TKR)', badge: 'TKR', color: 'bg-rose-600 text-white' },
  { id: 'TITL', name: 'Teknik Instalasi Tenaga Listrik (TITL)', badge: 'TITL', color: 'bg-amber-600 text-slate-950 font-black' },
  { id: 'Umum / P5', name: 'Projek P5 / Kolaborasi', badge: 'P5', color: 'bg-purple-600 text-white' }
];
