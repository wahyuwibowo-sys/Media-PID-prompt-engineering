import { useState } from 'react';
import { 
  History, 
  Trash2, 
  Copy, 
  ArrowUpRight, 
  Clock, 
  Search, 
  X,
  Sparkles
} from 'lucide-react';
import { PromptHistoryItem } from '../types/rtcl';

interface PromptHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: PromptHistoryItem[];
  onLoadItem: (item: PromptHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
  onCopyText: (text: string) => void;
}

export function PromptHistory({
  isOpen,
  onClose,
  history,
  onLoadItem,
  onDeleteItem,
  onClearAll,
  onCopyText
}: PromptHistoryProps) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.data.role.toLowerCase().includes(q) ||
      item.data.task.toLowerCase().includes(q) ||
      item.preview.toLowerCase().includes(q) ||
      (item.categoryTag && item.categoryTag.toLowerCase().includes(q))
    );
  });

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Riwayat Prompt
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tersimpan di Local Storage ({history.length} / 20)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Bulk Clear */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari riwayat..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat prompt?')) {
                  onClearAll();
                }
              }}
              className="p-2 text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Hapus semua riwayat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Sparkles className="w-10 h-10 mb-2 stroke-[1.5] text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Belum ada riwayat tersimpan
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                Generate atau salin prompt untuk menyimpannya otomatis di riwayat browser Anda.
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatTimestamp(item.timestamp)}
                    </span>
                    {item.categoryTag && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                        {item.categoryTag}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {item.data.role}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {item.data.task}
                  </p>
                </div>

                {/* Card actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <button
                    onClick={() => {
                      onLoadItem(item);
                      onClose();
                    }}
                    className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>Muat ke Editor</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onCopyText(item.preview)}
                      className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-md"
                      title="Salin Prompt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-center text-slate-400">
          Riwayat disimpan secara lokal di browser Anda (tidak dikirim ke server luar).
        </div>
      </div>
    </div>
  );
}
