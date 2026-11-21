import { useState } from 'react';
import { Check, Copy, Search, Trash2 } from 'lucide-react';
import type { SavedDraft } from '../types.ts';

interface SavedDraftsSectionProps {
  drafts: SavedDraft[];
  activeDraftId: string | null;
  onLoadDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (id: string) => void;
}

export function SavedDraftsSection({
  drafts,
  activeDraftId,
  onLoadDraft,
  onDeleteDraft,
}: SavedDraftsSectionProps) {
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = drafts.filter((d) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      d.input.companyName.toLowerCase().includes(q) ||
      d.input.jobRole.toLowerCase().includes(q) ||
      d.input.candidateName.toLowerCase().includes(q)
    );
  });

  async function handleCopyRow(draft: SavedDraft) {
    try {
      await navigator.clipboard.writeText(draft.coverLetter);
      setCopiedId(draft.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  }

  function formatDate(iso: string): string {
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  }

  return (
    <section
      id="saved-drafts"
      aria-labelledby="saved-drafts-heading"
      className="no-print border-t border-slate-200 pt-10"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 id="saved-drafts-heading" className="text-lg font-semibold text-slate-900">
            Saved Drafts
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Generated letters are stored locally in your browser so you can compare and revisit applications.
          </p>
        </div>

        {drafts.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by company or role"
              aria-label="Filter saved drafts"
              className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20"
            />
          </div>
        )}
      </div>

      {drafts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-8 text-center">
          <p className="text-sm font-medium text-slate-800">No saved drafts yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Generate your first cover letter above and it will automatically appear here for quick reuse.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-8 text-center">
          <p className="text-sm font-medium text-slate-800">No drafts match &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600">
                <th className="py-3 px-5">Target Company</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4 text-right">Words</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((draft) => {
                const isActive = activeDraftId === draft.id;
                return (
                  <tr
                    key={draft.id}
                    className={`transition-colors hover:bg-slate-50/80 ${
                      isActive ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">
                      {draft.input.companyName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-[260px] truncate">
                      {draft.input.jobRole}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {draft.input.candidateName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-xs tabular-nums text-slate-700 whitespace-nowrap">
                      {draft.wordCount}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs tabular-nums text-slate-500 whitespace-nowrap">
                      {formatDate(draft.createdAt)}
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => onLoadDraft(draft)}
                          className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline underline-offset-4 cursor-pointer"
                        >
                          {isActive ? 'Loaded' : 'Open'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyRow(draft)}
                          aria-label={`Copy cover letter for ${draft.input.companyName}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          {copiedId === draft.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteDraft(draft.id)}
                          aria-label={`Delete draft for ${draft.input.companyName}`}
                          className="text-slate-400 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
