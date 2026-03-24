/**
 * Script to seed the portfolio site itself as a featured project
 * This creates a self-described "coding" project showcasing the Sanity + Next.js architecture
 *
 * Run with: node scripts/seed-self-showcase.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');
const { uuid } = require('@sanity/uuid');

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
    process.exit(1);
}
if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_DATASET environment variable');
    process.exit(1);
}
if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ Missing SANITY_API_WRITE_TOKEN environment variable');
    console.error('   Get a write token from https://sanity.io/manage → API → Tokens (Editor permissions)');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

// Stable IDs so re-running this script is idempotent
const TECH_IDS = {
    nextjs:     'tech-self-nextjs',
    react:      'tech-self-react',
    typescript: 'tech-self-typescript',
    tailwind:   'tech-self-tailwindcss',
    sanity:     'tech-self-sanity',
    vercel:     'tech-self-vercel',
};

const PROJECT_ID = 'project-self-portfolio-site';

const technologies = [
    {
        _id: TECH_IDS.nextjs,
        _type: 'technology',
        name: 'Next.js 15',
        slug: { current: 'nextjs-15', _type: 'slug' },
        category: 'frontend',
        description: 'React framework with App Router, Server Components, and Turbopack',
        color: '#000000',
    },
    {
        _id: TECH_IDS.react,
        _type: 'technology',
        name: 'React 19',
        slug: { current: 'react-19', _type: 'slug' },
        category: 'frontend',
        description: 'UI library powering the component tree',
        color: '#61DAFB',
    },
    {
        _id: TECH_IDS.typescript,
        _type: 'technology',
        name: 'TypeScript',
        slug: { current: 'typescript', _type: 'slug' },
        category: 'language',
        description: 'Typed JavaScript — auto-generated from Sanity schemas via typegen',
        color: '#3178C6',
    },
    {
        _id: TECH_IDS.tailwind,
        _type: 'technology',
        name: 'Tailwind CSS',
        slug: { current: 'tailwind-css', _type: 'slug' },
        category: 'frontend',
        description: 'Utility-first CSS framework',
        color: '#06B6D4',
    },
    {
        _id: TECH_IDS.sanity,
        _type: 'technology',
        name: 'Sanity CMS',
        slug: { current: 'sanity-cms', _type: 'slug' },
        category: 'backend',
        description: 'Headless CMS with GROQ query language and Live Content API',
        color: '#F03E2F',
    },
    {
        _id: TECH_IDS.vercel,
        _type: 'technology',
        name: 'Vercel',
        slug: { current: 'vercel', _type: 'slug' },
        category: 'devops',
        description: 'Deployment platform with edge functions and ISR',
        color: '#000000',
    },
];

const k = () => uuid(); // shorthand for block keys

const portfolioSiteProject = {
    _id: PROJECT_ID,
    _type: 'portfolioProject',
    title: 'Personal Portfolio — Next.js 15 + Sanity CMS',
    slug: { current: 'personal-portfolio-nextjs-sanity', _type: 'slug' },
    category: 'coding',
    shortDescription:
        'I built this portfolio as a monorepo with Next.js 15 App Router and Sanity as a headless CMS — and then made the site itself the first project entry. Here\'s how it all fits together.',
    description: [
        {
            _type: 'block', _key: k(), style: 'h2',
            children: [{ _type: 'span', _key: k(), text: 'Why I built it this way' }],
        },
        {
            _type: 'block', _key: k(), style: 'normal',
            children: [{
                _type: 'span', _key: k(),
                text: 'I wanted a portfolio that I could actually maintain long-term without touching code every time I add a project, write a post, or upload new photos. The answer was a headless CMS — specifically Sanity — sitting behind a Next.js 15 frontend. Everything you\'re reading right now came out of Sanity\'s dataset, fetched via GROQ, and rendered by React Server Components. No static JSON files, no hardcoded arrays.',
            }],
        },
        {
            _type: 'block', _key: k(), style: 'normal',
            children: [{
                _type: 'span', _key: k(),
                text: 'And since the site itself is a decent piece of work, it felt right to make it the first entry in the portfolio. This post is that entry.',
            }],
        },
        {
            _type: 'block', _key: k(), style: 'h2',
            children: [{ _type: 'span', _key: k(), text: 'Monorepo structure' }],
        },
        {
            _type: 'block', _key: k(), style: 'normal',
            children: [{
                _type: 'span', _key: k(),
                text: 'The repo is an npm workspace monorepo with two packages: nextjs-app/ (the public site, port 3000) and studio/ (Sanity Studio, port 3333). They share the same Sanity project ID and dataset, so I can author content in Studio and watch it appear in the browser in real time — no page reload, no rebuild, thanks to the Sanity Live Content API wired up via a <SanityLive> component in the root layout.',
            }],
        },
        {
            _type: 'block', _key: k(), style: 'normal',
            children: [{
                _type: 'span', _key: k(),
                text: 'One thing I really like about this setup: I have a single sanityFetch() helper wrapping next-sanity\'s fetch. Every page uses it. It handles draft mode transparently — when I\'m logged into the Sanity preview session, it automatically fetches draft content so I can review unpublished changes in full page context before hitting publish.',
            }],
        },
        {
            _type: 'block', _key: k(), style: 'h2',
            children: [{ _type: 'span', _key: k(), text: 'The type generation trick I love' }],
        },
        {
            _type: 'block', _key: k(), style: 'normal',
            children: [{
                _type: 'span', _key: k(),
                text: 'I don\'t write TypeScript types for my Sanity documents by hand. After any schema change in Studio, I run npm run typegen inside nextjs-app/ and it regenerates sanity.types.ts automatically from the live schema. Even better — GROQ query result types are inferred directly from the query string itself, so if my query projection doesn\'t return a field my component expects, TypeScript tells me immediately at compile time. It\'s a tight feedback loop that catches a whole class of bugs before they ever hit the browser.',
            }],
        },
        {
            _type: 'block', _key: k(), style: 'h2',
            children: [{ _type: 'span', _key: k(), text: 'The portfolio section' }],
        },
        {
            _type: 'block', _key: k(), style: 'normal',
            children: [{
                _type: 'span', _key: k(),
                text: 'The /portfolio page is a filterable, paginated masonry grid. The interesting design decision here: all filter state (category, technology stack, featured flag, free-text search) lives exclusively in URL params. There\'s no useState, no Zustand, no context store for filters. When you pick a filter, the hook does router.push() with updated params, the URL changes, and the server component re-runs with fresh data from Sanity. Every filter combination is bookmarkable and shareable out of the box, for free.',
            }],
        },
        {
            _type: 'block', _key: k(), style: 'h2',
            children: [{ _type: 'span', _key: k(), text: 'The photography section' }],
        },
        {
            _type: 'block', _key: k(), style: 'normal',
            children: [{
                _type: 'span', _key: k(),
                text: 'Photography felt like a different kind of content from projects, so I created a separate photoPost document type in Sanity. Each post supports up to 20 images, a caption, a location, and tags. The clever part: those tags auto-generate album pages at /photography/album/[tag] using Next.js generateStaticParams — I never have to create an "album" document in the CMS. Tag a photo "taiwan" and there\'s instantly a Taiwan album page.',
            }],
        },
        {
            _type: 'block', _key: k(), style: 'h2',
            children: [{ _type: 'span', _key: k(), text: 'Design: Neo Brutalism' }],
        },
        {
            _type: 'block', _key: k(), style: 'normal',
            children: [{
                _type: 'span', _key: k(),
                text: 'I went with a Neo Brutalism aesthetic — bold black borders, heavy typography, a mostly black-and-white palette with deliberate accent colors. I wanted something that felt intentional and slightly raw rather than the polished-but-generic look you get from dropping in a component library. Everything is Tailwind utility classes; no separate design-token layer, no CSS-in-JS. Keeps the setup lean and the styles co-located with the components.',
            }],
        },
        {
            _type: 'block', _key: k(), style: 'h2',
            children: [{ _type: 'span', _key: k(), text: 'Deployment gotcha' }],
        },
        {
            _type: 'block', _key: k(), style: 'normal',
            children: [{
                _type: 'span', _key: k(),
                text: 'One thing that tripped me up: sanity typegen needs access to the Studio workspace files to generate types, but Vercel\'s build environment only gets the nextjs-app/ directory. My fix was to override the Vercel build command to plain next build (skipping typegen) and commit sanity.types.ts to the repo. The types are always up to date locally since I run typegen before pushing; Vercel just uses whatever is in the repo.',
            }],
        },
        {
            _type: 'block', _key: k(), style: 'normal',
            children: [{
                _type: 'span', _key: k(),
                text: 'Sanity Studio is deployed separately via npx sanity deploy to Sanity\'s own hosting. That way I can author content from any browser, not just my local machine.',
            }],
        },
    ],
    heroMedia: {
        _type: 'object',
        type: 'image',
        // No image uploaded via script — add one manually in Studio
    },
    featured: true,
    tags: [
        'Next.js',
        'React',
        'TypeScript',
        'Sanity CMS',
        'Tailwind CSS',
        'GROQ',
        'Monorepo',
        'App Router',
        'Headless CMS',
        'Neo Brutalism',
        'Portfolio',
        'Live Content API',
    ],
    completionDate: '2025-03-01',
    status: 'in-progress',
    seoTitle: 'Personal Portfolio — Next.js 15 + Sanity CMS',
    seoDescription:
        'How I built my portfolio as a Next.js 15 App Router monorepo with Sanity as a headless CMS, schema-driven TypeScript types, and a Live Content API.',
    technicalDetails: {
        technologies: [
            { _type: 'reference', _ref: TECH_IDS.nextjs,     _key: k() },
            { _type: 'reference', _ref: TECH_IDS.react,      _key: k() },
            { _type: 'reference', _ref: TECH_IDS.typescript, _key: k() },
            { _type: 'reference', _ref: TECH_IDS.tailwind,   _key: k() },
            { _type: 'reference', _ref: TECH_IDS.sanity,     _key: k() },
            { _type: 'reference', _ref: TECH_IDS.vercel,     _key: k() },
        ],
        githubUrl: 'https://github.com/maxcsh/portfolio-sanity-next',
        liveUrl: 'https://maxcsh.com',
        codeSnippet: `// All data fetching goes through sanityFetch() — never the raw client.
// This automatically opts into Sanity's Live Content API and draft mode.

import { sanityFetch } from "@/sanity/lib/live"
import { featuredPortfolioProjectsQuery } from "@/sanity/lib/queries"

export default async function HomePage() {
  const { data: projects } = await sanityFetch({
    query: featuredPortfolioProjectsQuery,
  })
  return <FeaturedProjects projects={projects} />
}

// Types are auto-generated from the Sanity schema — never hand-written.
// Run: cd nextjs-app && npm run typegen
import type { FeaturedPortfolioProjectsQueryResult } from "@/sanity.types"`,
    },
};

async function seedSelfShowcase() {
    console.log('🔧 Project:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log('🔧 Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
    console.log('');

    try {
        // Upsert technologies (createIfNotExists so we don't clobber existing ones)
        console.log('📦 Upserting technologies...');
        const techTx = client.transaction();
        technologies.forEach(t => techTx.createIfNotExists(t));
        await techTx.commit();
        console.log(`✅ ${technologies.length} technologies ensured`);

        // Upsert the portfolio project
        console.log('🎨 Upserting self-showcase project...');
        await client.createOrReplace(portfolioSiteProject);
        console.log(`✅ Project created/updated: "${portfolioSiteProject.title}"`);

        console.log('');
        console.log('🎉 Done! Next steps:');
        console.log('   1. Open Sanity Studio → Portfolio Projects → find "Personal Portfolio"');
        console.log('   2. Upload a hero screenshot/image in the Media tab');
        console.log('   3. Update the GitHub URL if needed');
        console.log('   4. View the project at: http://localhost:3000/portfolio/personal-portfolio-nextjs-sanity');
    } catch (err) {
        console.error('❌ Error:', err.message);
        if (err.message.includes('Insufficient permissions')) {
            console.error('   Make sure SANITY_API_WRITE_TOKEN has Editor permissions.');
        }
        process.exit(1);
    }
}

seedSelfShowcase();
