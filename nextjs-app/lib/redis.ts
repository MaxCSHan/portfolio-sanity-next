import { Redis } from "@upstash/redis";

// Lazy singleton — avoids throwing at module load time during Next.js build
// when env vars are not yet present (e.g. CI, cold build without secrets).
let _redis: Redis | null = null;

export function getRedis(): Redis {
  if (!_redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error(
        "Missing env vars: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required."
      );
    }
    _redis = new Redis({ url, token });
  }
  return _redis;
}
