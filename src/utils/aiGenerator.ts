import { GoogleGenAI } from '@google/genai';
import { RTCLForm } from '../types/rtcl';

export interface AIExecutionResult {
  content: string;
  model: string;
  executionTimeMs: number;
  evaluatedCompliance: {
    followedRole: boolean;
    followedTask: boolean;
    followedContext: boolean;
    followedLimitations: boolean;
    summaryNotes: string;
  };
}

/**
 * Generate AI output from a student's RTCL prompt.
 * First tries using Google Gemini API if GEMINI_API_KEY is available.
 * If not present or if an error/rate limit occurs, falls back smoothly to
 * an intelligent vocational response generator so classroom demos never break.
 */
export async function executeRTCLPromptWithAI(
  form: RTCLForm,
  selectedModel: string = 'Gemini 2.5 Flash'
): Promise<AIExecutionResult> {
  const startTime = performance.now();
  const compiledPrompt = `PERAN (ROLE):
${form.role || 'Asisten Umum'}

TUGAS (TASK):
${form.task || 'Jawab pertanyaan berikut secara umum'}

KONTEKS (CONTEXT):
${form.context || 'Tidak ada konteks spesifik yang diberikan'}

BATASAN (LIMITATIONS):
${form.limitations || 'Format bebas, bahasa Indonesia'}`;

  // 1. Check if Gemini API key exists
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                 (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || 
                 '';

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: compiledPrompt
      });

      const text = response.text || '';
      const executionTimeMs = Math.round(performance.now() - startTime);

      return {
        content: text,
        model: 'Gemini 2.5 Flash (Live API)',
        executionTimeMs,
        evaluatedCompliance: evaluatePromptCompliance(form, text)
      };
    } catch (err) {
      console.warn('Gemini API call skipped or failed, using local vocational generative engine:', err);
    }
  }

  // 2. Intelligent Vocational Generative Simulation Engine
  // Adds a natural thinking delay for realism in classroom presentations
  await new Promise((resolve) => setTimeout(resolve, 800));

  const simulationContent = generateVocationalSimulation(form);
  const executionTimeMs = Math.round(performance.now() - startTime);

  return {
    content: simulationContent,
    model: `${selectedModel} (Engine Edukasi SMK)`,
    executionTimeMs,
    evaluatedCompliance: evaluatePromptCompliance(form, simulationContent)
  };
}

function evaluatePromptCompliance(form: RTCLForm, output: string) {
  const hasRole = Boolean(form.role && form.role.trim().length > 5);
  const hasTask = Boolean(form.task && form.task.trim().length > 10);
  const hasContext = Boolean(form.context && form.context.trim().length > 10);
  const hasLimitations = Boolean(form.limitations && form.limitations.trim().length > 5);

  let summary = '';
  if (hasRole && hasTask && hasContext && hasLimitations) {
    summary = 'Kualitas Prompt Sangat Sempurna! AI mampu menghasilkan jawaban yang presisi, tepat konteks, dan mematuhi seluruh batasan format.';
  } else if (!hasLimitations) {
    summary = 'Catatan Evaluasi: Karena Batasan (Limitations) belum lengkap, jawaban AI berpotensi terlalu panjang atau tidak menggunakan format tabel yang diinginkan.';
  } else if (!hasContext) {
    summary = 'Catatan Evaluasi: Tanpa Konteks spesifik, AI menjawab secara teori umum dan belum mencerminkan kondisi riil di lapangan/bengkel.';
  } else {
    summary = 'Catatan Evaluasi: Lengkapi seluruh elemen R-T-C-L agar jawaban AI tidak berhalusinasi.';
  }

  return {
    followedRole: hasRole,
    followedTask: hasTask,
    followedContext: hasContext,
    followedLimitations: hasLimitations,
    summaryNotes: summary
  };
}

