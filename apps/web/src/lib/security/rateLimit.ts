/**
 * In-Memory Sliding Window Rate Limiter for Next.js Middleware & API Endpoints
 * Thwarts DDoS, credential stuffing, and API resource exhaustion without external latency.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();

// Prune expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of ipRequestMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < 60000);
      if (record.timestamps.length === 0) {
        ipRequestMap.delete(key);
      }
    }
  }, 300000);
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  ip: string,
  pathname: string,
  customLimit?: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = 60000; // 1-minute sliding window

  // Determine threshold based on endpoint sensitivity
  let limit = customLimit || 60; // 60 req/min default for general APIs
  if (!customLimit) {
    if (pathname.includes("/api/email/") || pathname.includes("/api/livekit/")) {
      limit = 15; // 15 req/min for token minting and transactional messaging
    } else if (pathname.includes("/api/health")) {
      limit = 120; // High limit for uptime monitoring
    }
  }

  const key = `${ip}:${pathname.startsWith("/api") ? "api" : "page"}`;
  let record = ipRequestMap.get(key);

  if (!record) {
    record = { timestamps: [] };
    ipRequestMap.set(key, record);
  }

  // Filter timestamps within sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetTime = oldest + windowMs;
    const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - now) / 1000));

    return {
      allowed: false,
      limit,
      remaining: 0,
      resetTime,
      retryAfterSeconds,
    };
  }

  record.timestamps.push(now);
  const remaining = Math.max(0, limit - record.timestamps.length);
  const resetTime = now + windowMs;

  return {
    allowed: true,
    limit,
    remaining,
    resetTime,
    retryAfterSeconds: 0,
  };
}

export function resetRateLimitsForTesting() {
  ipRequestMap.clear();
}
