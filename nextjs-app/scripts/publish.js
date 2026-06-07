#!/usr/bin/env node
/**
 * publish.js — markdown (+ YAML frontmatter) → Sanity post
 *
 * The generic replacement for the one-off seed-post-*.js scripts.
 * Designed for the Obsidian → Sanity workflow: write markdown anywhere,
 * seed it as a Sanity *draft*, review in the local Studio, then promote.
 *
 * Usage:
 *   node scripts/publish.js <file.md>                    # create/update DRAFT
 *   node scripts/publish.js <file.md> --publish          # publish (and remove draft)
 *   node scripts/publish.js <file.md> --dry-run          # print Portable Text, no writes
 *   node scripts/publish.js <file.md> --assets-dir <dir> # extra dir to resolve image paths
 *
 * Frontmatter (all optional except title — which can also come from a leading # H1):
 *   ---
 *   title: My Post Title
 *   slug: my-post-title            # default: slugified title
 *   excerpt: One-sentence summary.
 *   date: 2026-06-07               # default: now
 *   coverImage: ./cover.jpg        # local path, uploaded automatically
 *   coverImageAlt: Description of the cover
 *   authorId: <sanity person _id>  # default: Max's person doc
 *   id: post-my-custom-id          # default: post-<slug> (stable across re-runs)
 *   ---
 *
 * Images in the body (![alt](./img.png) or Obsidian ![[img.png]]) are resolved
 * relative to the markdown file (then --assets-dir), uploaded as Sanity assets,
 * and embedded as image blocks.
 *
 * Re-running is idempotent: the same id is createOrReplace'd each time.
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local'), quiet: true });

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { createClient } = require('@sanity/client');
const { mdToPortableText } = require('./lib/md-to-portable-text');

const DEFAULT_AUTHOR_ID = 'd4ef9ca7-4c0e-4fea-8093-9ddc9190e64a'; // person: Max

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--assets-dir');
const assetsDirIdx = args.indexOf('--assets-dir');
const assetsDir = assetsDirIdx !== -1 ? args[assetsDirIdx + 1] : null;

const mdPath = positional[0];
if (!mdPath) {
    console.error('Usage: node scripts/publish.js <file.md> [--publish|--dry-run] [--assets-dir <dir>]');
    process.exit(1);
}
if (!fs.existsSync(mdPath)) {
    console.error(`❌ File not found: ${mdPath}`);
    process.exit(1);
}

const DRY_RUN = flags.has('--dry-run');
const PUBLISH = flags.has('--publish');

// ---------------------------------------------------------------------------
// Env / client (skipped in dry-run)
// ---------------------------------------------------------------------------

let client = null;
if (!DRY_RUN) {
    for (const key of ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET', 'SANITY_API_WRITE_TOKEN']) {
        if (!process.env[key]) {
            console.error(`❌ Missing ${key}`);
            if (key === 'SANITY_API_WRITE_TOKEN') {
                console.error('   Get an Editor token from https://sanity.io/manage → API → Tokens');
                console.error('   and add it to nextjs-app/.env.local');
            }
            process.exit(1);
        }
    }
    client = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28',
        token: process.env.SANITY_API_WRITE_TOKEN,
        useCdn: false,
    });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text) {
    return String(text)
        .toLowerCase()
        .replace(/['']/g, '')
        .replace(/[^a-z0-9一-鿿]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 96);
}

function resolveImagePath(ref, mdDir) {
    const candidates = [
        path.resolve(mdDir, ref),
        ...(assetsDir ? [path.resolve(assetsDir, ref), path.resolve(assetsDir, path.basename(ref))] : []),
    ];
    return candidates.find((p) => fs.existsSync(p)) ?? null;
}

async function uploadImage(absPath) {
    const asset = await client.assets.upload('image', fs.createReadStream(absPath), {
        filename: path.basename(absPath),
    });
    return asset._id;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    const raw = fs.readFileSync(mdPath, 'utf8');
    const { data: fm, content: body } = matter(raw);
    const mdDir = path.dirname(path.resolve(mdPath));

    const { blocks, warnings, title: h1Title } = mdToPortableText(body);

    const title = fm.title || h1Title;
    if (!title) {
        console.error('❌ No title: add `title:` to frontmatter or start the file with a # H1');
        process.exit(1);
    }
    const slug = fm.slug || slugify(title);
    const docId = fm.id || `post-${slug}`;
    const date = fm.date ? new Date(fm.date).toISOString() : new Date().toISOString();

    // Warn about frontmatter the post schema can't hold yet
    for (const key of ['tags', 'category', 'lang', 'language']) {
        if (fm[key]) warnings.push(`Frontmatter "${key}" ignored — the post schema has no such field yet.`);
    }

    // --- resolve + upload images -------------------------------------------
    const imageBlocks = blocks.filter((b) => b._type === 'image' && b.pendingPath);
    for (const block of imageBlocks) {
        const abs = resolveImagePath(block.pendingPath, mdDir);
        if (!abs) {
            warnings.push(`Image not found, block dropped: ${block.pendingPath}`);
            blocks.splice(blocks.indexOf(block), 1);
            continue;
        }
        if (DRY_RUN) {
            block._resolvedPath = abs; // visible in dry-run output
        } else {
            process.stdout.write(`⬆️  Uploading ${path.basename(abs)} ... `);
            const assetId = await uploadImage(abs);
            console.log(assetId);
            block.asset = { _type: 'reference', _ref: assetId };
            delete block.pendingPath;
        }
    }

    // --- cover image ---------------------------------------------------------
    let coverImage;
    if (fm.coverImage) {
        const abs = resolveImagePath(fm.coverImage, mdDir);
        if (!abs) {
            warnings.push(`coverImage not found: ${fm.coverImage}`);
        } else if (DRY_RUN) {
            coverImage = { _type: 'image', _resolvedPath: abs, alt: fm.coverImageAlt || title };
        } else {
            process.stdout.write(`⬆️  Uploading cover ${path.basename(abs)} ... `);
            const assetId = await uploadImage(abs);
            console.log(assetId);
            coverImage = {
                _type: 'image',
                asset: { _type: 'reference', _ref: assetId },
                alt: fm.coverImageAlt || title,
            };
        }
    }

    const doc = {
        _id: PUBLISH ? docId : `drafts.${docId}`,
        _type: 'post',
        title,
        slug: { _type: 'slug', current: slug },
        excerpt: fm.excerpt || undefined,
        date,
        author: { _type: 'reference', _ref: fm.authorId || DEFAULT_AUTHOR_ID },
        ...(coverImage ? { coverImage } : {}),
        content: blocks,
    };

    // --- output / write ------------------------------------------------------
    for (const w of warnings) console.warn(`⚠️  ${w}`);

    if (DRY_RUN) {
        console.log(JSON.stringify(doc, null, 2));
        console.log(`\n✅ Dry run: ${blocks.length} blocks (${imageBlocks.length} images) — nothing written.`);
        return;
    }

    // Slug collision guard (different doc id, same slug)
    const clash = await client.fetch(
        `*[_type == "post" && slug.current == $slug && !(_id in [$id, "drafts." + $id])][0]._id`,
        { slug, id: docId }
    );
    if (clash) {
        console.error(`❌ Slug "${slug}" already used by ${clash}. Set a different slug: or id: in frontmatter.`);
        process.exit(1);
    }

    await client.createOrReplace(doc);

    if (PUBLISH) {
        // Remove any stale draft so the Studio doesn't show "unpublished changes"
        await client.delete(`drafts.${docId}`).catch(() => {});
        console.log(`\n✅ Published: ${title}`);
        console.log(`   https://maxcsh.com/posts/${slug}`);
    } else {
        console.log(`\n✅ Draft written: ${title} (${doc._id})`);
        console.log(`   Review it in the local Studio, then either hit Publish there`);
        console.log(`   or re-run with --publish.`);
    }
}

main().catch((err) => {
    console.error('❌', err.message);
    process.exit(1);
});
