import { load } from 'cheerio';
export async function scrapeCompanyBlog(domain: string): Promise<string[]> {
const paths = ['/blog', '/news', '/updates', '/articles'];
for (const path of paths) {
try {
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 8000);
const res = await fetch(`https://${domain}${path}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const html = await res.text();
      const $ = load(html);
      const paragraphs: string[] = [];
      $('p').each((_, el) => {
const text = $(el).text().trim();
if (text.length >= 50) paragraphs.push(text);
});
      if (paragraphs.length > 0) return paragraphs.slice(0, 10);
} catch {
continue;
}
}
  return [];
}
