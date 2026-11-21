export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function countParagraphs(text: string): number {
  const blocks = text
    .trim()
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  // Standard letter has salutation + 3 body paragraphs + sign-off (5 blocks),
  // or salutation combined. Return total blocks or body paragraph count cleanly.
  return blocks.length;
}

export function formatDownloadFilename(candidateName: string, companyName: string): string {
  const clean = (value: string) =>
    value
      .trim()
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

  const candidatePart = clean(candidateName) || 'Candidate';
  const companyPart = clean(companyName) || 'Company';
  return `Cover_Letter_${candidatePart}_${companyPart}.txt`;
}
