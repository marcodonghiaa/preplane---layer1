export async function getRecentTweets(username: string): Promise<string[]> {
    try {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) return [];
  const headers = { Authorization: `Bearer ${token}` };
      const userRes = await fetch(
  `https://api.twitter.com/2/users/by/username/${encodeURIComponent(username)}`,
  { headers },
      );
      if (!userRes.ok) return [];
      const userJson = await userRes.json();
      const userId = userJson?.data?.id;
      if (!userId) return [];
      const tweetsRes = await fetch(
  `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=text,created_at`,
  { headers },
      );
      if (!tweetsRes.ok) return [];
      const tweetsJson = await tweetsRes.json();
      const data = tweetsJson?.data;
      if (!Array.isArray(data)) return [];
      return data.map((t: { text: string }) => t.text).filter(Boolean);
  } catch {
  return [];
  }
  }