/**
 * Markdown → Sanity Portable Text converter.
 *
 * Maps the markdown features used in this project's blockContent schema:
 *   - headings (h1–h6) → block styles
 *   - paragraphs with inline strong / em / inline-code / strikethrough / links
 *   - fenced code blocks → {_type: 'code'} (language + optional filename)
 *   - blockquotes
 *   - bullet / numbered lists (incl. nesting)
 *   - images (standard ![alt](path) and Obsidian ![[path]]) → {_type: 'image'}
 *     with a `pendingPath` the caller must resolve/upload (see publish.js)
 *   - tables → plain-text code block fallback (Portable Text has no table type)
 *
 * No DOM, no schema compile — a direct marked-lexer → PT mapping, so the
 * output is deterministic and easy to eyeball with --dry-run.
 */

const { marked } = require('marked');
const { uuid } = require('@sanity/uuid');

const k = () => uuid().slice(0, 12);

/** Languages the site renderer highlights; anything else falls back to text. */
const KNOWN_LANGUAGES = new Set([
    'python', 'typescript', 'javascript', 'tsx', 'sql', 'bash',
    'json', 'yaml', 'html', 'css', 'groq', 'text',
]);

const LANGUAGE_ALIASES = {
    js: 'javascript', ts: 'typescript', jsx: 'tsx', py: 'python',
    sh: 'bash', shell: 'bash', zsh: 'bash', yml: 'yaml', plaintext: 'text',
    txt: 'text', '': 'text',
};

function normalizeLanguage(lang) {
    const lower = (lang || '').trim().toLowerCase();
    const mapped = LANGUAGE_ALIASES[lower] ?? lower;
    return KNOWN_LANGUAGES.has(mapped) ? mapped : 'text';
}

/**
 * Convert Obsidian wiki-style embeds `![[image.png]]` / `![[image.png|alt]]`
 * into standard markdown images so the lexer picks them up.
 */
function preprocessObsidian(markdown) {
    return markdown.replace(/!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g, (_, target, alias) => {
        return `![${alias || ''}](${encodeURI(target.trim())})`;
    });
}

// ---------------------------------------------------------------------------
// Inline tokens → spans + markDefs
// ---------------------------------------------------------------------------

function inlineTokensToSpans(tokens, activeMarks, markDefs, warnings, images) {
    const spans = [];
    for (const token of tokens ?? []) {
        switch (token.type) {
            case 'text':
                // marked nests inline tokens inside 'text' tokens within lists
                if (token.tokens?.length) {
                    spans.push(...inlineTokensToSpans(token.tokens, activeMarks, markDefs, warnings, images));
                } else {
                    spans.push(span(token.text, activeMarks));
                }
                break;
            case 'strong':
                spans.push(...inlineTokensToSpans(token.tokens, [...activeMarks, 'strong'], markDefs, warnings, images));
                break;
            case 'em':
                spans.push(...inlineTokensToSpans(token.tokens, [...activeMarks, 'em'], markDefs, warnings, images));
                break;
            case 'del':
                spans.push(...inlineTokensToSpans(token.tokens, [...activeMarks, 'strike-through'], markDefs, warnings, images));
                break;
            case 'codespan':
                spans.push(span(decodeEntities(token.text), [...activeMarks, 'code']));
                break;
            case 'link': {
                const defKey = k();
                markDefs.push({ _type: 'link', _key: defKey, linkType: 'href', href: token.href, openInNewTab: true });
                spans.push(...inlineTokensToSpans(token.tokens, [...activeMarks, defKey], markDefs, warnings, images));
                break;
            }
            case 'image':
                // Inline image mid-paragraph: hoist to a top-level image block
                // (the blockContent schema has no inline-image support).
                images.push(imageBlock(token.href, token.text));
                break;
            case 'br':
                spans.push(span('\n', activeMarks));
                break;
            case 'escape':
                spans.push(span(token.text, activeMarks));
                break;
            case 'space':
                break; // inter-token whitespace inside blockquotes/lists — nothing to emit
            default:
                warnings.push(`Unhandled inline token "${token.type}" — kept as plain text: ${JSON.stringify(token.raw?.slice(0, 60))}`);
                spans.push(span(token.raw ?? '', activeMarks));
        }
    }
    return spans;
}

function span(text, marks) {
    return { _type: 'span', _key: k(), marks: [...marks], text: decodeEntities(text) };
}

