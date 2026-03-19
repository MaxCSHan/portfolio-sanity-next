/**
 * Seed script: Google Cloud Generative AI Leader certification study guide post
 * Source: content_drafts/posts/generative-ai-leader-exam-preps.md
 *
 * Run with: node scripts/seed-post-genai-leader.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');
const { uuid } = require('@sanity/uuid');

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID'); process.exit(1);
}
if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_DATASET'); process.exit(1);
}
if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ Missing SANITY_API_WRITE_TOKEN');
    console.error('   Get an Editor token from https://sanity.io/manage → API → Tokens');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

const AUTHOR_ID = 'd4ef9ca7-4c0e-4fea-8093-9ddc9190e64a';
const POST_ID   = 'post-gcp-genai-leader-guide';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const k = () => uuid();

/** Plain paragraph block */
function p(text) {
    return {
        _type: 'block', _key: k(), style: 'normal',
        markDefs: [],
        children: [{ _type: 'span', _key: k(), marks: [], text }],
    };
}

/** Heading block */
function h(level, text) {
    return {
        _type: 'block', _key: k(), style: `h${level}`,
        markDefs: [],
        children: [{ _type: 'span', _key: k(), marks: [], text }],
    };
}

/** Blockquote block */
function bq(text) {
    return {
        _type: 'block', _key: k(), style: 'blockquote',
        markDefs: [],
        children: [{ _type: 'span', _key: k(), marks: [], text }],
    };
}

/**
 * Bullet or numbered list item.
 * `spans` is an array of { text, marks } — marks can include 'strong', 'em', 'code',
 * or a markDef key string for links.
 * `markDefs` is an optional array of markDef objects (for links).
 */
function li(spans, { type = 'bullet', level = 1, markDefs = [] } = {}) {
    return {
        _type: 'block', _key: k(),
        style: 'normal',
        listItem: type,
        level,
        markDefs,
        children: spans.map(s => ({
            _type: 'span', _key: k(),
            marks: s.marks || [],
            text: s.text,
        })),
    };
}

/** Bullet item shorthand: bold label + plain rest */
function bLi(label, rest) {
    return li([{ text: label, marks: ['strong'] }, { text: rest }]);
}

/** Numbered list item shorthand: bold label + plain rest */
function nLi(label, rest) {
    return li([{ text: label, marks: ['strong'] }, { text: rest }], { type: 'number' });
}

/** Numbered list item with a hyperlink embedded */
function nLiLink(prefix, linkText, href, suffix) {
    const linkKey = k();
    return li(
        [
            { text: prefix },
            { text: linkText, marks: [linkKey] },
            { text: suffix },
        ],
        {
            type: 'number',
            markDefs: [{ _key: linkKey, _type: 'link', linkType: 'href', href, openInNewTab: true }],
        }
    );
}

// ---------------------------------------------------------------------------
// Author
// ---------------------------------------------------------------------------
const author = {
    _id: AUTHOR_ID,
    _type: 'person',
    firstName: 'Max',
    lastName: 'Chen',
};

