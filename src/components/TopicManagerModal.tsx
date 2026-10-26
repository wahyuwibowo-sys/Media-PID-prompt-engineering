import { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Plus, 
  Trash2, 
  Check, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ClassroomTopic, JurusanSMK } from '../types/classroom';
import { saveCustomTopic, deleteCustomTopic } from '../utils/classroomDb';

interface TopicManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: ClassroomTopic[];
  onRefreshTopics: (topics: ClassroomTopic[]) => void;
  onSelectTopicToArena: (topic: ClassroomTopic) => void;
  onNotice: (title: string, message: string) => void;
}

export function TopicManagerModal({
  isOpen,
  onClose,
  topics,
  onRefreshTopics,
  onSelectTopicToArena,
  onNotice
}: TopicManagerModalProps) {
  const [filterJurusan, setFilterJurusan] = useState<string>('Semua');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newJurusan, setNewJurusan] = useState<JurusanSMK>('APHPi');
  const [newCategory, setNewCategory] = useState('Agribisnis Pengolahan Hasil Perikanan (APHPi)');
  const [newDescription, setNewDescription] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Mudah' | 'Sedang' | 'Tantangan Tinggi'>('Sedang');

  if (!isOpen) return null;

  const handleJurusanChange = (j: JurusanSMK) => {
    setNewJurusan(j);
    switch (j) {
      case 'APHPi': setNewCategory('Agribisnis Pengolahan Hasil Perikanan (APHPi)'); break;
      case 'TKJ': setNewCategory('Teknik Komputer & Jaringan (TKJ)'); break;
      case 'TKR': setNewCategory('Teknik Kendaraan Ringan (TKR)'); break;
      case 'TITL': setNewCategory('Teknik Instalasi Tenaga Listrik (TITL)'); break;
      default: setNewCategory('Projek P5 / Kolaborasi Kejuruan'); break;
    }
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const updated = saveCustomTopic({
      title: newTitle.trim(),
      jurusan: newJurusan,
      category: newCategory.trim(),
      description: newDescription.trim(),
      challengeGoal: newGoal.trim() || `Susun prompt RTCL untuk menyelesaikan kasus ${newTitle}.`,
      difficulty: newDifficulty
    });

    onRefreshTopics(updated);
    setIsAddingNew(false);
    setNewTitle('');
    setNewDescription('');
    setNewGoal('');
    onNotice('Topik Berhasil Ditambahkan', `Topik "${newTitle}" untuk jurusan ${newJurusan} telah ditambahkan ke bank soal kelas.`);
  };

  const handleDeleteCustom = (id: string) => {
    const updated = deleteCustomTopic(id);
    onRefreshTopics(updated);
    onNotice('Topik Dihapus', 'Topik kustom berhasil dihapus dari bank soal.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in-50 zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-slate-100">
                Bank Topik & Tugas Guru
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Pilih topik untuk lomba di papan tulis atau tambahkan topik tugas praktikum hari ini
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daftar Topik Tersedia ({topics.length})
            </span>

            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'Tutup Form Tambah' : 'Tambah Topik Kustom Guru'}</span>
            </button>
          </div>

          {/* New Topic Form */}
          {isAddingNew && (
            <form onSubmit={handleCreateTopic} className="p-4 rounded-2xl border-2 border-blue-400/50 bg-blue-50/50 dark:bg-slate-800 space-y-3">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Tambah Topik Latihan / Ujian Praktik Baru
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jurusan SMK *
                  </label>
                  <select
                    value={newJurusan}
                    onChange={(e) => handleJurusanChange(e.target.value as JurusanSMK)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="APHPi">APHPi (Hasil Perikanan)</option>
                    <option value="TKJ">TKJ (Komputer & Jaringan)</option>
                    <option value="TKR">TKR (Kendaraan Ringan)</option>
                    <option value="TITL">TITL (Instalasi Tenaga Listrik)</option>
                    <option value="Umum / P5">Umum / Projek P5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Judul Topik / Studi Kasus *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Setting Routing OSPF / Uji Bandeng Cabut Duri"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori / Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Masalah / Kasus Nyata *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Jelaskan situasi masalah yang harus dipecahkan siswa..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Misi Tantangan RTCL Siswa
                  </label>
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Contoh: Susun prompt RTCL agar AI bertindak sebagai..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tingkat Kesulitan
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Tantangan Tinggi">Tantangan Tinggi</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Simpan Topik ke Bank Soal
                </button>
              </div>
            </form>
          )}

          {/* Filter Topics by Jurusan pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-bold text-slate-500 mr-1">Filter Jurusan:</span>
            {['Semua', 'APHPi', 'TKJ', 'TKR', 'TITL', 'Umum / P5'].map((j) => (
              <button
                key={j}
                onClick={() => setFilterJurusan(j)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  filterJurusan === j
                    ? j === 'APHPi'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : j === 'TKJ'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : j === 'TKR'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : j === 'TITL'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {j}
              </button>
            ))}
          </div>

          {/* Topics List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topics
              .filter((topic) => filterJurusan === 'Semua' || topic.jurusan === filterJurusan)
              .map((topic) => (
              <div
                key={topic.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      topic.jurusan === 'APHPi'
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        : topic.jurusan === 'TKJ'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : topic.jurusan === 'TKR'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : topic.jurusan === 'TITL'
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {topic.jurusan}
                    </span>
                    <div className="flex items-center gap-1">
                      {topic.isCustom && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          Kustom Guru
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-500">
                        {topic.difficulty}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {topic.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => {
                      onSelectTopicToArena(topic);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-3 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>Pasang ke Papan Tulis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {topic.isCustom && (
                    <button
                      onClick={() => handleDeleteCustom(topic.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 ml-2"
                      title="Hapus topik kustom"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-800 dark:bg-slate-700 text-white rounded-xl shadow-xs"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
