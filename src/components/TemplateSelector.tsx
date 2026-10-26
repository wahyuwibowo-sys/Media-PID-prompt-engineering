import { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Building2, 
  Eye, 
  BrainCircuit, 
  BookOpen, 
  Megaphone, 
  Video, 
  Code2, 
  Sparkles,
  Search,
  Check,
  ChevronRight,
  Fish,
  Network,
  Wrench,
  Zap
} from 'lucide-react';
import { RTCLTemplate, TemplateCategory } from '../types/rtcl';
import { RTCL_TEMPLATES, CATEGORIES } from '../data/templates';

interface TemplateSelectorProps {
  onSelectTemplate: (template: RTCLTemplate) => void;
  activeTemplateId?: string;
}

export function TemplateSelector({ onSelectTemplate, activeTemplateId }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-indigo-500" />;
      case 'Eye': return <Eye className="w-4 h-4 text-teal-500" />;
      case 'BrainCircuit': return <BrainCircuit className="w-4 h-4 text-purple-500" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-sky-500" />;
      case 'Megaphone': return <Megaphone className="w-4 h-4 text-rose-500" />;
      case 'Video': return <Video className="w-4 h-4 text-pink-500" />;
      case 'Code2': return <Code2 className="w-4 h-4 text-emerald-500" />;
      case 'Fish': return <Fish className="w-4 h-4 text-teal-500" />;
      case 'Network': return <Network className="w-4 h-4 text-blue-500" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-rose-500" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-500" />;
      default: return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const filteredTemplates = useMemo(() => {
    return RTCL_TEMPLATES.filter((tpl) => {
      const matchCategory = selectedCategory === 'Semua' || tpl.category === selectedCategory;
      const matchSearch = 
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.data.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Pilihan Template Siap Pakai
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pilih template spesifik untuk langsung mengisi parameter Role, Task, Context, & Limitations
          </p>
        </div>

        {/* Search within templates */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari template (contoh: modul, supervisi)..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        <button
          onClick={() => setSelectedCategory('Semua')}
          className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            selectedCategory === 'Semua'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Semua ({RTCL_TEMPLATES.length})
        </button>
        {CATEGORIES.map((category) => {
          const count = RTCL_TEMPLATES.filter((t) => t.category === category).length;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {filteredTemplates.map((template) => {
          const isSelected = activeTemplateId === template.id;
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              className={`group text-left p-3 rounded-xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-600'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {getIcon(template.iconName)}
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {template.category}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {template.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-medium text-blue-600 dark:text-blue-400">
                <span>{isSelected ? 'Sedang Digunakan' : 'Terapkan'}</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                )}
              </div>
            </button>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-8 text-center text-xs text-slate-500 dark:text-slate-400">
            Tidak ditemukan template dengan kata kunci &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}
