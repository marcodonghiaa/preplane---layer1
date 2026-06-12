const BASE = 'https://api.apify.com/v2';
async function runActor(actorId: string, input: unknown): Promise<unknown[]> {
const token = process.env.APIFY_API_KEY;
if (!token) return [];
const startRes = await fetch(`${BASE}/acts/${actorId}/runs?token=${token}`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
});
  if (!startRes.ok) return [];
  const startJson = await startRes.json();
  const runId = startJson?.data?.id;
  const datasetId = startJson?.data?.defaultDatasetId;
  if (!runId || !datasetId) return [];
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
await new Promise((r) => setTimeout(r, 3000));
const statusRes = await fetch(`${BASE}/actor-runs/${runId}?token=${token}`);
if (!statusRes.ok) continue;
const statusJson = await statusRes.json();
const status = statusJson?.data?.status;
if (status === 'SUCCEEDED') break;
if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') return [];
}
const itemsRes = await fetch(
`${BASE}/datasets/${datasetId}/items?token=${token}&clean=true&format=json`,
);
if (!itemsRes.ok) return [];
const items = await itemsRes.json();
return Array.isArray(items) ? items : [];
}
export async function getLinkedInPosts(profileUrl: string): Promise<string[]> {
try {
const items = await runActor('apify~linkedin-post-search', { profileUrl });
    return items
      .map((i: any) => i?.text ?? i?.postText ?? i?.content ?? '')
      .filter((s: string) => typeof s === 'string' && s.length > 0);
} catch {
return [];
}
}
export async function getJobListings(companyName: string): Promise<string[]> {
try {
const items = await runActor('apify~linkedin-jobs-scraper', { searchQuery: companyName });
    return items
      .map((i: any) => {
const title = i?.title ?? i?.jobTitle ?? '';
const desc = i?.description ?? i?.descriptionText ?? '';
return [title, desc].filter(Boolean).join(' — ');
})
      .filter((s: string) => s.length > 0);
} catch {
return [];
}
}