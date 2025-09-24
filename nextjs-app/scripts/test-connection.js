/**
 * Test script to verify Sanity connection and check existing data
 * Run with: node scripts/test-connection.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');

// Check for required environment variables
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_DATASET environment variable');
  process.exit(1);
}

// Initialize Sanity client (read-only)
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28',
  token: process.env.SANITY_API_READ_TOKEN, // Use read token
  useCdn: false,
});

async function testConnection() {
  try {
    console.log('🔍 Testing Sanity connection...');
    console.log(`📡 Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
    console.log(`📊 Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
    console.log('');

    // Test basic connection
    const projects = await client.fetch('count(*[_type == "portfolioProject"])');
    const technologies = await client.fetch('count(*[_type == "technology"])');
    const posts = await client.fetch('count(*[_type == "post"])');
    const pages = await client.fetch('count(*[_type == "page"])');

    console.log('✅ Connection successful!');
    console.log('');
    console.log('📊 Current data in Sanity:');
    console.log(`   - ${projects} portfolio projects`);
    console.log(`   - ${technologies} technologies`);
    console.log(`   - ${posts} blog posts`);
    console.log(`   - ${pages} pages`);
    console.log('');

    if (projects === 0 && technologies === 0) {
      console.log('💡 No portfolio data found. You can seed sample data by:');
      console.log('   1. Getting a write token from https://sanity.io/manage');
      console.log('   2. Adding SANITY_API_WRITE_TOKEN to your .env.local');
      console.log('   3. Running: npm run seed-portfolio');
    } else {
      console.log('🎉 Portfolio data exists! Visit http://localhost:3000/portfolio to see it.');
    }

    // Test a sample query
    console.log('');
    console.log('🔍 Testing portfolio query...');
    const sampleProjects = await client.fetch(`
      *[_type == "portfolioProject"] | order(_createdAt desc) [0...3] {
        title,
        category,
        featured,
        "slug": slug.current
      }
    `);

    if (sampleProjects.length > 0) {
      console.log('✅ Sample projects found:');
      sampleProjects.forEach(project => {
        console.log(`   - ${project.title} (${project.category})${project.featured ? ' ⭐' : ''}`);
      });
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('unauthorized')) {
      console.error('');
      console.error('🔐 Authorization error. Check your SANITY_API_READ_TOKEN in .env.local');
    } else if (error.message.includes('not found')) {
      console.error('');
      console.error('🔍 Project or dataset not found. Check your project ID and dataset name.');
    }
    
    process.exit(1);
  }
}

testConnection();