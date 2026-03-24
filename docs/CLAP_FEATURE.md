# Clap Button Feature

Anonymous clap reactions for blog posts and portfolio project pages.
Modelled after Medium's clap UX — count-only, no toggle, no auth required.

---

## Scope

Applied to:
- `/posts/[slug]` — blog post detail page
- `/portfolio/[slug]` — portfolio project detail page

---

## User Experience

### Clap flow
1. User clicks the clap button
2. Counter increments immediately (optimistic, local)
3. Clapping continues as long as the user keeps clicking — no hard cap friction
4. After the user stops clicking (1500ms idle), claps are flushed as a single API request
5. Server returns the new total; displayed count updates

### Cap behavior (impossible threshold)
- If accumulated claps in one session exceed the impossible threshold (500),
  the button triggers a fun animation and the count is capped at 500 before sending
- This threshold represents what is physically impossible for a human to click —
  it is a bot safeguard, not a UX constraint

### Page revisit
- `localStorage` persists the total claps this device has given to each resource
- On revisit, the button reflects prior engagement (e.g. slightly filled state)
- Pending unflushed claps from a closed tab are recovered and sent on next visit

---

## Reactive Pipeline

### Operator responsibilities

| Operator | Role |
|---|---|
| `tap()` | Immediate side-effects: append timestamp to `localStorage`, update local UI |
| `bufferTime(300ms)` | **Outer guard** — micro-batches clicks into 300ms windows. Prevents individual rapid clicks from each triggering a debounce reset. Sub-300ms bursts are treated as a single activity unit. |
| `filter(buf => buf.length > 0)` | Drops silent 300ms windows — only active windows propagate |
| `debounceTime(1500ms)` | **Session detector** — resets on every non-empty buffer window. Fires 1500ms after the last activity window, signalling end of clapping session. |
| `subscribe → flush()` | Reads + clears `localStorage` pending array, caps at threshold, sends API request |

### Pipeline diagram

```
[click]──tap()──────────────────────────────► localStorage.pending.push(timestamp)
           │                                   updateLocalCounterUI()
           ▼
      bufferTime(300ms)
           │
           │  active window  → [ts, ts, ts]  ─┐
           │  silent window  → []  (filtered)  │
           ▼                                   │
      filter(buf.length > 0)                   │
           │                                   │
           ▼                                   │
      debounceTime(1500ms) ◄───────────────────┘
           │          resets on each non-empty window
           │          fires after 1500ms of silence
           ▼
        flush()
           ├── count = localStorage.pending.length
           ├── if count > 500 → triggerCapAnimation(), count = 500
           ├── POST /api/reactions/{type}/{slug}  { count }
           ├── on success: localStorage.total += count, localStorage.pending = []
           └── on error: keep pending, retry on next session
```

### Behaviour across click patterns

**Enthusiastic burst:**
```
click×5 [300ms] click×3 [300ms] ...stop
bufferTime: [5]           [3]
debounce:   reset          reset   ──1500ms──► flush(8)
API calls: 1
```

**Slow casual clicks (1 per 2s):**
```
click [2s] click [2s] click
bufferTime: [1]        [1]        [1]
debounce:   ──1500ms──► flush(1)   ──1500ms──► flush(1)   ──1500ms──► flush(1)
API calls: 3  (each count: 1)
```

**Adversarial rapid-fire (bot, every 200ms):**
```
click click click click ... (forever)
bufferTime: [1][1][1][1]... each 200ms click in its own 300ms window
debounce:   keeps resetting ... localStorage accumulates
API calls: 0 until bot stops → then 1 call, capped at 500
```

---

## localStorage Schema

Key pattern: `claps:{type}:{slug}`
- `type` is `post` or `portfolio`

```ts
interface ClapLocalState {
  total: number;       // lifetime claps given by this device (for UI display)
  pending: number[];   // timestamps of unflushed claps (the accumulator buffer)
  lastFlush: number;   // Unix ms — used to recover stale pending on page load
}
```

Stale pending recovery: on component mount, if `lastFlush` is older than 24 hours,
discard pending array (session too old to be meaningful).

---

## API Design

### `GET /api/reactions/[type]/[slug]`

Returns current clap count for a resource.

**Response:**
```json
{ "count": 142 }
```

### `POST /api/reactions/[type]/[slug]`

Increments clap count.

**Request body:**
```json
{ "count": 8 }
```

