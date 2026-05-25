/**
 * Script to seed VX (AI Video Editor) project into Sanity
 * Run with: cd nextjs-app && node scripts/seed-vx-project.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');
const { uuid } = require('@sanity/uuid');

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET || !process.env.SANITY_API_WRITE_TOKEN) {
    console.error('❌ Missing required env vars: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28',
    token: process.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
});

async function seedVXProject() {
    console.log(`🔧 Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID} / ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);

    // Check if VX project already exists
    const existing = await client.fetch('*[_type == "portfolioProject" && slug.current == "vx-ai-video-editor"][0]._id');
    if (existing) {
        console.log(`⚠️  VX project already exists (${existing}). Will update it.`);
    }

    // Find or create technologies
    const techIds = {};

    // Look up existing Python tech
    const pythonId = await client.fetch('*[_type == "technology" && slug.current == "python"][0]._id');
    if (pythonId) {
        techIds.python = pythonId;
        console.log(`✅ Found existing Python technology: ${pythonId}`);
    } else {
        techIds.python = uuid();
        console.log(`📦 Will create Python technology: ${techIds.python}`);
    }

    // Technologies to create for VX
    const newTechnologies = [];

    // Check for Gemini
    const geminiId = await client.fetch('*[_type == "technology" && slug.current == "gemini"][0]._id');
    if (geminiId) {
        techIds.gemini = geminiId;
        console.log(`✅ Found existing Gemini technology: ${geminiId}`);
    } else {
        techIds.gemini = uuid();
        newTechnologies.push({
            _id: techIds.gemini,
            _type: 'technology',
            name: 'Google Gemini',
            slug: { current: 'gemini', _type: 'slug' },
            category: 'backend',
            description: 'Google\'s multimodal AI model for text, image, and video understanding',
            color: '#4285F4',
            website: 'https://ai.google.dev',
            featured: false,
        });
        console.log(`📦 Will create Gemini technology`);
    }

    // Check for ffmpeg
    const ffmpegId = await client.fetch('*[_type == "technology" && slug.current == "ffmpeg"][0]._id');
    if (ffmpegId) {
        techIds.ffmpeg = ffmpegId;
        console.log(`✅ Found existing ffmpeg technology: ${ffmpegId}`);
    } else {
        techIds.ffmpeg = uuid();
        newTechnologies.push({
            _id: techIds.ffmpeg,
            _type: 'technology',
            name: 'FFmpeg',
            slug: { current: 'ffmpeg', _type: 'slug' },
            category: 'other',
            description: 'Multimedia framework for video/audio processing, encoding, and streaming',
            color: '#007808',
            website: 'https://ffmpeg.org',
            featured: false,
        });
        console.log(`📦 Will create FFmpeg technology`);
    }

    // Check for Pydantic
    const pydanticId = await client.fetch('*[_type == "technology" && slug.current == "pydantic"][0]._id');
    if (pydanticId) {
        techIds.pydantic = pydanticId;
        console.log(`✅ Found existing Pydantic technology: ${pydanticId}`);
    } else {
        techIds.pydantic = uuid();
        newTechnologies.push({
            _id: techIds.pydantic,
            _type: 'technology',
            name: 'Pydantic',
            slug: { current: 'pydantic', _type: 'slug' },
            category: 'backend',
            description: 'Data validation library for Python using type annotations',
            color: '#E92063',
            website: 'https://docs.pydantic.dev',
            featured: false,
        });
        console.log(`📦 Will create Pydantic technology`);
    }

    // If Python doesn't exist yet, create it
    if (!pythonId) {
        newTechnologies.push({
            _id: techIds.python,
            _type: 'technology',
            name: 'Python',
            slug: { current: 'python', _type: 'slug' },
            category: 'language',
            description: 'High-level programming language',
            color: '#3776AB',
            website: 'https://python.org',
            featured: true,
        });
    }

    // Create the VX project
    const vxProjectId = existing || uuid();
    const vxProject = {
        _id: vxProjectId,
        _type: 'portfolioProject',
        title: 'VX — AI Video Editor',
        slug: { current: 'vx-ai-video-editor', _type: 'slug' },
        category: 'coding',
        shortDescription: 'CLI tool that turns raw trip footage into polished vlogs using AI. Automates the editorial thinking — clip review, story structure, and rough cut assembly.',
        description: [
            {
                _type: 'block',
                _key: uuid(),
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        _key: uuid(),
                        text: 'VX exists because most people come back from trips with hours of raw clips and never edit them. The gap between "raw footage on a hard drive" and "a video worth sharing" is enormous. VX automates the editor\'s thinking, not just the cutting — it reviews every clip, understands the story the footage can tell, and assembles a structured edit.',
                    },
                ],
            },
            {
                _type: 'block',
                _key: uuid(),
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        _key: uuid(),
                        text: 'The pipeline starts with ffmpeg preprocessing (proxy generation, scene detection, audio extraction), then uses Google Gemini\'s multimodal AI to review each clip, understand context through an interactive briefing, and produce a complete editorial storyboard with precise timestamps. The output is a structured EDL that assembles into a rough cut without human intervention.',
                    },
                ],
            },
            {
                _type: 'block',
                _key: uuid(),
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        _key: uuid(),
                        text: 'Key technical decisions include software decode with hardware encode (VideoToolbox), forced IDR keyframes at segment boundaries, multi-layer validation before concatenation, and a versioned library system that preserves every analysis run. The interactive HTML preview lets you adjust cut points and re-export without re-running the AI.',
                    },
                ],
            },
        ],
        heroMedia: {
            type: 'image',
        },
        featured: true,
        tags: ['AI', 'Video Editing', 'CLI', 'FFmpeg', 'Gemini', 'Multimodal AI', 'Python', 'Automation'],
        status: 'in-progress',
        technicalDetails: {
            technologies: [
                { _type: 'reference', _ref: techIds.python, _key: uuid() },
                { _type: 'reference', _ref: techIds.gemini, _key: uuid() },
                { _type: 'reference', _ref: techIds.ffmpeg, _key: uuid() },
                { _type: 'reference', _ref: techIds.pydantic, _key: uuid() },
            ],
            githubUrl: 'https://github.com/maxcsh/ai-video-editor',
            codeSnippet: `# VX interactive mode
vx                     # Launch guided workflow
vx new my-trip ~/footage/   # Create project, preprocess clips
vx analyze my-trip --visual # AI reviews clips + assembles storyboard
vx cut my-trip              # Assemble rough cut (no LLM, pure ffmpeg)`,
        },
    };

    // Execute transaction
    const transaction = client.transaction();

    for (const tech of newTechnologies) {
        transaction.createOrReplace(tech);
    }
    transaction.createOrReplace(vxProject);

    await transaction.commit();

    console.log('');
    console.log(`✅ Created ${newTechnologies.length} technologies`);
    console.log(`✅ Created VX project (${vxProjectId})`);
    console.log('');
    console.log('🔗 View at: http://localhost:3000/portfolio');
    console.log('🎨 Edit in Studio: http://localhost:3333');
}

seedVXProject().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
