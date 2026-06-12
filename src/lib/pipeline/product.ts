import { perplexitySearch } from '@/lib/perplexity';
import { scrapeCompanyBlog } from '@/lib/scraper';

export async function researchProduct(companyName: string): Promise<string> {
  const domain = companyName.toLowerCase().replace(/\s+/g, '') + '.com';

  const [callA, callB, callC, blogParagraphs] = await Promise.all([
    perplexitySearch(
      `${companyName} product features how it works use case`,
      'You are a structured research assistant for startup products. Return sections: what the product does in one sentence, target customer, core features, key differentiators vs competitors. Cite sources. If nothing found say so, do not guess.',
    ),
    perplexitySearch(
      `${companyName} tech stack infrastructure engineering blog`,
      'You are a structured research assistant for startup tech stacks. Return sections: known languages and frameworks, infrastructure and cloud provider, any open source projects or repos, engineering culture signals. Cite sources. If nothing found say so, do not guess.',
    ),
    perplexitySearch(
      `${companyName} competitors alternatives market positioning 2024 2025`,
      'You are a structured research assistant for competitive analysis. Return sections: main competitors, how this product differs, pricing model if known, market segment. Cite sources. If nothing found say so, do not guess.',
    ),
    scrapeCompanyBlog(domain),
  ]);

  return [
    `## Product & Use Case\n${callA}`,
    `## Tech Stack\n${callB}`,
    `## Competitive Positioning\n${callC}`,
    `## Company Blog\n${blogParagraphs.length ? blogParagraphs.join('\n') : 'No blog content found'}`,
  ].join('\n\n');
}
