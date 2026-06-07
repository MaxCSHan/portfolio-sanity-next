# Site Analysis — maxcsh.com (2026-06-07)

Three parallel analyses (Product/PM, Content/Editorial, Workflow/Automation) plus live-site verification.
Vision under review: evolve from "portfolio" to **personal web hub** — self-owned canonical home replacing
dependency on Facebook/Instagram/Medium/Flickr (IndieWeb / POSSE model), serving both polished work and
casual journaling/"footprints".

---

## 0. Live-site verification (corrections to the agent reports)

The agents analyzed the repo (network was blocked for them). Verified against production:

| Agent claim | Live reality |
|---|---|
| `/contact` is a 404 | **Worse: soft-404.** The site returns HTTP **200 for every URL**, including garbage paths. `/contact`, `/notes`, `/feed.xml` render empty/HTML shells with status 200. This is an SEO bug in itself (Google treats soft-404s badly) — the `[slug]` catch-all / not-found path isn't returning a real 404 status. |
| No RSS feed | **Confirmed** — `/feed.xml` returns HTML (soft-404), not a feed. |
| "Dormant since March 2025" (content agent) | **Overstated.** Live posts: GenAI cert (2025-03), Setouchi Triennale 2025 Spring (2025-09), Photo-duplicate SHA-256 EN + **中文版** (2026-03). Real cadence ≈ one burst every ~6 months, last post ~2.5 months ago. Low, but not dead — and the bilingual pair shows the EN/中文 strategy is already being explored. |
| Placeholder demo projects may be live | Partially: `portfolio/urban-photography-series` (a seed-script placeholder title) is in the live sitemap — verify whether it now holds real content or is still template filler. |
| Live content corpus | Sitemap: 4 posts, 5 photo posts, 4 portfolio projects (incl. `loeildetokyo-series`, `vx-ai-video-editor`, `personal-portfolio-nextjs-sanity`). The live dataset is richer than the repo's seed scripts — the content agent's *craft* findings stand, the *inventory* was incomplete. |

**New P0 found during verification: fix soft-404s** — unknown routes must return HTTP 404.

---

## 1. The unified diagnosis

All three agents converged independently on the same core finding:

> **The site is all garden, no stream.** Every content type demands polish (cover image, alt text, excerpt,
> author). There is no low-ceremony place to post a thought, a photo, a funny thing — so the casual register
> the hub vision requires has no home, the publishing bar stays at "comprehensive piece," cadence stays low,
> and there is no canonical feed for POSSE syndication to even read from.

And the same keystone fix:

> **`note` content type + `/notes` route + RSS feed.** The PM agent calls it the highest-leverage single move;
> the workflow agent makes it the week-1 build; the content agent calls it the cure for the publishing bar.

---

## 2. Product / PM report (full text)

*Senior PM review. Note: grounded in the codebase as source of truth; `/about` and `/photography` exist (project memory was stale).*

### (a) Current State Map

#### Routes that exist and work
| Route | File | Status | Notes |
|---|---|---|---|
| `/` (homepage) | `app/page.tsx` | Works | Hero + **Now** strip + Featured Projects + Writing + Photography grid. Already a "hub" layout. |
| `/portfolio` | `app/portfolio/page.tsx` | Works, strong | Full filtering: category, free-text search, featured, technologies; pagination (12/page). |
| `/portfolio/[slug]` | exists | Works | Project detail. |
| `/portfolio/demo` | exists | Stray | Demo/dev page exposed in prod routing. |
| `/posts` | `app/posts/page.tsx` | Works | Paginated blog (6/page). **No tags/categories/filtering.** |
| `/posts/[slug]` | exists | Works | Has GiscusComments + ClapButton (reactions API at `app/api/reactions/[type]/[slug]`). |
| `/photography` | `app/photography/page.tsx` | Works | "Series" + Instagram-style photo grid. |
| `/photography/[slug]` | exists | Works | Photo post detail (multi-image, 1–20). |
| `/photography/album/[tag]` | exists | Works but **undiscoverable** | Tag-based auto-albums exist in code but are not linked anywhere in nav or on the photography page. |
| `/about` | `app/about/page.tsx` | Works | Rich, hardcoded (story, focus areas, certs, languages, photography teaser). |
| `/resume` | `app/resume/page.tsx` | Works | `"use client"`, data hardcoded inline, metadata commented out, has print/download. |
| `/[slug]` | exists | Works | Generic Sanity `page` documents. |

