interface HeaderProps {
  savedCount: number;
  onResetWorkspace: () => void;
}

export function Header({ savedCount, onResetWorkspace }: HeaderProps) {
  return (
    <header className="no-print border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-8 px-6 py-4 lg:px-10">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#top"
          className="whitespace-nowrap shrink-0 text-lg font-bold tracking-tight text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 rounded-sm"
        >
          FolioDraft
        </a>

        {/* Zone 2: Clean single-line navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#candidate-brief"
            className="whitespace-nowrap shrink-0 hover:text-slate-900 hover:underline underline-offset-4 transition-colors"
          >
            Brief
          </a>
          <a
            href="#manuscript-sheet"
            className="whitespace-nowrap shrink-0 hover:text-slate-900 hover:underline underline-offset-4 transition-colors"
          >
            Manuscript
          </a>
          <a
            href="#saved-drafts"
            className="whitespace-nowrap shrink-0 hover:text-slate-900 hover:underline underline-offset-4 transition-colors"
          >
            Saved Drafts{savedCount > 0 ? ` (${savedCount})` : ''}
          </a>
          <a
            href="#guidelines"
            className="whitespace-nowrap shrink-0 hover:text-slate-900 hover:underline underline-offset-4 transition-colors"
          >
            Guidelines
          </a>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onResetWorkspace}
            className="whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 hover:border-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 cursor-pointer"
          >
            New Draft
          </button>
        </div>
      </div>
    </header>
  );
}
