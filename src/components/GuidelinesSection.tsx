export function GuidelinesSection() {
  return (
    <section
      id="guidelines"
      aria-labelledby="guidelines-heading"
      className="no-print border-t border-slate-200 pt-10 pb-14"
    >
      <div className="mb-7 max-w-2xl">
        <h2 id="guidelines-heading" className="text-lg font-semibold text-slate-900">
          Editorial Rules Built Into Every Draft
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Each generated letter follows strict technical recruiting conventions for software, hardware, and research roles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-900">
            01. Strictly Under 300 Words
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Engineering managers scan letters in seconds. Drafts target 220–270 words across three focused paragraphs so every sentence earns its space.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-900">
            02. Direct Technical Bridging
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Connects your degree, systems projects, internships, and tools directly to the target team&apos;s stack and responsibilities without inventing claims.
          </p>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-sm font-semibold text-slate-900">
            03. Ready-to-Send Plain Text
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Clean correspondence format with salutation, three body paragraphs, and sign-off using your exact details—zero bracketed placeholders or markdown artifacts.
          </p>
        </div>
      </div>
    </section>
  );
}
