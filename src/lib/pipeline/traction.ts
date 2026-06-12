import { perplexitySearch } from '@/lib/perplexity';
import { scrapeCompanyBlog } from '@/lib/scraper';
export async function researchTraction(companyName: string): Promise<string> {
  const domain = companyName.toLowerCase().replace(/\s+/g, '') + '.com';
  const [fundingRes, revenueRes, milestonesRes, blogParagraphs] = await Promise.all([
    perplexitySearch(
      `${companyName} funding rounds, investors, total raised`,
      'structured research assistant for startup funding. Return sections: funding rounds (amount, date, lead investor), total raised, latest valuation if known. Cite sources. If nothing found say so, do not guess.',
    ).catch(() => ''),
    perplexitySearch(
      `${companyName} revenue ARR growth rate customers 2024 2025`,
      'structured research assistant for startup traction. Return sections: known revenue or ARR, user or customer count, growth rate, notable customer logos. Cite sources. If nothing found say so, do not guess.',
    ).catch(() => ''),
    perplexitySearch(
      `${companyName} press coverage milestones launches expansions`,
      'structured research assistant for startup milestones. Return sections: key product launches, expansions, partnerships, notable press coverage. Cite sources. If nothing found say so, do not guess.',
    ).catch(() => ''),
    scrapeCompanyBlog(domain).catch(() => [] as string[]),
  ]);
  const funding = typeof fundingRes === 'string' ? fundingRes : '';
  const revenue = typeof revenueRes === 'string' ? revenueRes : '';
  const milestones = typeof milestonesRes === 'string' ? milestonesRes : '';
  const blog = blogParagraphs.length > 0 ? blogParagraphs.join('\n') : 'No blog content found';
  return [
    `## Funding & Investors\n${funding}`,
    `## Revenue & Growth\n${revenue}`,
    `## Milestones & Press\n${milestones}`,
    `## Company Blog\n${blog}`,
  ].join('\n\n');
}
