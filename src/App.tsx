import { useEffect, useState, type FormEvent } from 'react';
import { Header } from './components/Header.tsx';
import { BriefForm } from './components/BriefForm.tsx';
import { ManuscriptSheet } from './components/ManuscriptSheet.tsx';
import { SavedDraftsSection } from './components/SavedDraftsSection.tsx';
import { GuidelinesSection } from './components/GuidelinesSection.tsx';
import { SAMPLE_PROFILES } from './data/sampleProfiles.ts';
import type { CoverLetterInput, RefinementMode, SampleProfile, SavedDraft } from './types.ts';
import { countWords } from './utils/textMetrics.ts';

const STORAGE_KEY = 'foliodraft_saved_drafts_v1';

const EMPTY_INPUT: CoverLetterInput = {
  candidateName: '',
  degree: '',
  skills: '',
  projects: '',
  companyName: '',
  jobRole: '',
  jobDescription: '',
};

export default function App() {
  const [input, setInput] = useState<CoverLetterInput>(EMPTY_INPUT);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState<string>('');
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDrafts));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedDrafts]);

  function handleFieldChange(field: keyof CoverLetterInput, value: string) {
    setInput((prev) => ({ ...prev, [field]: value }));
    setActiveSampleId(null);
    if (validationError) setValidationError(null);
  }

  function handleSelectSample(profile: SampleProfile) {
    setInput(profile.input);
    setActiveSampleId(profile.id);
    setValidationError(null);
    setApiError(null);
  }

  function handleResetWorkspace() {
    setInput(EMPTY_INPUT);
    setActiveSampleId(null);
    setDraftText('');
    setActiveDraftId(null);
    setValidationError(null);
    setApiError(null);
  }

  function validateInputs(): boolean {
    if (
      !input.candidateName.trim() ||
      !input.companyName.trim() ||
      !input.jobRole.trim() ||
      !input.jobDescription.trim()
    ) {
      setValidationError(
        'Please complete Candidate Name, Target Company Name, Target Job Role, and Job Description.',
      );
      return false;
    }

    if (!input.degree.trim() && !input.skills.trim() && !input.projects.trim()) {
      setValidationError(
        'Please fill in at least one background field (Degree, Technical Skills, or Projects / Internships).',
      );
      return false;
    }

    setValidationError(null);
    return true;
  }

  async function requestLetter(mode: RefinementMode = 'standard') {
    if (!validateInputs()) return;

    setIsGenerating(true);
    setApiError(null);

    try {
      const response = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          refinementMode: mode,
          previousDraft: mode !== 'standard' ? draftText : undefined,
        }),
      });

      const data = (await response.json()) as {
        coverLetter?: string;
        wordCount?: number;
        error?: string;
      };

      if (!response.ok || !data.coverLetter) {
        throw new Error(data.error || 'Unable to generate cover letter.');
      }

      const newText = data.coverLetter;
      setDraftText(newText);

      const newDraft: SavedDraft = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
        input: { ...input },
        coverLetter: newText,
        wordCount: data.wordCount ?? countWords(newText),
      };

      setSavedDrafts((prev) => [newDraft, ...prev].slice(0, 20));
      setActiveDraftId(newDraft.id);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error while generating your cover letter.';
      setApiError(message);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void requestLetter('standard');
  }

  function handleLoadDraft(draft: SavedDraft) {
    setInput({ ...draft.input });
    setDraftText(draft.coverLetter);
    setActiveDraftId(draft.id);
    setActiveSampleId(null);
    setValidationError(null);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleDeleteDraft(id: string) {
    setSavedDrafts((prev) => prev.filter((item) => item.id !== id));
    if (activeDraftId === id) {
      setActiveDraftId(null);
    }
  }

  function handleDraftTextEdit(updatedText: string) {
    setDraftText(updatedText);
    if (activeDraftId) {
      const words = countWords(updatedText);
      setSavedDrafts((prev) =>
        prev.map((item) =>
          item.id === activeDraftId
            ? { ...item, coverLetter: updatedText, wordCount: words }
            : item,
        ),
      );
    }
  }

  return (
    <div id="top" className="min-h-screen bg-slate-50 text-slate-900">
      <Header savedCount={savedDrafts.length} onResetWorkspace={handleResetWorkspace} />

      <main className="mx-auto max-w-[1320px] px-6 py-8 lg:px-10 lg:py-10 space-y-12">
        {/* Editorial Page Intro */}
        <div className="no-print max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Technical Cover Letter Studio for CS &amp; Engineering Students
          </h1>
          <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-slate-600">
            Bridge your coursework, engineering projects, and internships directly to a target job description in under 300 words of clean, ready-to-send plain text.
          </p>
        </div>

        {/* Two-Column Split Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 flex flex-col">
            <BriefForm
              input={input}
              onChange={handleFieldChange}
              onSubmit={handleSubmit}
              onSelectSample={handleSelectSample}
              samples={SAMPLE_PROFILES}
              activeSampleId={activeSampleId}
              isGenerating={isGenerating}
              validationError={validationError}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <ManuscriptSheet
              draftText={draftText}
              onDraftChange={handleDraftTextEdit}
              candidateName={input.candidateName}
              companyName={input.companyName}
              jobRole={input.jobRole}
              isGenerating={isGenerating}
              errorMessage={apiError}
              onRefine={(mode) => void requestLetter(mode)}
              onLoadFirstSample={() => handleSelectSample(SAMPLE_PROFILES[0])}
              onRetry={() => void requestLetter('standard')}
            />
          </div>
        </div>

        <SavedDraftsSection
          drafts={savedDrafts}
          activeDraftId={activeDraftId}
          onLoadDraft={handleLoadDraft}
          onDeleteDraft={handleDeleteDraft}
        />

        <GuidelinesSection />
      </main>
    </div>
  );
}
