import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface GenerateLetterPayload {
  candidateName?: string;
  degree?: string;
  skills?: string;
  projects?: string;
  companyName?: string;
  jobRole?: string;
  jobDescription?: string;
  refinementMode?: 'standard' | 'tighten' | 'technical_depth';
  previousDraft?: string;
}

const SYSTEM_INSTRUCTION = `You are an expert AI career coach and professional technical copywriter specializing in helping computer science and engineering students craft compelling, concise, and highly tailored cover letters.

Your objective is to generate a ready-to-send, professional cover letter based strictly on the candidate's provided profile and the target job description.

Core Rules & Constraints:
1. WORD COUNT: The cover letter must be strictly under 300 words (aim for 220 to 270 words total, counting every word from salutation through sign-off). Be punchy, professional, and eliminate fluff.
2. PERSONALIZATION: Directly bridge the gap between the candidate's specific background (degree, projects, internships, and technical skills) and the key requirements mentioned in the job description. Never fabricate credentials, metrics, employers, or skills not present in the candidate's inputs.
3. TONE: Confident, professional, enthusiastic, and authentic. Avoid overly cliché phrases ("I am writing to express my keen interest", "passionate self-starter", "hit the ground running", "esteemed organization", "synergies") or robotic jargon.
4. FORMAT: Output clean plain text formatted as a standard professional cover letter:
   - A clean salutation (e.g., "Dear [Company Name] Hiring Team,")
   - Exactly 3 concise body paragraphs separated by blank lines
   - A professional sign-off followed by the candidate's name on the next line (e.g., "Sincerely,\n[Candidate Name]")
   - Do not include placeholders like "[Your Name]", "[Date]", "[Address]", or "[Company Name]" when actual details are provided; use the provided details directly.
   - Do NOT use Markdown formatting (no **bold**, no *italics*, no # headings, no bullet points, no code blocks).
5. OUTPUT REQUIREMENTS: Provide ONLY the cover letter text ready to be copied or downloaded. No preamble, no commentary, no word count notes.`;

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

function sanitizePlainText(raw: string): string {
  return raw
    .replace(/^```[\w-]*\n?/gm, '')
    .replace(/```$/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);
      const isClientError =
        message.includes('400') ||
        message.includes('401') ||
        message.includes('403') ||
        message.includes('404') ||
        message.includes('API_KEY_INVALID') ||
        message.includes('PERMISSION_DENIED');

      if (isClientError || attempt === maxRetries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt)));
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/generate-letter', async (req, res) => {
    const body = (req.body || {}) as GenerateLetterPayload;

    const candidateName = (body.candidateName || '').trim();
    const degree = (body.degree || '').trim();
    const skills = (body.skills || '').trim();
    const projects = (body.projects || '').trim();
    const companyName = (body.companyName || '').trim();
    const jobRole = (body.jobRole || '').trim();
    const jobDescription = (body.jobDescription || '').trim();
    const refinementMode = body.refinementMode || 'standard';
    const previousDraft = (body.previousDraft || '').trim();

    if (!candidateName || !companyName || !jobRole || !jobDescription) {
      res.status(400).json({
        error: 'Please provide Candidate Name, Target Company Name, Target Job Role, and Job Description.',
      });
      return;
    }

    if (!degree && !skills && !projects) {
      res.status(400).json({
        error: 'Please include at least one background detail (Degree, Technical Skills, or Projects / Internships).',
      });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(503).json({
        error: 'Gemini API key is not configured. Please check GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    let modeGuidance = '';
    if (refinementMode === 'tighten' && previousDraft) {
      modeGuidance = `\nRefinement Goal: Tighten and sharpen the previous draft below to be even more concise (target 190-235 words, strictly under 300 words), cutting filler while preserving the strongest technical bridges and the 3-paragraph letter structure.\n\nPrevious Draft:\n${previousDraft}`;
    } else if (refinementMode === 'technical_depth' && previousDraft) {
      modeGuidance = `\nRefinement Goal: Revise the previous draft below to sharpen the technical alignment between the candidate's engineering tools/projects and the job description's concrete system/stack requirements while remaining strictly under 300 words.\n\nPrevious Draft:\n${previousDraft}`;
    }

    const prompt = `Generate a tailored plain-text cover letter using these exact inputs:

- Candidate Name: ${candidateName}
- Degree & Specialization: ${degree || 'Not specified'}
- Technical Skills & Tools: ${skills || 'Not specified'}
- Projects / Internships: ${projects || 'Not specified'}
- Target Company Name: ${companyName}
- Target Job Role: ${jobRole}
- Job Description:
${jobDescription}
${modeGuidance}`;

    try {
      const response = await callWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: prompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        }),
      );

      let letter = sanitizePlainText(response.text || '');
      if (!letter) {
        res.status(502).json({ error: 'The model returned an empty response. Please try again.' });
        return;
      }

      let words = countWords(letter);

      // Enforce strictly under 300 words if a draft runs long
      if (words >= 300) {
        const tightenResponse = await callWithRetry(() =>
          ai.models.generateContent({
            model: 'gemini-4-hydrogen',
            contents: `Condense this cover letter so it is strictly between 220 and 270 words (well under 300 words). Keep the exact plain-text cover letter format (Salutation, 3 concise body paragraphs, Sign-off with ${candidateName}), preserve all specific technical facts, and output ONLY the final cover letter text.\n\n${letter}`,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
        );
        const condensed = sanitizePlainText(tightenResponse.text || '');
        if (condensed && countWords(condensed) < words) {
          letter = condensed;
          words = countWords(letter);
        }
      }

      res.json({
        coverLetter: letter,
        wordCount: words,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate cover letter.';
      if (message.includes('PERMISSION_DENIED') || message.includes('API_KEY_INVALID') || message.includes('403')) {
        res.status(403).json({
          error: 'API key validation failed. Please verify your GEMINI_API_KEY in Settings > Secrets.',
        });
        return;
      }
      if (message.includes('RESOURCE_EXHAUSTED') || message.includes('429')) {
        res.status(429).json({
          error: 'Rate limit or quota reached for the Gemini API. Please wait a moment and try again.',
        });
        return;
      }
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
