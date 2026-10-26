import { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FileType, 
  Hash, 
  Layers, 
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { RTCLForm, OutputFormat, StudentProfile, RTCLAuditScore } from '../types/rtcl';
import { formatRTCLPrompt, calculateMetrics, downloadPromptAsTxt } from '../utils/formatters';

interface PromptOutputProps {
  form: RTCLForm;
  format: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
  onCopy: (content: string) => void;
  studentProfile?: StudentProfile;
  auditScore?: RTCLAuditScore;
  isStudentMode?: boolean;
}

export function PromptOutput({
  form,
  format,
  onFormatChange,
  onCopy,
  studentProfile,
  auditScore,
  isStudentMode
}: PromptOutputProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedPrompt = formatRTCLPrompt(form, format);
  const { charCount, wordCount, estimatedTokens } = calculateMetrics(formattedPrompt);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedPrompt);
    setCopied(true);
    onCopy(formattedPrompt);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    const filename = form.customTitle || form.role.slice(0, 20) || 'rtcl_prompt';
    const studentInfo = isStudentMode && studentProfile ? {
      name: studentProfile.name,
      className: studentProfile.className,
      attendanceNumber: studentProfile.attendanceNumber,
      schoolName: studentProfile.schoolName,
      score: auditScore?.totalScore,
      grade: auditScore?.grade
    } : undefined;

    downloadPromptAsTxt(formattedPrompt, filename, studentInfo);
  };

  const openExternalAI = (url: string) => {
    // Also copy to clipboard so they can directly paste into the opened AI tool
    navigator.clipboard.writeText(formattedPrompt);
    onCopy(formattedPrompt);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm transition-all flex flex-col ${
        isExpanded ? 'fixed inset-4 z-50 overflow-y-auto max-w-5xl mx-auto shadow-2xl' : 'h-full'
      }`}
    >
      {/* Header section with formats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Hasil Prompt RTCL
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                Siap Pakai
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Prompt tersusun rapi dengan hierarki instruksi yang mudah dipahami model AI.
          </p>
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 overflow-x-auto">
          <button
            onClick={() => onFormatChange('standard_id')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              format === 'standard_id'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Format standar kapital RTCL Bahasa Indonesia"
          >
            Standar ID
          </button>
          <button
            onClick={() => onFormatChange('markdown')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              format === 'markdown'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Format Markdown dengan subjudul dan quote"
          >
            Markdown
          </button>
          <button
            onClick={() => onFormatChange('standard_en')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              format === 'standard_en'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Format RTCL Bahasa Inggris"
          >
            English
          </button>
          <button
            onClick={() => onFormatChange('paragraph')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              format === 'paragraph'
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Satu paragraf padat mengalir"
          >
            Paragraf
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 ml-0.5 rounded-lg"
            title={isExpanded ? 'Kecilkan tampilan' : 'Perbesar layar penuh'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Prompt Display Container */}
      <div className="relative flex-1 min-h-[280px] bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl p-4 sm:p-5 font-mono text-xs sm:text-sm border border-slate-800 shadow-inner flex flex-col justify-between overflow-hidden">
        <div className="overflow-y-auto max-h-[380px] pr-2 scrollbar-thin select-all leading-relaxed whitespace-pre-wrap">
          {formattedPrompt}
        </div>

        {/* Live Metrics bar */}
        <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-blue-400" />
              {charCount} karakter
            </span>
            <span className="flex items-center gap-1">
              <FileType className="w-3.5 h-3.5 text-teal-400" />
              {wordCount} kata
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              ~{estimatedTokens} token
            </span>
          </div>

          <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Real-time Sync
          </span>
        </div>
      </div>

      {/* Action Buttons: Copy, Download, Direct AI */}
      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`py-3 px-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.99]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-100" />
                <span>Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Prompt</span>
              </>
            )}
          </button>

          {/* Download TXT Button */}
          <button
            onClick={handleDownload}
            className="py-3 px-4 font-bold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Download .TXT</span>
          </button>
        </div>

        {/* Quick Launch in popular AI assistants */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              Langsung Uji di Platform AI (Auto-Copy):
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              onClick={() => openExternalAI('https://chatgpt.com')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5 group"
            >
              <span>ChatGPT</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
            </button>
            <button
              onClick={() => openExternalAI('https://gemini.google.com')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-1.5 group"
            >
              <span>Gemini</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
            </button>
            <button
              onClick={() => openExternalAI('https://claude.ai')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center justify-center gap-1.5 group"
            >
              <span>Claude</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-500" />
            </button>
            <button
              onClick={() => openExternalAI('https://copilot.microsoft.com')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-1.5 group"
            >
              <span>Copilot</span>
              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