#### Broken / missing
- **`/contact` — missing.** Linked from the `/about` CTA ("Contact Me", the primary yellow button). Highest-visibility dead end on the site. *(Live check: renders as soft-404 with HTTP 200.)*
- **`/photography/album/[tag]`** — built but orphaned; no entry point.
- **No RSS/Atom/JSON feed** anywhere — a hard blocker for the stated POSSE/personal-hub vision.
- **`/portfolio/demo`** — dev artifact reachable in production.

#### Content types (Sanity)
`portfolioProject` (rich, 6 categories, tags, technologies, status, featured), `photoPost` (multi-image, date, location, **tags→albums**, optional `relatedWork`), `post` (**no tags, no category**), `person`, `technology`, `projectCategory`, `page`, `settings` (singleton).

#### Inconsistencies
- **Nav vs Footer vs reality diverge.** Header: Portfolio / About / Post / Photography (+ Resume CTA). Footer: "Professional" (Portfolio, Resume) and "Works" (Post, Photography) — **no About, no Contact** in footer. Nav label "Post" (singular) vs page H1 "Blog Posts."
- **Brand identity split.** OG/JSON-LD `siteName` is "Max Chen — Portfolio" while the vision is a personal hub.
- **Resume is a client component with hardcoded data** and disabled metadata export — no proper SEO; content lives in code not Sanity.
- **`/about` fully hardcoded** — overlaps heavily with `/resume`; can't update without deploy.

### (b) Persona / Journey Analysis

1. **Recruiter / Hiring Manager** — best-served. Resume CTA persistent; `/portfolio` filtering strong; `/about` substantive. *Breaks:* "Contact Me" CTA dead-ends; no contact surfaced except buried in resume.
2. **Fellow Developer** — well-served for projects, under-served for writing. `/posts` has zero taxonomy; no tags, no search, no RSS to subscribe.
3. **Photographer / visual browser** — decent but incomplete. Album/tag dimension invisible; no browse-by-place; no EXIF on `photoPost`; two parallel photo systems (`photoPost` vs `portfolioProject` photography category) confuse.
4. **Friend / casual reader** — **not served at all.** No lightweight posting surface; everything is "serious." A friend sees a professional portfolio, not a personal home.
5. **Returning visitor / subscriber** — not served. No RSS, no real `/now` page (homepage strip is static prose), no cross-content "what's new" stream.

### (c) Core Product Tension & Recommended IA

**Tension:** architecture/naming/metadata say "Portfolio" (finite, curated, professional); the vision says "personal hub" (open-ended, multi-register, continuously updated). These imply different information models — garden/showcase vs. stream. Today the site is *all garden, no stream*.

**Recommended IA — dual garden+stream with a unifying spine:**
1. **Add stream type + route:** lightweight Sanity `note` (body, optional images, date, tags; no cover-image ceremony) at **`/notes`**. Home for the casual register and heart of POSSE.
2. **Two writing registers:** keep `post` as essays/Writing (fix "Post" vs "Blog Posts" labels); **add tags/category to `post` schema**.
3. **Make `/now` a real maintained route**, Sanity-backed (editable without deploy).
4. **Unified "Latest" stream + RSS** (`app/feed.xml/route.ts`) — reverse-chron merge of notes + essays + photo posts + projects; the POSSE syndication source. Non-negotiable.
5. **Tag taxonomy as connective tissue:** `/tags/[tag]` pulls a photo album + essay + notes together (generalize the orphaned `/photography/album/[tag]`).
6. **Fix navigation:** Writing (Notes + Essays) · Projects · Photography · About · [Now], Resume secondary CTA. Footer adds About + Contact. Rebrand "Max Chen — Portfolio" → "Max Chen" across siteName/JSON-LD/OG.

### (d) Prioritized Roadmap

**P0 — this week:** build `/contact` (or repoint CTA to mailto); ship RSS/JSON feed; fix nav/footer/label consistency; remove/guard `/portfolio/demo`; rebrand metadata; surface photo albums (already built — just link them). *(+ fix soft-404 status codes — added from live verification.)*

**P1 — 1–2 months:** `note` type + `/notes`; tags+category on `post` + filtering (mirror portfolio filter pattern); `/tags/[tag]` aggregator; Sanity-backed `/now`; move `/about` + `/resume` content into Sanity, fix resume SEO.

**P2 — long-term:** unified `/feed` Latest stream; POSSE syndication automation with canonical backlinks + webmentions/`u-syndication` microformats; consolidate the two photography systems; subscribe affordances (RSS button, optional email); `/colophon` or `/uses` page.

**Highest-leverage single move:** `note` stream + `/notes` + RSS.

---

## 3. Content / Editorial report (full text)