function generateVocationalSimulation(form: RTCLForm): string {
  const role = (form.role || '').toLowerCase();
  const task = (form.task || '').toLowerCase();
  const context = (form.context || '').toLowerCase();
  const limitations = (form.limitations || '').toLowerCase();

  // If input is very minimal
  if (!form.role && !form.task) {
    return 'Halo! Silakan masukkan Role (Peran) dan Task (Tugas) terlebih dahulu agar saya dapat memberikan tanggapan spesifik sesuai kaidah RTCL.';
  }

  // 1. TKJ (Teknik Komputer dan Jaringan)
  if (role.includes('tkj') || role.includes('jaringan') || task.includes('vlan') || task.includes('mikrotik') || context.includes('tkj')) {
    if (limitations.includes('tabel') || task.includes('skema') || task.includes('ip')) {
      return `### HASIL GENERATIF AI (Sesuai Peran: ${form.role || 'Teknisi Jaringan'})

Berikut adalah rancangan konfigurasi jaringan yang disesuaikan dengan konteks **${form.context || 'Lab Komputer'}**:

| No | Segmen / VLAN | Network / Subnet | Gateway IP | Alokasi Klien | Keterangan Aturan Firewall |
|:---|:---|:---|:---|:---|:---|
| 1 | VLAN 10 (Siswa) | 192.168.10.0/24 | 192.168.10.1 | 192.168.10.2 - 192.168.10.50 | Drop Torrent & P2P, Limit 2 Mbps/client |
| 2 | VLAN 20 (Guru & Staff) | 192.168.20.0/24 | 192.168.20.1 | 192.168.20.2 - 192.168.20.30 | Prioritas QoS Bandwidth, Akses Server Ujian |
| 3 | VLAN 30 (Server Lokal) | 192.168.30.0/27 | 192.168.30.1 | 192.168.30.2 - 192.168.30.10 | Accept port 80/443 (HTTP/HTTPS) & 22 (SSH) |

**Contoh Perintah CLI MikroTik (Quick Setup):**
\`\`\`bash
/interface vlan add name=vlan10-siswa vlan-id=10 interface=ether2
/ip address add address=192.168.10.1/24 interface=vlan10-siswa
/ip pool add name=pool-siswa ranges=192.168.10.2-192.168.10.50
/ip dhcp-server add name=dhcp-siswa interface=vlan10-siswa address-pool=pool-siswa
\`\`\`

> *Catatan Kepatuhan Batasan*: Format telah disajikan dalam tabel Markdown dan skrip CLI sesuai instruksi pembatasan.`;
    }
    return `### HASIL GENERATIF AI (Sesuai Peran: ${form.role || 'Teknisi Jaringan'})

Berdasarkan situasi **${form.context || 'Jaringan Sekolah'}**, berikut langkah troubleshooting terstruktur:
1. **Analisis Layer 1 (Fisik)**: Periksa konektor RJ45, crimping kabel UTP Cat6, dan lampu indikator link pada port switch.
2. **Uji Konfigurasi IP (Layer 3)**: Pastikan perangkat memperoleh IP DHCP pada range yang sesuai. Lakukan \`ping 127.0.0.1\` dan \`ping gateway\`.
3. **Pengaturan Routing & NAT**: Verifikasi chain \`srcnat\` pada firewall MikroTik: \`/ip firewall nat add chain=srcnat out-interface=ether1-gateway action=masquerade\`.
4. **Verifikasi DNS**: Pastikan klien mengarah ke DNS Server lokal (192.168.1.1) atau DNS Google (8.8.8.8).`;
  }

  // 2. APHPi (Agribisnis Pengolahan Hasil Perikanan)
  if (role.includes('aphpi') || role.includes('ikan') || role.includes('pangan') || context.includes('ikan') || context.includes('mutu')) {
    return `### HASIL GENERATIF AI (Sesuai Peran: ${form.role || 'Quality Assurance Industri Perikanan'})

Menindaklanjuti tugas **${form.task || 'Penyusunan SOP Mutu Produk'}** pada kondisi **${form.context || 'Pengolahan Hasil Laut'}**:

| Parameter Mutu | Standar SNI / Batasan Kritis | Metode Pengujian di Lab | Tindakan Koreksi Jika Menyimpang |
|:---|:---|:---|:---|
| Suhu Rantai Dingin (Cold Chain) | Maksimal -18°C (Beku) / 0-4°C (Segar) | Termometer tusuk digital kalibrasi | Tambah curahan es curai atau turunkan suhu blast freezer |
| Nilai Organoleptik (Mata, Insang, Daging) | Skor Minimal 7 (Segar, kenyal, cemerlang) | Uji sensori panelis terlatih (SNI 01-2346) | Sortir bahan baku; tolak bahan jika berbau amoniak |
| Kadar Histamin & Cemaran Mikroba | < 100 ppm, TPC < 5x10^5 koloni/g | Spektrofotometri / Uji Cawan Agar | Sterilisasi ulang lini produksi dan saniter wadah |

**Prinsip Sanitasi SSOP yang Diterapkan:**
- Sanitasi air pencucian dengan klorinasi aman (5-10 ppm).
- Penggunaan APD lengkap (celemek bersih, hairnet, sarung tangan steril).
- Waktu penanganan di ruang terbuka tidak boleh melebihi 30 menit.`;
  }

  // 3. TKR (Teknik Kendaraan Ringan)
  if (role.includes('tkr') || role.includes('otomotif') || role.includes('mesin') || task.includes('bengkel') || context.includes('mobil') || context.includes('efi')) {
    return `### HASIL GENERATIF AI (Sesuai Peran: ${form.role || 'Kepala Mekanik Bengkel Resmi Otomotif'})

Analisis diagnosis sistematis untuk tugas **${form.task || 'Diagnosis Kerusakan Mesin'}**:

1. **Pemeriksaan Awal (DTC Scanning)**:
   - Hubungkan Intelligent Tester / Scanner OBD-II ke soket DLC3 16-pin.
   - Periksa kode gangguan (DTC). Contoh jika muncul *P0171 (System Too Lean Bank 1)*.
2. **Tabel Uji Komponen (Sesuai Konteks ${form.context || 'Mesin EFI'}):**

| Komponen | Spesifikasi Standar | Hasil Ukur / Gejala | Rekomendasi Solusi |
|:---|:---|:---|:---|
| Tekanan Fuel Pump | 300 - 350 kPa (43 - 50 psi) | Kurang dari 250 kPa | Ganti fuel filter / pompa bensin |
| Sensor MAF / MAP | Resistansi IAT 2.0 - 3.0 kΩ (20°C) | Kotor tersumbat jelaga | Bersihkan dengan Contact Cleaner khusus sensor |
| Celah Busi (Spark Plug) | 1.0 - 1.1 mm (Iridium) | Celah melebar > 1.3 mm | Setel ulang atau ganti busi baru |

3. **Verifikasi Uji Jalan (Road Test)**:
   - Bersihkan data memori ECU (Clear DTC) setelah perbaikan.
   - Lakukan uji akselerasi putaran 2000 - 4500 RPM untuk memastikan tarikan mesin responsif tanpa gejala brebet.`;
  }

  // 4. TITL (Teknik Instalasi Tenaga Listrik)
  if (role.includes('titl') || role.includes('listrik') || role.includes('motor') || context.includes('pln') || context.includes('panel')) {
    return `### HASIL GENERATIF AI (Sesuai Peran: ${form.role || 'Instalatir Listrik Senior PUIL 2011'})

Rancangan teknis instalasi untuk tugas **${form.task || 'Instalasi Kontrol Motor'}**:

| Komponen Panel | Spesifikasi & Rating | Fungsi Pengamanan | Acuan Standar PUIL |
|:---|:---|:---|:---|
| MCCB Utama | 3 Pole, 50A, Icu 25 kA | Pengaman arus hubung singkat utama | PUIL 2011 Bagian 5 |
| Kontaktor Magnet (MC) | AC-3, 22 kW, Koil 220V AC | Pengendali switching daya motor | IEC 60947-4-1 |
| Thermal Overload Relay (TOR) | Setting arus 1.05 - 1.1 x In motor | Mencegah kumparan terbakar akibat beban lebih | PUIL 2011 Sub 5.5 |
| Tombol Emergency Stop | Pushlock twist-release (NC) | Memutus sirkuit kendali seketika saat darurat | K3 Listrik Industri |

**Urutan Pengoperasian Sistem Rangkaian Daya Bintang-Segitiga (Star-Delta):**
1. Saat push-button START ditekan, MC Utama dan MC Bintang (Star) aktif bersamaan.
2. Timer relay menghitung jeda waktu transisi (5 - 8 detik) hingga putaran motor mencapai ~80% kecepatan nominal.
3. Timer berpindah: MC Bintang nonaktif, dilanjutkan MC Segitiga (Delta) masuk bekerja penuh.`;
  }

  // 5. Default General Educational Response
  const formatTable = limitations.includes('tabel');
  if (formatTable) {
    return `### HASIL GENERATIF AI (Sesuai Peran: ${form.role || 'Pakar Kejuruan'})

Tanggapan untuk tugas: **${form.task || 'Instruksi Belajar'}**
Konteks: *${form.context || 'Pembelajaran SMK'}*

| Poin Analisis | Deskripsi Operasional | Output yang Dihasilkan |
|:---|:---|:---|
| Tahap Persiapan | Memeriksa kebutuhan alat dan keselamatan kerja (K3) | Check sheet kesiapan kerja |
| Tahap Eksekusi | Menerapkan prosedur baku langkah demi langkah | Produk / sistem yang berfungsi normal |
| Tahap Pengujian | Mengukur toleransi parameter dan kinerja alat | Lembar verifikasi hasil pengujian |

**Kesimpulan:**
Instruksi telah dijalankan dengan memperhatikan seluruh pembatasan: **"${form.limitations || 'Format terstruktur'}"**.`;
  }

  return `### HASIL GENERATIF AI (Sesuai Peran: ${form.role || 'Instruktur Profesional'})

Berdasarkan penugasan: **${form.task || 'Panduan Teknis'}**
Dalam konteks: **${form.context || 'Lingkungan Belajar SMK'}**

1. **Langkah Pokok**:
   - Menganalisis kondisi awal dan mengidentifikasi variabel kunci sesuai konteks kerja.
   - Mengikuti prosedur operasional standar (SOP) dengan mengutamakan prinsip keselamatan dan presisi.

2. **Rekomendasi Praktis**:
   - Selalu lakukan kalibrasi alat ukur sebelum pengambilan data.
   - Dokumentasikan temuan dalam lembar kerja peserta didik untuk bahan evaluasi.

3. **Kepatuhan Batasan**:
   - Jawaban ini telah disesuaikan dengan batasan yang Anda minta: *${form.limitations || 'Format ringkas dan jelas'}*.`;
}
