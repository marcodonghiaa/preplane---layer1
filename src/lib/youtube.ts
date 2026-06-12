import { YoutubeTranscript } from 'youtube-transcript';

export async function getTranscript(videoUrl: string): Promise<string> {
  try {
    const segments = await YoutubeTranscript.fetchTranscript(videoUrl);
    return segments.map((s) => s.text).join(' ');
  } catch {
    return '';
  }
}

export function extractYoutubeUrls(text: string): string[] {
  const regex = /https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/)[\w-]{11}(?:[?&][^\s)]*)?/g;
  const matches = text.match(regex) ?? [];
  return Array.from(new Set(matches));
}
