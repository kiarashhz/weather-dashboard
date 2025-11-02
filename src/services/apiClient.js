const cache = new Map();

export async function apiGet(url, { signal, ttl = 60_000 } = {}) {
  const now = Date.now();
  const c = cache.get(url);
  if (c && now - c.t < ttl) return c.data;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }
  const data = await res.json();
  cache.set(url, { t: now, data });
  return data;
}
