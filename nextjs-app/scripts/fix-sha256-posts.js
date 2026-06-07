/**
 * One-off repair: the two SHA-256 photo-dedupe posts (EN + TW) were authored
 * before the schema had a code type, so markdown fences were published as
 * plain paragraphs with collapsed newlines. This script replaces each
 * fence-paragraph run with a proper {_type: 'code'} block.
 *
 * Run: node scripts/fix-sha256-posts.js [--dry-run] [slug]
 * (optional slug arg limits the fix to that post)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local'), quiet: true });

const { createClient } = require('@sanity/client');
const { uuid } = require('@sanity/uuid');

const DRY_RUN = process.argv.includes('--dry-run');

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

// Reconstructed snippets (newlines/indentation were destroyed in the stored copies)
const SNIPPET_HASH = (comment) => `import hashlib

def _sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        # ${comment}
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()`;

const SNIPPET_GROUP = (c1, c2) => `from collections import defaultdict

# ${c1}
sha_map = defaultdict(list)
for file in files:
    hash_value = _sha256(file)
    sha_map[hash_value].append(file)

# ${c2}
exact_dupes = {k: v for k, v in sha_map.items() if len(v) > 1}`;

const POSTS = {
    'solve-photo-duplicate-hell-sha256': [
        SNIPPET_HASH('Read the file in 1MB chunks'),
        SNIPPET_GROUP('A simplified version of the logic', "If a hash has more than one file, we've found a duplicate."),
    ],
    'solve-photo-duplicate-hell-sha256-tw': [
        SNIPPET_HASH('關鍵：分塊讀取 (1MB chunks)'),
        SNIPPET_GROUP('簡化版的邏輯', '只要同一個 Hash 對應超過一個檔案，恭喜你，抓到重複了！'),
    ],
};

const blockText = (b) =>
    b._type === 'block' ? (b.children ?? []).map((c) => c.text ?? '').join('') : null;

/**
 * Find runs of plain blocks that start with a ``` fence and end with a block
 * whose text ends with ``` (the same block, in the worst case). Also absorbs
 * empty padding blocks directly before/after the run.
 */
function findFenceRuns(content) {
    const runs = [];
    let i = 0;
    while (i < content.length) {
        const text = blockText(content[i]);
        if (text !== null && text.trimStart().startsWith('```')) {
            let end = i;
            // single block that both opens and closes? require a closing ``` at the END
            // of a block at or after i (skip the opening fence itself when checking)
            const closesInSame = text.trim().length > 3 && text.trimEnd().endsWith('```');
            if (!closesInSame) {
                end = i + 1;
                while (end < content.length) {
                    const t = blockText(content[end]);
                    if (t !== null && t.trimEnd().endsWith('```')) break;
                    end += 1;
                }
                if (end >= content.length) { i += 1; continue; } // unclosed — skip
            }
            let start = i;
            while (start > 0 && blockText(content[start - 1]) === '') start -= 1;
            let stop = end;
            while (stop + 1 < content.length && blockText(content[stop + 1]) === '') stop += 1;
            runs.push([start, stop]);
            i = stop + 1;
        } else {
            i += 1;
        }
    }
    return runs;
}

const onlySlug = process.argv.slice(2).find((a) => !a.startsWith('--'));

async function main() {
    for (const [slug, snippets] of Object.entries(POSTS)) {
        if (onlySlug && slug !== onlySlug) continue;
        const post = await client.fetch(
            `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]{_id, title, content}`,
            { slug }
        );
        if (!post) { console.error(`❌ Post not found: ${slug}`); continue; }

        const runs = findFenceRuns(post.content);
        if (runs.length !== snippets.length) {
            console.error(`❌ ${slug}: expected ${snippets.length} fence runs, found ${runs.length} — aborting this post.`);
            runs.forEach(([s, e]) => console.error(`   run [${s}..${e}]: ${blockText(post.content[s])?.slice(0, 60)}`));
            continue;
        }

        const next = [];
        let cursor = 0;
        runs.forEach(([start, stop], idx) => {
            next.push(...post.content.slice(cursor, start));
            next.push({ _type: 'code', _key: uuid().slice(0, 12), language: 'python', code: snippets[idx] });
            cursor = stop + 1;
        });
        next.push(...post.content.slice(cursor));

        console.log(`${slug}: ${post.content.length} blocks -> ${next.length} (replacing runs ${runs.map(([s, e]) => `[${s}..${e}]`).join(', ')})`);
        if (DRY_RUN) continue;

        await client.patch(post._id).set({ content: next }).commit();
        console.log(`✅ Patched ${post._id}`);
    }
    if (DRY_RUN) console.log('\nDry run — nothing written.');
}

main().catch((err) => { console.error('❌', err.message); process.exit(1); });