**Validation:**
- `count` must be integer, `1 ≤ count ≤ 500`
- `type` must be `post` or `portfolio`
- `Origin` header must match `NEXT_PUBLIC_SITE_URL` (same-origin check)

**Response:**
```json
{ "count": 150 }
```

**Error responses:**

| Status | Reason |
|---|---|
| `400` | Invalid body / count out of range |
| `403` | Origin mismatch |
| `429` | Rate limit exceeded (IP or global daily cap) |
| `500` | Redis error |

---

## Rate Limiting

Two layers, applied in order on every POST:

### Layer 1 — Origin check
- Validate `Origin` request header equals `NEXT_PUBLIC_SITE_URL`
- Rejects cross-origin API calls and unsophisticated scripts
- Skipped in development (`NODE_ENV !== 'production'`)
- Note: bypassable with `curl -H "Origin: ..."` — this is a filter, not a firewall. Layer 2 handles the rest.

### Layer 2 — Daily request cap per resource
- **Limit:** 100 requests per resource per day (regardless of clap count per request)
- **Implementation:** Redis `INCR` + `EXPIRE` on a daily key
- **Key:** `claps:daily_req:{type}:{slug}:{YYYYMMDD}`
- **Why requests, not count:** The reactive pipeline already aggregates counts naturally. One request = one clapping session. Capping by count would penalise one enthusiastic user; capping by request caps scripted abuse instead.
- **Worst case:** 100 requests × 500 claps = 50k claps/day — cosmetic inflation only, no cost consequence
- **Free tier impact:** 100 requests × 2 Redis ops × ~10 active resources = ~2k ops/day, well within the 10k Upstash free tier

### What this does NOT protect against
- A sophisticated attacker rotating IPs slowly under the daily request cap.
  Worst case: 100 requests/day of artificial claps per post — acceptable residual risk for a personal portfolio.

---

## Redis Key Schema

| Key | Type | Value | TTL |
|---|---|---|---|
| `claps:total:{type}:{slug}` | String (int) | Lifetime clap count | None |
| `claps:daily_req:{type}:{slug}:{YYYYMMDD}` | String (int) | Request count today | 25 hours |

---

## Animation Design

### Per-clap feedback (every click)
- Button scales up briefly (`scale-125`) then returns — spring feel
- A "+1" float-up label fades out above the button
- Counter increments with a quick number flip

### Cap animation (500 claps hit)
- Button shakes horizontally (`translate-x` keyframe: shake)
- Counter locks and displays "MAX 🎉" briefly before reverting to number
- Button dims slightly and shows tooltip: `"You've given it everything!"`
- Button remains clickable (UX: not disabled) but further clicks trigger only the shake,
  no more local increments

### Post-flush confirmation
- Subtle pulse on the total count when the API response updates it

---

## File Plan

### New files

| File | Purpose |
|---|---|
| `nextjs-app/lib/redis.ts` | Upstash Redis client singleton |
| `nextjs-app/app/api/reactions/[type]/[slug]/route.ts` | GET + POST route handler |
| `nextjs-app/app/hooks/useClaps.ts` | `bufferTime` + `debounceTime` pipeline, localStorage management |
| `nextjs-app/app/components/ClapButton.tsx` | Animated clap button client component |

### Modified files

| File | Change |
|---|---|
| `nextjs-app/app/posts/[slug]/page.tsx` | Add `<ClapButton>` to masthead area |
| `nextjs-app/app/portfolio/[slug]/page.tsx` | Add `<ClapButton>` to project header area |
| `nextjs-app/package.json` | Add `rxjs`, `@upstash/redis`, `@upstash/ratelimit` |

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | `.env.local` + Vercel | Redis endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | `.env.local` + Vercel | Redis auth token |

### Vercel setup
Create a KV store via Vercel Dashboard → Storage → KV.
It auto-injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` — map these to
`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in the project settings,
or use `@vercel/kv` directly (thin wrapper, same API).

---

## Implementation Sequence

1. `lib/redis.ts` — client setup, verify connection
2. `lib/clapRateLimit.ts` — rate limiter config
3. `app/api/reactions/[type]/[slug]/route.ts` — API route (GET + POST)
4. `app/hooks/useClaps.ts` — reactive pipeline + localStorage
5. `app/components/ClapButton.tsx` — UI + animations
6. Wire into post page
7. Wire into portfolio page
