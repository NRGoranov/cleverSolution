const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const buckets = new Map<string, number[]>();

/** In-memory limit per server process. Enough to blunt form spam; not a global quota. */
export function allowContactAttempt(ip: string, now = Date.now()): boolean {
  const recent = (buckets.get(ip) ?? []).filter((ts) => now - ts < WINDOW_MS);

  if (recent.length >= LIMIT) {
    buckets.set(ip, recent);
    return false;
  }

  recent.push(now);
  buckets.set(ip, recent);

  if (buckets.size > 5000) {
    const oldest = buckets.keys().next().value;
    if (oldest) buckets.delete(oldest);
  }

  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first.slice(0, 64);

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp.slice(0, 64);

  return "local";
}
