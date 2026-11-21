import { useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Printer,
  RefreshCw,
  Scissors,
  Wrench,
} from 'lucide-react';
import type { RefinementMode } from '../types.ts';
import { countParagraphs, countWords, formatDownloadFilename } from '../utils/textMetrics.ts';

interface ManuscriptSheetProps {
  draftText: string;
  onDraftChange: (text: string) => void;
  candidateName: string;
  companyName: string;
  jobRole: string;
  isGenerating: boolean;
  errorMessage: string | null;
  onRefine: (mode: RefinementMode) => void;
  onLoadFirstSample: () => void;
  onRetry: () => void;
}

export function ManuscriptSheet({
  draftText,
  onDraftChange,
  candidateName,
  companyName,
  jobRole,
  isGenerating,
  errorMessage,
  onRefine,
  onLoadFirstSample,
  onRetry,
}: ManuscriptSheetProps) {
  const [copied, setCopied] = useState(false);

  const words = countWords(draftText);
  const blocks = countParagraphs(draftText);
  const hasDraft = draftText.trim().length > 0;
  const isUnderLimit = words > 0 && words < 300;
  const isOverLimit = words >= 300;

  async function handleCopy() {
    if (!hasDraft) return;
    try {
      await navigator.clipboard.writeText(draftText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for restricted clipboard contexts
      const textarea = document.createElement('textarea');
      textarea.value = draftText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleDownload() {
    if (!hasDraft) return;
    const filename = formatDownloadFilename(candidateName, companyName);
    const blob = new Blob([draftText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    if (!hasDraft) return;
    window.print();
  }

  return (
    <section
      id="manuscript-sheet"
      aria-labelledby="manuscript-heading"
      className="flex flex-col rounded-xl border border-slate-200 bg-white print-sheet"
    >
      {/* Top Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 id="manuscript-heading" className="text-base font-semibold text-slate-900">
              Cover Letter Manuscript
            </h2>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-mono tabular-nums text-slate-700 font-medium">
              {words} / 300 words
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {blocks} {blocks === 1 ? 'section' : 'sections'}
            </span>
            {hasDraft && (
              <>
                <span aria-hidden="true">·</span>
                {isUnderLimit ? (
                  <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Within 300-word limit</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Over 300 words — tighten draft</span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!hasDraft || isGenerating}
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!hasDraft || isGenerating}
            className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Download .txt</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={!hasDraft || isGenerating}
            aria-label="Print or save as PDF"
            className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-45 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          >
            <Printer className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Refinement Bar when draft exists */}
      {hasDraft && !isGenerating && (
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-2.5">
          <div className="text-xs text-slate-600 truncate max-w-md">
            {companyName && jobRole ? `${companyName} · ${jobRole}` : 'Editable plain-text draft'}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onRefine('tighten')}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            >
              <Scissors className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Tighten Length</span>
            </button>
            <button
              type="button"
              onClick={() => onRefine('technical_depth')}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            >
              <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sharpen Technical Fit</span>
            </button>
            <button
              type="button"
              onClick={() => onRefine('standard')}
              className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="no-print mx-6 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800"
        >
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="whitespace-nowrap shrink-0 rounded-md border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-100 transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Sheet Surface */}
      <div className="flex flex-1 flex-col p-6 lg:p-10">
        {isGenerating ? (
          <div aria-busy="true" aria-label="Generating cover letter" className="space-y-6 py-4">
            <div className="h-4 w-48 rounded bg-slate-100 animate-pulse" />
            <div className="space-y-2.5">
              <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-slate-100 animate-pulse" />
            </div>
            <div className="space-y-2.5">
              <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-slate-100 animate-pulse" />
            </div>
            <div className="space-y-2.5">
              <div className="h-4 w-11/12 rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-slate-100 animate-pulse" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-24 rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-36 rounded bg-slate-100 animate-pulse" />
            </div>
          </div>
        ) : hasDraft ? (
          <div className="flex flex-1 flex-col">
            <label htmlFor="cover-letter-editor" className="sr-only">
              Generated cover letter plain text editor
            </label>
            <textarea
              id="cover-letter-editor"
              value={draftText}
              onChange={(e) => onDraftChange(e.target.value)}
              spellCheck
              className="min-h-[520px] w-full flex-1 resize-none border-0 bg-transparent p-0 font-serif text-[16px] leading-[1.78] text-slate-900 focus:outline-none"
            />
            {isOverLimit && (
              <p className="no-print mt-4 border-t border-slate-100 pt-3 text-xs text-amber-700">
                This draft is currently {words} words. Use &ldquo;Tighten Length&rdquo; above or edit directly to keep it strictly under 300 words.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-center py-10 max-w-lg mx-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 mb-5">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 text-balance">
              Ready for your engineering cover letter
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Complete the candidate and role brief on the left, then select{' '}
              <span className="font-medium text-slate-900">Generate Cover Letter</span> to produce
              a plain-text letter tailored to the job description.
            </p>

            <div className="mt-6 border-t border-slate-200 pt-5 space-y-2.5 text-xs text-slate-600">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-slate-800">Word Budget</span>
                <span className="font-mono tabular-nums text-slate-500">Strictly &lt; 300 words</span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-slate-800">Structure</span>
                <span className="text-slate-500">Salutation · 3 Body Paragraphs · Sign-off</span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-medium text-slate-800">Output Format</span>
                <span className="text-slate-500">Clean plain text, zero placeholders</span>
              </div>
            </div>

            <div className="mt-7">
              <button
                type="button"
                onClick={onLoadFirstSample}
                className="whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
              >
                Load Sample CS Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
