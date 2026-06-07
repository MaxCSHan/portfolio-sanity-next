---
name: publish-md
description: Publish a markdown file (from Obsidian or anywhere) to the Sanity CMS as a post draft or published post. Use when the user wants to publish a draft, seed a post from markdown, push writing to the site, or convert markdown to Sanity. Trigger phrases - "/publish-md", "publish this draft", "seed this post", "push this to my site".
---

# publish-md — markdown → Sanity post

Converts a markdown file (YAML frontmatter supported, Obsidian `![[image]]` embeds supported) to Portable Text and writes it to the Sanity dataset.

## Commands

All run from `nextjs-app/`:

```bash
node scripts/publish.js <file.md>                    # create/update DRAFT (drafts.post-<slug>)
node scripts/publish.js <file.md> --publish          # publish live (and remove the draft copy)
node scripts/publish.js <file.md> --dry-run          # print Portable Text JSON, no writes, no token needed
node scripts/publish.js <file.md> --assets-dir <dir> # extra dir for resolving image paths (e.g. Obsidian attachments folder)
```

Requires `SANITY_API_WRITE_TOKEN` in `nextjs-app/.env.local` (except `--dry-run`).

## Frontmatter

```yaml
---
title: My Post            # or use a leading # H1 (it gets stripped and used as title)
slug: my-post             # default: slugified title
excerpt: One-liner.
date: 2026-06-07          # default: now
coverImage: ./cover.jpg   # local path, uploaded automatically
coverImageAlt: ...
id: post-custom-id        # default: post-<slug>; same id = idempotent re-runs
---
```

## Workflow to follow

1. ALWAYS run `--dry-run` first and skim the output for warnings (missing images, tables→code fallback, unsupported frontmatter).
2. Write as a **draft** (default). Tell the user to review in their local Studio (`npm run dev`, port 3333) before publishing.
3. Only use `--publish` when the user explicitly says to publish live.
4. After publishing, the post is at `https://maxcsh.com/posts/<slug>` — but the production site is SSG, so a redeploy/revalidate may be needed for it to appear.

## Known limitations

- `tags`/`category` frontmatter ignored (post schema has no such fields yet)
- Markdown tables become plain-text code blocks (Portable Text has no table type)
- Inline images get hoisted to standalone image blocks after their paragraph
- Supported code languages: python, typescript, javascript, tsx, sql, bash, json, yaml, html, css, groq; aliases (js, ts, py, sh...) are normalized; unknown → plain text

## Implementation

- Converter: `nextjs-app/scripts/lib/md-to-portable-text.js`
- CLI: `nextjs-app/scripts/publish.js`
