import { perplexitySearch } from '@/lib/perplexity';
import { getRecentTweets } from '@/lib/twitter';
import { getLinkedInPosts } from '@/lib/apify';
import { getTranscript, extractYoutubeUrls } from '@/lib/youtube';

export async function researchFounder(companyName: string): Promise<string> {
  const [callA, callB] = await Promise.all([
    perplexitySearch(
      `Founder and CEO of ${companyName}: background, story, public presence, LinkedIn and Twitter handles`,
      'You are a structured research assistant for founders. Return sections: full name, background, founding story, public bets, online presence. Cite sources. If nothing found say so, do not guess.',
    ),
    perplexitySearch(
      `site:youtube.com ${companyName} founder interview OR podcast OR talk`,
      'Return only YouTube URLs where this founder appears as speaker or guest. No descriptions, just URLs.',
    ),
  ]);

  const urls = extractYoutubeUrls(callB).slice(0, 2);
  const transcripts = await Promise.all(urls.map((url) => getTranscript(url)));

  const twitterMatch = callA.match(/(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)/);
  const twitterUsername = twitterMatch?.[1];

  const linkedinMatch = callA.match(/linkedin\.com\/in\/([A-Za-z0-9_-]+)/);
  const linkedinUrl = linkedinMatch
    ? `https://www.linkedin.com/in/${linkedinMatch[1]}`
    : null;

  const [tweets, posts] = await Promise.all([
    twitterUsername ? getRecentTweets(twitterUsername) : Promise.resolve([]),
    linkedinUrl ? getLinkedInPosts(linkedinUrl) : Promise.resolve([]),
  ]);

  const validTranscripts = transcripts.filter((t) => t.trim());

  return [
    `## Perplexity Research\n${callA}`,
    `## Recent Tweets\n${tweets.length ? tweets.join('\n') : 'No tweets found'}`,
    `## LinkedIn Posts\n${posts.length ? posts.join('\n') : 'No LinkedIn posts found'}`,
    `## Interview Transcripts\n${validTranscripts.length ? validTranscripts.join('\n') : 'No transcripts found'}`,
  ].join('\n\n');
}