// ---------------------------------------------------------------------------
// Post content — converted from markdown
// ---------------------------------------------------------------------------
const content = [
    // Intro
    p("The rapid evolution of generative AI is transforming industries. Google Cloud's Generative AI Leader certification is the first of its kind, specifically designed for business professionals, leaders, and decision-makers who need to navigate this shift strategically and responsibly."),
    p("Having recently tackled this exam, I've reorganized my personal study notes into this guide to help you pass on your first attempt."),

    // ── Section 1 ──────────────────────────────────────────────────────────
    h(2, '1. Exam at a Glance'),
    p('Before diving into the tech, here is the "need-to-know" administrative info:'),
    bLi('Format: ',           '45 multiple-choice questions.'),
    bLi('Duration: ',         '90 minutes.'),
    bLi('Cost: ',             '$99 USD.'),
    bLi('Passing Score: ',    'Not officially disclosed, but aim for 70%+.'),
    bLi('The "Leader" Mindset: ', 'Focus on business value, Google Cloud differentiators, and Responsible AI rather than deep coding.'),

    // ── Section 2 ──────────────────────────────────────────────────────────
    h(2, '2. Core Pillars of the Exam'),
    p('The exam is divided into four key domains. Here is the breakdown of what you need to master.'),

    // Domain 1
    h(3, 'Domain 1: Fundamentals of AI & Machine Learning (~30%)'),
    p('You must understand the hierarchy of AI.'),
    bLi('AI vs. ML vs. Gen AI: ', 'AI is the broad concept; ML is learning from patterns; Gen AI is a subset of ML that creates new content (text, images, code) rather than just classifying data.'),
    bLi('Supervised: ',      'Learning from labeled data (e.g., "This is a cat").'),
    bLi('Unsupervised: ',    'Finding hidden patterns in unlabeled data (e.g., customer segmentation).'),
    bLi('Reinforcement: ',   'Learning through "rewards" and "penalties" (e.g., robotics).'),
    bLi('The ML Lifecycle: ', 'Know the flow: Data Ingestion (Cloud Storage) → Preparation (BigQuery) → Training (Vertex AI) → Deployment (Endpoints).'),

    // Domain 2
    h(3, "Domain 2: Google Cloud's Gen AI Portfolio (~35%)"),
    p('Google\'s "Enterprise-Ready" pitch is central here. Know each product\'s primary use case and the business value it delivers:'),
    bLi('Gemini — ',              'The powerhouse multimodal model. Integrated into Workspace (Gmail/Docs) for productivity.'),
    bLi('Vertex AI Platform — ',  'End-to-end ML development. Provides governance, security, and scalability.'),
    bLi('Model Garden — ',        'Flexibility & choice. Access Google models, 3rd-party, and open-source in one place.'),
    bLi('Vertex AI Search — ',    'Grounded information discovery. Internal search engines using your private company data.'),
    bLi('Agent Builder — ',       'Customer experience. Build chatbots/voicebots with low code.'),
    bq('Pro Tip: Know the difference between Google AI Studio (fast prototyping/sandboxing) and Vertex AI Studio (enterprise-grade production with security and governance).'),

    // Domain 3
    h(3, 'Domain 3: Improving Model Output (~20%)'),
    p('Foundation models aren\'t perfect. You need to know how to fix their common flaws: Hallucinations, Knowledge Cutoffs, and Bias.'),
    bLi('RAG (Retrieval-Augmented Generation): ', 'The #1 way to reduce hallucinations. It "grounds" the model by giving it access to your specific, up-to-date documents.'),
    bLi('Prompt Engineering: ', 'Use techniques like "Chain-of-Thought" (explaining reasoning) or "Few-Shot" (giving examples) to steer model behavior.'),
    bLi('Temperature: ',  'Low = predictable/factual. High = creative/random.'),
    bLi('Top-P: ',        'Limits the model to a "nucleus" of probable next tokens — a finer-grained creativity dial.'),

    // Domain 4
    h(3, 'Domain 4: Business Strategy & Responsible AI (~15%)'),
    p('This is the "Leader" part of the exam.'),
    bLi('SAIF (Secure AI Framework): ', "Google's methodology for building security into AI systems from the ground up."),
    bLi('Responsible AI (RAI) Principles: ', 'Focus on transparency, privacy, and bias mitigation.'),
    bLi('XAI (Explainable AI): ', 'Why did the model make that choice? Critical for high-stakes industries like finance or healthcare.'),

    // ── Section 3 ──────────────────────────────────────────────────────────
    h(2, '3. Recommended Study Path'),
    p('If you have 10–12 hours to study, follow this sequence:'),
    nLiLink(
        'Official Path: Complete the ',
        'Generative AI Leader Learning Path',
        'https://www.cloudskillsboost.google/paths/1951',
        ' on Cloud Skills Boost (8 hours).',
    ),
    nLi('Hands-on: ', 'Open NotebookLM or Gemini to see how grounding and summarization work in practice.'),
    nLiLink(
        'Review: Read the ',
        'Official Exam Guide',
        'https://services.google.com/fh/files/misc/generative_ai_leader_exam_guide_english.pdf',
        ' (PDF) to confirm your coverage against the official domains.',
    ),
    nLi('Practice: ', 'Take the official sample questions — search "Google Generative AI Leader sample questions" to find the current form.'),

    // ── Section 4 ──────────────────────────────────────────────────────────
    h(2, '4. Quick Self-Check'),
    p('Can you answer these without looking back?'),
    bLi('Q: ', 'Which technique is best for ensuring an LLM uses your company\'s 2024 policy manual instead of its 2022 training data? → Grounding via RAG.'),
    bLi('Q: ', 'You need a highly creative marketing slogan. Should you set the Temperature to 0.1 or 0.9? → 0.9 (higher = more creative/random).'),
    bLi('Q: ', "What is the main differentiator of Google's TPUs? → Custom-designed hardware specifically optimized for massive AI parallel processing."),

    // ── Final tip ──────────────────────────────────────────────────────────
    h(2, 'Final Strategy Tip'),
    p('When in doubt, choose the "Safe" answer. Google emphasizes Responsible AI and Business Value heavily throughout the exam. If an answer choice suggests a quick fix that ignores data privacy or bias, it\'s almost certainly a distractor. Good luck on your certification journey!'),
];

// ---------------------------------------------------------------------------
// Post document
// ---------------------------------------------------------------------------
const post = {
    _id: POST_ID,
    _type: 'post',
    title: 'Cracking the Google Cloud Generative AI Leader Certification: A Comprehensive Study Guide',
    slug: { _type: 'slug', current: 'google-cloud-generative-ai-leader-certification-guide' },
    excerpt: "Having recently tackled this exam, I've reorganized my personal study notes into a comprehensive guide to help you pass on your first attempt. Covers all four domains: AI/ML fundamentals, Google's Gen AI product portfolio, improving model output, and Responsible AI.",
    date: '2025-03-16T00:00:00.000Z',
    author: { _type: 'reference', _ref: AUTHOR_ID },
    content,
    // coverImage: add manually in Studio — required field but not API-enforced
};

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------
async function seed() {
    console.log('🔧 Project:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log('🔧 Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
    console.log('');

    try {
        console.log('👤 Upserting author (person)...');
        await client.createIfNotExists(author);
        console.log(`✅ Author ready: ${author.firstName} ${author.lastName}`);

        console.log('📝 Upserting post...');
        await client.createOrReplace(post);
        console.log(`✅ Post created: "${post.title}"`);

        console.log('');
        console.log('🎉 Done! Next steps:');
        console.log('   1. Open Studio → Content → Blog Posts → find this post');
        console.log('   2. Upload a cover image (required for the post listing)');
        console.log('   3. Attach your profile photo to the "Max Chen" person document');
        console.log('   4. View the post at: http://localhost:3000/posts/google-cloud-generative-ai-leader-certification-guide');
    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.message.includes('Insufficient permissions')) {
            console.error('   Make sure SANITY_API_WRITE_TOKEN has Editor permissions.');
        }
        process.exit(1);
    }
}

seed();