*Reviewed from repo source (page copy + seed scripts). Live verification later found additional posts — see §0 corrections; craft findings stand.*

### What's actually published
Real, hand-written content found in repo: GenAI cert post (~900 w), VX writeup (~280 w, in-progress), self-showcase portfolio writeup (~750 w). Plus well-written site chrome (home/about/photography/resume) and **generic seed placeholders** ("E-commerce Platform," "Urban Photography Series," "Sales Analytics Dashboard," …) — if any are live, that's a credibility problem. *(Live: `urban-photography-series` is in the sitemap — verify.)*

*(Corrected cadence: bursts in Mar 2025, Sep 2025, Mar 2026 — one burst per ~6 months. The infrastructure is far ahead of the writing volume — the classic engineer-blogger trap: tooling outrunning content.)*

### Voice & authenticity
**When Max writes in his own voice he is genuinely good.** From the self-showcase piece:
> "And since the site itself is a decent piece of work, it felt right to make it the first entry in the portfolio. This post is that entry."
> "Every filter combination is bookmarkable and shareable out of the box, for free."
> "It's a tight feedback loop that catches a whole class of bugs before they ever hit the browser."

Confident, specific, opinionated engineering writing naming *decisions and tradeoffs*. The "Deployment gotcha" section is exactly the hard-won detail that makes writeups worth reading. **This is the template for everything else.**

About page has real voice too:
> "...a habit of asking *'what does the data actually say?'* before jumping to conclusions"
> "(I also passed the JLPT N1 within two semesters, which felt like shipping a personal side project ahead of schedule.)"
> "Photography taught me how to see before I compose, which turns out to be useful advice for software architecture too."

These connect the cross-domain identity (economics → engineering, language → thinking, photography → architecture) into a throughline. **That throughline is the differentiator — lean into it.**

**The problem child — the GenAI Leader post.** Reads as AI-assembled study notes and ends with a literal ChatGPT artifact published verbatim:
> "**Would you like me to expand on the specific differences between Prompt Tuning and Fine-Tuning for your notes?**"

No first-person experience (what tripped *him* up, the testing-center day, was $99 worth it). Opening "The rapid evolution of generative AI is transforming industries" is a press release; the self-showcase opening is a person. **Rewrite in the self-showcase voice or unpublish. At minimum delete the trailing line immediately.**

### Structure
- **Hooks:** VX's is strong ("VX exists because most people come back from trips with hours of raw clips and never edit them"). Cert post's is a platitude.
- **Throughlines:** self-showcase has a real spine; cert post borrows the exam syllabus's structure instead of imposing a narrative.
- **Endings — consistent weak spot.** Pieces just *stop* after the last technical point. Even one closing sentence ("Next I want to…") turns a feature list into an ongoing story.

### Specificity vs. vagueness
Concrete Max is excellent ("software decode with hardware encode (VideoToolbox), forced IDR keyframes at segment boundaries"). Vagueness: demo stubs, and unbacked about-page claims — *"reducing manual operational overhead by 60%"* is a retrospective begging to be written.

### Language strategy
English is fluent and idiomatic — no barrier. Strategic question is the opposite: the casual/journal register is probably more natural and authentic in Mandarin, and a Taiwanese audience is who that content is *for*. **Let format dictate language:** technical writeups in English; notes/captions/journals in Mandarin or bilingual. *(Live site already has an EN/中文 post pair — keep going.)*

### Creator habits
- Cadence: low; the biggest single fix.
- Depth distribution: bimodal — long pieces or nothing. No middle layer of small frequent posts. **The bar is set at "comprehensive guide," which is exactly why little ships.**
- Story vs. feature-list: the real writeups DO tell stories (problem → decisions → tradeoffs) — a strength most engineer portfolios lack.
- POV: present and promising, but under-expressed — POV compounds with volume.

### Recommendations
**(a) Craft:** fix/unpublish GenAI post; write endings; cash in the 60%-automation claim as a retrospective; kill live placeholders; keep the specificity signature.

**(b) Formats for the hub:** TIL/dev notes (100–300 w — the Vercel typegen gotcha is a standalone TIL already written); project retrospectives (his strength); photo essays (pair frames with 200 words — "Photography taught me how to see before I compose" is the thesis of the first one); dated append-only "Now" log; link blog / reading notes; the "stupid but funny things" feed as a real low-bar type (probably Mandarin).

