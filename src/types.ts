export interface CoverLetterInput {
  candidateName: string;
  degree: string;
  skills: string;
  projects: string;
  companyName: string;
  jobRole: string;
  jobDescription: string;
}

export type RefinementMode = 'standard' | 'tighten' | 'technical_depth';

export interface SavedDraft {
  id: string;
  createdAt: string;
  input: CoverLetterInput;
  coverLetter: string;
  wordCount: number;
}

export interface SampleProfile {
  id: string;
  label: string;
  summary: string;
  input: CoverLetterInput;
}
