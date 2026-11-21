import type { FormEvent } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { CoverLetterInput, SampleProfile } from '../types.ts';

interface BriefFormProps {
  input: CoverLetterInput;
  onChange: (field: keyof CoverLetterInput, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onSelectSample: (profile: SampleProfile) => void;
  samples: SampleProfile[];
  activeSampleId: string | null;
  isGenerating: boolean;
  validationError: string | null;
}

export function BriefForm({
  input,
  onChange,
  onSubmit,
  onSelectSample,
  samples,
  activeSampleId,
  isGenerating,
  validationError,
}: BriefFormProps) {
  return (
    <section
      id="candidate-brief"
      aria-labelledby="brief-heading"
      className="no-print flex flex-col rounded-xl border border-slate-200 bg-white p-6 lg:p-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 pb-5 border-b border-slate-100">
        <div>
          <h2 id="brief-heading" className="text-base font-semibold text-slate-900">
            Candidate &amp; Role Brief
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Provide your engineering background and target role details.
          </p>
        </div>
      </div>

      {/* Interactive Sample Preset Segmented Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-slate-600">Load an engineering sample</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 rounded-lg bg-slate-100 p-1">
          {samples.map((sample) => {
            const isActive = activeSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className={`whitespace-nowrap truncate rounded-md px-3 py-2 text-left text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title={sample.summary}
              >
                {sample.label}
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex flex-1 flex-col gap-6" noValidate>
        {/* Section 01: Candidate Profile */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold tracking-wide text-slate-500">
            01. Candidate Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="candidateName"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Candidate Name <span className="text-red-600">*</span>
              </label>
              <input
                id="candidateName"
                type="text"
                value={input.candidateName}
                onChange={(e) => onChange('candidateName', e.target.value)}
                placeholder="e.g., Maya Lin"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="degree" className="block text-xs font-medium text-slate-700 mb-1.5">
                Degree &amp; Specialization
              </label>
              <input
                id="degree"
                type="text"
                value={input.degree}
                onChange={(e) => onChange('degree', e.target.value)}
                placeholder="e.g., B.S. Computer Science, Systems"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="skills" className="block text-xs font-medium text-slate-700 mb-1.5">
              Technical Skills &amp; Tools
            </label>
            <input
              id="skills"
              type="text"
              value={input.skills}
              onChange={(e) => onChange('skills', e.target.value)}
              placeholder="e.g., Go, Rust, TypeScript, PostgreSQL, Docker, Kubernetes"
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="projects" className="block text-xs font-medium text-slate-700 mb-1.5">
              Projects / Internships
            </label>
            <textarea
              id="projects"
              rows={3}
              value={input.projects}
              onChange={(e) => onChange('projects', e.target.value)}
              placeholder="Summarize relevant internships, research, or technical capstone projects with measurable outcomes..."
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-colors"
            />
          </div>
        </div>

        {/* Section 02: Target Position */}
        <div className="space-y-4 border-t border-slate-100 pt-6">
          <h3 className="text-xs font-semibold tracking-wide text-slate-500">
            02. Target Position
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="companyName"
                className="block text-xs font-medium text-slate-700 mb-1.5"
              >
                Target Company Name <span className="text-red-600">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                value={input.companyName}
                onChange={(e) => onChange('companyName', e.target.value)}
                placeholder="e.g., Cloudflare"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="jobRole" className="block text-xs font-medium text-slate-700 mb-1.5">
                Target Job Role <span className="text-red-600">*</span>
              </label>
              <input
                id="jobRole"
                type="text"
                value={input.jobRole}
                onChange={(e) => onChange('jobRole', e.target.value)}
                placeholder="e.g., Software Engineer Intern"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="jobDescription"
              className="block text-xs font-medium text-slate-700 mb-1.5"
            >
              Job Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="jobDescription"
              rows={5}
              value={input.jobDescription}
              onChange={(e) => onChange('jobDescription', e.target.value)}
              placeholder="Paste the core responsibilities, tech stack, and qualifications from the posting..."
              className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700/20 transition-colors"
              required
            />
          </div>
        </div>

        {validationError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800"
          >
            {validationError}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
          <span className="text-xs text-slate-500">
            Plain text · Strictly &lt; 300 words
          </span>
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Drafting Letter...</span>
              </>
            ) : (
              <>
                <span>Generate Cover Letter</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