**(c) Study list (matched to engineer + photographer + data):**
- **Simon Willison** (simonwillison.net) — gold standard for lowering the bar: TILs + link blog + long pieces, ships daily.
- **Maggie Appleton** (maggieappleton.com) — engineer+visual; canonical digital-garden thinker; kills perfectionism via evolving notes.
- **Tom MacWright** (macwright.com) — engineer + photographer blending technical posts, photo posts, year-in-review; near 1:1 profile match.
- **Craig Mod** (craigmod.com) — photo essays, walks, newsletters; master of images+prose; bilingual Japan-flavored work.
- **Andy Matuschak / Gwern** — evergreen-notes philosophy if going full garden.
- **indieweb.org / POSSE** — the stated vision, named, with a playbook.

**(d) Habits:** lower the bar ruthlessly (a post publishable in 15 min); a capture system feeding the CMS (friction is why dormant sites stay dormant); visible cadence, date everything; write in public, ship in-progress (VX is already `in-progress` — make the build a series); POSSE, don't abandon socials.

**Bottom line:** talent and tooling aren't the problem; volume, cadence, and one inauthentic post in the most prominent slot are. The voice and cross-domain POV are there waiting to compound.

---

## 4. Workflow / Automation report (full text)

### Publishing pipeline (verified from codebase)
- **Write path (proven):** `nextjs-app/scripts/seed-*.js` use `@sanity/client` + `SANITY_API_WRITE_TOKEN`, hand-built Portable Text via helpers (`p`, `h`, `bq`, `li`), `createOrReplace` with deterministic `_id`s. **This is the existing programmatic publish mechanism.**
- **Drafts staging:** `content_drafts/posts/*.md` → hand-converted to seed scripts. **The manual markdown→Portable-Text conversion is the #1 automation target.**
- `@sanity/assist` already installed in Studio. `app/sitemap.ts` exists; **no RSS**. Only API routes: draft-mode + reactions. Deploy: Vercel.

### Foundational building blocks (build once, reuse everywhere)
1. **`scripts/publish.js` — generic md→Sanity publisher (the keystone, 4–6h).** Markdown → HTML (`marked`/`remark`) → `htmlToBlocks` (`@sanity/block-tools`) against the `blockContent` schema; YAML frontmatter drives `_type`/title/slug/excerpt/date/tags/coverImage (local path → `client.assets.upload`)/canonicalUrl/syndication. `--draft` flag writes `drafts.`-prefixed doc for Studio review; deterministic `_id` for idempotent re-runs.
2. **`note` schema (3–4h):** text (max ~2000), datetime (auto-now), slug, tags, optional single image, `syndicated[]` array of {platform, url} for POSSE backlinks. Register in `schemaTypes/index.ts`, add `/notes` + `/notes/[slug]`, wire `sitemap.ts`, run `npm run typegen`.
3. **`app/feed.xml/route.ts` (2–3h):** RSS 2.0 merging posts + notes + photoPosts with canonical links. Backbone of POSSE.

### Workflow A — Research → Publish loop (LLM-powered)
Backlog in Obsidian (`task-capture`/`inbox`) → `deep-research` skill → cited report into Obsidian (`obsidian-kb`) → Claude writes *outline + research digest* to `content_drafts/posts/<slug>.md` → **STOP: human writes the prose** → `node scripts/publish.js <file> --draft` → review in Studio → publish. Wrap as `/research-draft <topic>` skill (3–4h).
*Avoid:* auto-publishing finished prose under your name. The draft handoff gate is the whole point.

### Workflow B — Low-friction capture → post
1. **`/post-note "<text>"` Claude skill (1–2h)** — thought to live note in one command. *Build first.*
2. **`app/api/ingest/route.ts`** (POST, shared-secret header) + **iOS Shortcut** (Share Sheet → post note/photo) — endpoint 3h, Shortcut 1h. Telegram bot or email-to-post only if the gap is felt.
*Avoid:* custom mobile apps, rich phone editors, building all channels.

### Workflow C — Syndication (POSSE)
Publish on site = source of truth; syndication is a downstream reaction.
- **Preferred:** Sanity webhook (GROQ filter on post/note/photoPost publish) → `app/api/syndicate/route.ts` → cross-post to **Bluesky (`@atproto/api`) + Mastodon** first (clean APIs, indieweb-aligned); write syndicated URLs back into `syndicated[]`; every copy links "Originally posted at maxcsh.com/…". (5–7h)
- **Simplest:** RSS-only — point RSS-driven tools at `feed.xml` for other platforms.
*Avoid:* custom IG/LinkedIn/Medium API clients — terrible ROI, constantly breaking. Manual for the walled gardens.

