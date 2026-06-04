import { perplexitySearch } from '@/lib/perplexity';

export async function researchFounder(companyName: string): Promise<string> {
  const systemPrompt = `You are a research assistant gathering structured information about company founders. Return clear, well-organized findings covering each of the following sections, using the section names as headers:

- Full name: The founder(s) full name(s). If there are co-founders, list all of them.
- Background and previous companies: Education, prior roles, and notable companies they worked at or founded before.
- Founding story: Why they started this company, the origin moment, and the problem they set out to solve.
- Public bets and beliefs: Strong opinions, theses, or predictions they have shared publicly.
- Online presence: Links and handles for LinkedIn, Twitter/X, personal site, notable podcast appearances, and key interviews.

Cite sources inline. If a section has no reliable information, say "No reliable information found" rather than guessing.`;

  const query = `Founder and CEO of ${companyName}: background, story, and public presence`;

  return perplexitySearch(query, systemPrompt);
}