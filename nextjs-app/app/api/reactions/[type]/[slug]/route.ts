import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const VALID_TYPES = ["post", "portfolio"] as const;
type ValidType = (typeof VALID_TYPES)[number];

const DAILY_REQUEST_CAP = 100;
const MAX_CLAP_COUNT = 500;

type Params = { type: string; slug: string };

// ── GET /api/reactions/[type]/[slug] ──────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { type, slug } = await params;

  if (!VALID_TYPES.includes(type as ValidType)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    const count = (await getRedis().get<number>(`claps:total:${type}:${slug}`)) ?? 0;
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// ── POST /api/reactions/[type]/[slug] ─────────────────────────────────────────
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { type, slug } = await params;

  // Validate type
  if (!VALID_TYPES.includes(type as ValidType)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  // Layer 1 — Origin check (production only)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl && process.env.NODE_ENV === "production") {
    const origin = req.headers.get("origin");
    if (origin !== siteUrl) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // Validate body
  let count: number;
  try {
    const body = await req.json();
    count = body?.count;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!Number.isInteger(count) || count < 1 || count > MAX_CLAP_COUNT) {
    return NextResponse.json(
      { error: `count must be an integer between 1 and ${MAX_CLAP_COUNT}` },
      { status: 400 },
    );
  }

  // Layer 2 — Daily request cap
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const dailyKey = `claps:daily_req:${type}:${slug}:${today}`;

  try {
    const db = getRedis();
    const dailyRequests = await db.incr(dailyKey);
    if (dailyRequests === 1) {
      // Set TTL on first request of the day (25h to survive timezone edge cases)
      await db.expire(dailyKey, 25 * 60 * 60);
    }
    if (dailyRequests > DAILY_REQUEST_CAP) {
      return NextResponse.json({ error: "Daily limit reached" }, { status: 429 });
    }

    // Increment lifetime total
    const newTotal = await db.incrby(`claps:total:${type}:${slug}`, count);
    return NextResponse.json({ count: newTotal });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