function decodeEntities(text) {
    return String(text)
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

// ---------------------------------------------------------------------------
// Block builders
// ---------------------------------------------------------------------------

function textBlock(tokens, { style = 'normal', listItem, level, markDefs: extraDefs, warnings, images }) {
    const markDefs = extraDefs ?? [];
    const children = inlineTokensToSpans(tokens, [], markDefs, warnings, images);
    const block = { _type: 'block', _key: k(), style, markDefs, children };
    if (listItem) {
        block.listItem = listItem;
        block.level = level ?? 1;
    }
    if (children.length === 0) block.children = [span('', [])];
    return block;
}

function imageBlock(pendingPath, alt) {
    return {
        _type: 'image',
        _key: k(),
        // Resolved & replaced with an asset reference at upload time.
        pendingPath: decodeURI(pendingPath ?? ''),
        ...(alt ? { alt } : {}),
    };
}

function codeBlock(token) {
    // Support "```python title=dedupe.py" style info strings
    const info = (token.lang || '').split(/\s+/);
    const language = normalizeLanguage(info[0]);
    const filenameArg = info.find((part) => part.startsWith('title=') || part.startsWith('filename='));
    return {
        _type: 'code',
        _key: k(),
        language,
        code: token.text,
        ...(filenameArg ? { filename: filenameArg.split('=')[1] } : {}),
    };
}

function tableToCodeBlock(token, warnings) {
    warnings.push('Markdown table converted to a plain-text code block (Portable Text has no table type).');
    const rows = [
        token.header.map((c) => c.text),
        ...token.rows.map((row) => row.map((c) => c.text)),
    ];
    const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => String(r[i] ?? '').length)));
    const fmt = (row) => row.map((cell, i) => String(cell ?? '').padEnd(widths[i])).join('  |  ');
    const lines = [fmt(rows[0]), widths.map((w) => '-'.repeat(w)).join('--+--'), ...rows.slice(1).map(fmt)];
    return { _type: 'code', _key: k(), language: 'text', code: lines.join('\n') };
}

// ---------------------------------------------------------------------------
// List handling (recursive, maps nesting onto Portable Text levels)
// ---------------------------------------------------------------------------

function listToBlocks(token, level, warnings, images) {
    const blocks = [];
    const listItem = token.ordered ? 'number' : 'bullet';
    for (const item of token.items) {
        const inlineTokens = [];
        for (const child of item.tokens ?? []) {
            if (child.type === 'list') {
                if (inlineTokens.length) {
                    blocks.push(textBlock(flattenInline(inlineTokens), { listItem, level, warnings, images }));
                    inlineTokens.length = 0;
                }
                blocks.push(...listToBlocks(child, level + 1, warnings, images));
            } else {
                inlineTokens.push(child);
            }
        }
        if (inlineTokens.length) {
            blocks.push(textBlock(flattenInline(inlineTokens), { listItem, level, warnings, images }));
        }
    }
    return blocks;
}

/** List items wrap their content in 'text'/'paragraph' tokens — unwrap once. */
function flattenInline(tokens) {
    const out = [];
    for (const t of tokens) {
        if ((t.type === 'paragraph' || t.type === 'text') && t.tokens?.length) out.push(...t.tokens);
        else out.push(t);
    }
    return out;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * @param {string} markdown
 * @returns {{blocks: object[], warnings: string[], title: string|null}}
 *   `blocks` may contain `{_type:'image', pendingPath}` entries the caller
 *   must upload and replace with asset references.
 *   `title` is the text of a leading H1, which is also stripped from blocks
 *   (the site renders the post title separately).
 */
function mdToPortableText(markdown) {
    const warnings = [];
    const tokens = marked.lexer(preprocessObsidian(markdown));
    const blocks = [];
    let title = null;

    const firstContentIndex = tokens.findIndex((t) => t.type !== 'space');

    tokens.forEach((token, index) => {
        // Hoisted images from inline positions land here, after their paragraph
        const images = [];
        switch (token.type) {
            case 'heading': {
                if (index === firstContentIndex && token.depth === 1 && !title) {
                    title = token.text;
                    break; // strip leading H1 — rendered as the post title
                }
                blocks.push(textBlock(token.tokens, { style: `h${Math.min(token.depth, 6)}`, warnings, images }));
                break;
            }
            case 'paragraph': {
                // Paragraph that is only an image → standalone image block
                const meaningful = (token.tokens ?? []).filter((t) => !(t.type === 'text' && !t.text.trim()));
                if (meaningful.length === 1 && meaningful[0].type === 'image') {
                    blocks.push(imageBlock(meaningful[0].href, meaningful[0].text));
                    break;
                }
                blocks.push(textBlock(token.tokens, { warnings, images }));
                break;
            }
            case 'code':
                blocks.push(codeBlock(token));
                break;
            case 'blockquote': {
                for (const child of token.tokens ?? []) {
                    if (child.type === 'paragraph') {
                        blocks.push(textBlock(child.tokens, { style: 'blockquote', warnings, images }));
                    } else if (child.type === 'list') {
                        blocks.push(...listToBlocks(child, 1, warnings, images));
                    }
                }
                break;
            }
            case 'list':
                blocks.push(...listToBlocks(token, 1, warnings, images));
                break;
            case 'table':
                blocks.push(tableToCodeBlock(token, warnings));
                break;
            case 'space':
            case 'hr':
                break; // no Portable Text equivalent needed
            case 'html':
                warnings.push(`Raw HTML kept as plain text: ${JSON.stringify(token.raw.slice(0, 60))}`);
                blocks.push(textBlock([{ type: 'text', text: token.raw }], { warnings, images }));
                break;
            default:
                warnings.push(`Unhandled block token "${token.type}" — skipped: ${JSON.stringify(token.raw?.slice(0, 60))}`);
        }
        blocks.push(...images);
    });

    return { blocks, warnings, title };
}

module.exports = { mdToPortableText, normalizeLanguage };