### Workflow D — Backfill / data retention (one-shot per platform)
GDPR exports → `scripts/import-<platform>.js` (same `@sanity/client` pattern, deterministic `_id`s like `ig-import-<originalId>`):
- **Instagram** (JSON+media → `photoPost`/`note`): media→assets.upload, caption, timestamp, geo→location, hashtags→tags.
- **Flickr** (JSON+originals → `photoPost`): albums map to tag-based auto-albums.
- **Medium** (HTML zip → `post`): reuses the block-tools converter; set `canonicalUrl` to preserve link equity.
- **Facebook** (posts.json → `note`): noisy — LLM classifies keep/drop.
LLM role: dedupe, classify, generate alt text (also `@sanity/assist`); **do not rewrite original content.** ~3–5h per platform.
*Avoid:* live API sync or a generic any-platform importer — these are throwaway one-time migrations.

### Workflow E — Maintenance (scheduled agents, existing `schedule` skill)
- "Haven't posted in N days" nudge → Obsidian Daily Note / inbox (1–2h)
- Weekly link checker over `feed.xml` URLs (2–3h)
- Monthly SEO/freshness audit: posts missing excerpt/alt (2h)
- Stale-drafts reminder: `drafts.` docs >7 days old (1h)
*Avoid:* real-time monitoring/dashboards.

### Build order
**Week 1:** `publish.js` → `note` schema + `/notes` → `/post-note` skill. *End state: long post publishes from one markdown command; quick note publishes in one sentence.*
**Month 1:** `feed.xml` → `/research-draft` skill → iOS Shortcut + `/api/ingest` → Sanity webhook + Bluesky/Mastodon syndication → posting-nudge agents.
**Later:** backfill importers (Instagram → Flickr → Medium → Facebook), link-checker + SEO agents, optional channels.

### Guardrails
- Human in the creative seat: LLM does research, conversion, upload, plumbing, nudges — human writes prose and presses publish.
- One reusable converter powers research-publish, Medium backfill, and future ingest.
- Canonical = maxcsh.com, always; syndication downstream and reversible.
- Idempotent writes everywhere (existing seed-script convention).
- `/api/ingest` + `/api/syndicate` guard with shared secret; never expose the write token client-side.

---

## 5. Cross-cutting synthesis & combined priorities

Where the three lenses reinforce each other:

| Theme | PM says | Content says | Workflow says |
|---|---|---|---|
| **The missing casual register** | `note` type + `/notes` is the highest-leverage move | Lower the bar to 15-minute posts; "stupid but funny" feed, probably in Mandarin | `note` schema is a week-1 foundational block; `/post-note` makes it one command |
| **POSSE backbone** | RSS is non-negotiable, P0 | POSSE, don't abandon socials | `feed.xml` + Sanity webhook → Bluesky/Mastodon with backlinks |
| **Cadence** | `/now` as a real maintained route | Dated append-only Now log = lowest-friction habit | "Haven't posted" scheduled nudge agent |
| **Friction kills hubs** | — | Capture system feeding the CMS | iOS Shortcut + `/api/ingest`; `publish.js` keystone |
| **Credibility hygiene** | Remove `/portfolio/demo`; fix `/contact` | Delete GenAI post's AI artifact line; verify/kill placeholders | — |

### Combined action list

**Today (minutes):**
1. Delete the "Would you like me to expand on…" line from the live GenAI post.
2. Check whether `portfolio/urban-photography-series` is real content or seed placeholder.

**This week (P0):**
3. Fix soft-404s (unknown routes must return HTTP 404) — also an SEO fix.
4. `/contact` page or repoint the About CTA.
5. `scripts/publish.js` (md+frontmatter → Sanity, the keystone).
6. Nav/footer/label consistency + metadata rebrand ("Portfolio" → personal name).
7. Remove/guard `/portfolio/demo`; link the existing photo albums.

**Next 2–4 weeks (P1):**
8. `note` schema + `/notes` route + `/post-note` skill.
9. `app/feed.xml` RSS.
10. Tags/category on `post` + filtering; `/tags/[tag]` aggregator.
11. Sanity-backed `/now` page; start the dated Now-log habit.
12. `/research-draft` skill (deep-research → Obsidian → draft → human edit → publish.js).
13. Rewrite the GenAI post in first-person voice; write the "60% automation" retrospective.

**Month 2+ (P2):**
14. iOS Shortcut + `/api/ingest` phone capture.
15. Sanity webhook → Bluesky/Mastodon syndication with canonical backlinks.
16. Backfill importers: Instagram → Flickr → Medium → Facebook.
17. About/resume content into Sanity; consolidate the two photography systems; unified Latest stream; subscribe affordances.
18. Maintenance agents (posting nudge, link checker, SEO audit, stale drafts).
