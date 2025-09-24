/**
 * Script to seed Sanity with sample portfolio data
 * Run with: node scripts/seed-portfolio.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@sanity/client');
const { uuid } = require('@sanity/uuid');

// Check for required environment variables
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
    console.error('📝 Please add a write token to your .env.local file:');
    console.error('   SANITY_API_WRITE_TOKEN=your_write_token_here');
    console.error('');
    console.error('🔗 Get a write token from: https://sanity.io/manage');
    console.error('   1. Go to your project dashboard');
    console.error('   2. Navigate to API → Tokens');
    console.error('   3. Create a new token with Editor permissions');
    process.exit(1);
}

// Initialize Sanity client
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-28',
    token: process.env.SANITY_API_WRITE_TOKEN, // Need write token for creating documents
    useCdn: false, // Don't use CDN for writes
});

console.log(`🔧 Using Sanity project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
console.log(`🔧 Using dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);

// Sample technologies data
const technologies = [
    {
        _id: uuid(),
        _type: 'technology',
        name: 'Next.js',
        slug: { current: 'nextjs', _type: 'slug' },
        category: 'frontend',
        description: 'React framework for production-grade applications',
        color: '#000000',
        website: 'https://nextjs.org',
        featured: true,
    },
    {
        _id: uuid(),
        _type: 'technology',
        name: 'TypeScript',
        slug: { current: 'typescript', _type: 'slug' },
        category: 'language',
        description: 'Typed superset of JavaScript',
        color: '#3178C6',
        website: 'https://typescriptlang.org',
        featured: true,
    },
    {
        _id: uuid(),
        _type: 'technology',
        name: 'PostgreSQL',
        slug: { current: 'postgresql', _type: 'slug' },
        category: 'database',
        description: 'Advanced open source relational database',
        color: '#336791',
        website: 'https://postgresql.org',
        featured: true,
    },
    {
        _id: uuid(),
        _type: 'technology',
        name: 'Stripe',
        slug: { current: 'stripe', _type: 'slug' },
        category: 'backend',
        description: 'Payment processing platform',
        color: '#635BFF',
        website: 'https://stripe.com',
        featured: false,
    },
    {
        _id: uuid(),
        _type: 'technology',
        name: 'Python',
        slug: { current: 'python', _type: 'slug' },
        category: 'language',
        description: 'High-level programming language',
        color: '#3776AB',
        website: 'https://python.org',
        featured: true,
    },
    {
        _id: uuid(),
        _type: 'technology',
        name: 'React',
        slug: { current: 'react', _type: 'slug' },
        category: 'frontend',
        description: 'JavaScript library for building user interfaces',
        color: '#61DAFB',
        website: 'https://reactjs.org',
        featured: true,
    },
];

// Sample portfolio projects data
const portfolioProjects = [
    {
        _id: uuid(),
        _type: 'portfolioProject',
        title: 'E-commerce Platform',
        slug: { current: 'ecommerce-platform', _type: 'slug' },
        category: 'coding',
        shortDescription: 'Full-stack e-commerce platform built with Next.js, featuring real-time inventory management, payment processing, and admin dashboard.',
        description: [
            {
                _type: 'block',
                _key: uuid(),
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        _key: uuid(),
                        text: 'This comprehensive e-commerce platform was built from the ground up using modern web technologies. The project involved creating a scalable architecture that could handle high traffic loads while maintaining excellent user experience.',
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
                        text: 'Key features include real-time inventory management, secure payment processing with Stripe, comprehensive admin dashboard, and mobile-responsive design. The platform also includes advanced search functionality, product recommendations, and detailed analytics.',
                    },
                ],
            },
        ],
        heroMedia: {
            type: 'image',
            // Note: In a real scenario, you'd upload actual images to Sanity
            // For now, we'll leave this empty and it will show placeholder
        },
        featured: true,
        tags: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS', 'E-commerce'],
        completionDate: '2024-01-15',
        client: 'TechCorp Inc.',
        status: 'completed',
        technicalDetails: {
            technologies: [
                { _type: 'reference', _ref: technologies[0]._id, _key: uuid() }, // Next.js
                { _type: 'reference', _ref: technologies[1]._id, _key: uuid() }, // TypeScript
                { _type: 'reference', _ref: technologies[2]._id, _key: uuid() }, // PostgreSQL
                { _type: 'reference', _ref: technologies[3]._id, _key: uuid() }, // Stripe
            ],
            githubUrl: 'https://github.com/example/ecommerce-platform',
            liveUrl: 'https://ecommerce-demo.example.com',
            codeSnippet: `// Example API route for handling payments
export async function POST(request: Request) {
  const { amount, currency } = await request.json();
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency,
    metadata: { integration_check: 'accept_a_payment' },
  });
  
  return Response.json({ client_secret: paymentIntent.client_secret });
}`,
        },
    },
    {
        _id: uuid(),
        _type: 'portfolioProject',
        title: 'Urban Photography Series',
        slug: { current: 'urban-photography-series', _type: 'slug' },
        category: 'photography',
        shortDescription: 'A collection of street photography capturing the essence of urban life in major cities around the world.',
        description: [
            {
                _type: 'block',
                _key: uuid(),
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        _key: uuid(),
                        text: 'This photography series explores the dynamic energy of urban environments across three major cities: New York, Tokyo, and London. Each location offered unique perspectives on modern city life, from the bustling streets of Manhattan to the neon-lit districts of Shibuya.',
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
                        text: 'The project focused on capturing candid moments of human interaction within architectural frameworks, emphasizing the contrast between individual stories and the vast urban landscape. Shot primarily in black and white to highlight form, texture, and emotion.',
                    },
                ],
            },
        ],
        heroMedia: {
            type: 'gallery',
            // Note: In a real scenario, you'd upload actual images
        },
        featured: true,
        tags: ['Street Photography', 'Urban', 'Black & White', 'Documentary', 'Travel'],
        completionDate: '2024-02-10',
        status: 'completed',
        technicalDetails: {
            cameraInfo: {
                camera: 'Canon EOS R5',
                lens: 'RF 24-70mm f/2.8L IS USM, RF 85mm f/1.2L USM',
                settings: 'Various settings, mostly f/8-f/11, ISO 100-800, 1/125s-1/500s',
                location: 'New York City, Tokyo, London',
                shootDate: '2024-01-20',
            },
            photoCategory: 'street',
        },
    },
    {
        _id: uuid(),
        _type: 'portfolioProject',
        title: 'Sales Analytics Dashboard',
        slug: { current: 'sales-analytics-dashboard', _type: 'slug' },
        category: 'data',
        shortDescription: 'Interactive dashboard for sales data analysis with real-time metrics, predictive analytics, and automated reporting.',
        description: [
            {
                _type: 'block',
                _key: uuid(),
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        _key: uuid(),
                        text: 'Developed a comprehensive analytics dashboard that transforms raw sales data into actionable business insights. The project involved processing over 500,000 transactions across multiple product categories and geographic regions.',
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
                        text: 'The dashboard features real-time data visualization, predictive modeling for sales forecasting, and automated report generation. Machine learning algorithms were implemented to identify trends, seasonal patterns, and anomalies in sales performance.',
                    },
                ],
            },
        ],
        heroMedia: {
            type: 'image',
        },
        featured: false,
        tags: ['Python', 'Tableau', 'Machine Learning', 'SQL', 'Data Visualization', 'Analytics'],
        completionDate: '2024-03-05',
        client: 'DataCorp Analytics',
        status: 'completed',
        technicalDetails: {
            dataTools: ['Python', 'Pandas', 'Tableau', 'PostgreSQL', 'Scikit-learn', 'Apache Airflow'],
            methodology: 'Implemented time series analysis using ARIMA models and machine learning algorithms (Random Forest, XGBoost) to predict sales trends and identify key performance indicators. Used statistical analysis to determine correlation between various factors and sales performance.',
            datasetInfo: 'Analyzed 2+ years of sales data with 500K+ transactions across 15 product categories, 50+ geographic regions, and multiple sales channels including online, retail, and B2B.',
        },
    },
    {
        _id: uuid(),
        _type: 'portfolioProject',
        title: 'Brand Identity Animation',
        slug: { current: 'brand-identity-animation', _type: 'slug' },
        category: 'animation',
        shortDescription: 'Animated logo and brand identity package for a tech startup, including motion graphics and promotional videos.',
        description: [
            {
                _type: 'block',
                _key: uuid(),
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        _key: uuid(),
                        text: 'Created a comprehensive brand identity animation package for a emerging tech startup. The project included logo animation, brand guidelines, and a series of promotional videos that capture the company\'s innovative spirit and technical expertise.',
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
                        text: 'The animation style combines clean geometric shapes with dynamic motion to represent the intersection of technology and creativity. The color palette and typography were carefully chosen to convey professionalism while maintaining approachability.',
                    },
                ],
            },
        ],
        heroMedia: {
            type: 'video',
        },
        featured: false,
        tags: ['After Effects', 'Motion Graphics', 'Branding', 'Animation', 'Logo Design'],
        completionDate: '2024-03-20',
        client: 'StartupXYZ',
        status: 'completed',
        technicalDetails: {
            creativeTools: ['Adobe After Effects', 'Adobe Illustrator', 'Cinema 4D', 'Adobe Premiere Pro'],
            duration: '30 seconds main animation, 15 seconds logo reveal, 2 minutes promotional video',
        },
    },
    {
        _id: uuid(),
        _type: 'portfolioProject',
        title: 'Mobile App UI Design',
        slug: { current: 'mobile-app-ui-design', _type: 'slug' },
        category: 'design',
        shortDescription: 'Complete UI/UX design for a fitness tracking mobile app, including user research, wireframes, and high-fidelity prototypes.',
        description: [
            {
                _type: 'block',
                _key: uuid(),
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        _key: uuid(),
                        text: 'Designed a comprehensive mobile application for fitness tracking that prioritizes user experience and accessibility. The project began with extensive user research and competitive analysis to understand the needs of fitness enthusiasts and casual users alike.',
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
                        text: 'The design system includes custom iconography, a cohesive color palette, and intuitive navigation patterns. Special attention was paid to data visualization for workout metrics and progress tracking, ensuring users can quickly understand their fitness journey.',
                    },
                ],
            },
        ],
        heroMedia: {
            type: 'image',
        },
        featured: true,
        tags: ['UI/UX', 'Mobile Design', 'Figma', 'Prototyping', 'User Research', 'Fitness'],
        completionDate: '2024-04-01',
        client: 'FitTech Solutions',
        status: 'completed',
        technicalDetails: {
            creativeTools: ['Figma', 'Adobe Illustrator', 'Principle', 'Maze', 'Miro'],
            duration: '6 weeks from research to final prototype',
        },
    },
    {
        _id: uuid(),
        _type: 'portfolioProject',
        title: 'Product Launch Video',
        slug: { current: 'product-launch-video', _type: 'slug' },
        category: 'creative',
        shortDescription: 'Creative promotional video for a new product launch, featuring 3D animations, motion graphics, and compelling storytelling.',
        description: [
            {
                _type: 'block',
                _key: uuid(),
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        _key: uuid(),
                        text: 'Produced a high-impact promotional video for a major product launch, combining live-action footage with 3D animations and motion graphics. The video tells a compelling story about how the product solves real-world problems while showcasing its key features and benefits.',
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
                        text: 'The project involved close collaboration with the marketing team to ensure the video aligned with the overall campaign strategy. Custom 3D models were created to demonstrate product functionality, while carefully crafted motion graphics enhanced the storytelling.',
                    },
                ],
            },
        ],
        heroMedia: {
            type: 'video',
        },
        featured: false,
        tags: ['Video Production', '3D Animation', 'Motion Graphics', 'Product Marketing', 'Storytelling'],
        completionDate: '2024-04-15',
        client: 'InnovateCorp',
        status: 'completed',
        technicalDetails: {
            creativeTools: ['Adobe Premiere Pro', 'After Effects', 'Blender', 'DaVinci Resolve', 'Cinema 4D'],
            duration: '2 minutes promotional video, 30 seconds social media cut, 15 seconds teaser',
        },
    },
    {
        _id: uuid(),
        _type: 'portfolioProject',
        title: 'Machine Learning Model Deployment',
        slug: { current: 'ml-model-deployment', _type: 'slug' },
        category: 'coding',
        shortDescription: 'End-to-end machine learning pipeline for image classification, deployed on AWS with automated retraining and monitoring.',
        description: [
            {
                _type: 'block',
                _key: uuid(),
                style: 'normal',
                children: [
                    {
                        _type: 'span',
                        _key: uuid(),
                        text: 'Built a complete machine learning pipeline for image classification, from data preprocessing to model deployment and monitoring. The system processes thousands of images daily and provides real-time predictions with 95% accuracy.',
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
                        text: 'The deployment includes automated model retraining, A/B testing for model versions, and comprehensive monitoring dashboards. The infrastructure is fully containerized and scales automatically based on demand.',
                    },
                ],
            },
        ],
        heroMedia: {
            type: 'image',
        },
        featured: true,
        tags: ['Python', 'TensorFlow', 'AWS', 'Docker', 'MLOps', 'Computer Vision'],
        completionDate: '2024-05-10',
        client: 'AI Solutions Inc.',
        status: 'completed',
        technicalDetails: {
            technologies: [
                { _type: 'reference', _ref: technologies[4]._id, _key: uuid() }, // Python
            ],
            githubUrl: 'https://github.com/example/ml-deployment',
            liveUrl: 'https://ml-api.example.com',
            codeSnippet: `# Model prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image = request.files['image']
    processed_image = preprocess_image(image)
    prediction = model.predict(processed_image)
    
    return jsonify({
        'prediction': prediction.tolist(),
        'confidence': float(np.max(prediction)),
        'class': class_names[np.argmax(prediction)]
    })`,
        },
    },
];

async function checkExistingData() {
    try {
        const existingProjects = await client.fetch('count(*[_type == "portfolioProject"])');
        const existingTechnologies = await client.fetch('count(*[_type == "technology"])');

        if (existingProjects > 0 || existingTechnologies > 0) {
            console.log('⚠️  Existing data found:');
            console.log(`   - ${existingProjects} portfolio projects`);
            console.log(`   - ${existingTechnologies} technologies`);
            console.log('');
            console.log('🔄 This script will replace existing documents with the same IDs.');
            console.log('   New documents will be created for any that don\'t exist.');
            console.log('');

            // In a real scenario, you might want to prompt for confirmation
            // For now, we'll just proceed with a warning
            console.log('⏳ Proceeding in 3 seconds... (Ctrl+C to cancel)');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    } catch (error) {
        console.error('❌ Error checking existing data:', error);
        process.exit(1);
    }
}

async function seedData() {
    try {
        console.log('🌱 Starting to seed Sanity with portfolio data...');

        // Check for existing data
        await checkExistingData();

        // First, create technologies
        console.log('📦 Creating technologies...');
        const techTransaction = client.transaction();
        technologies.forEach(tech => {
            techTransaction.createOrReplace(tech);
        });
        await techTransaction.commit();
        console.log(`✅ Created ${technologies.length} technologies`);

        // Then, create portfolio projects
        console.log('🎨 Creating portfolio projects...');
        const projectTransaction = client.transaction();
        portfolioProjects.forEach(project => {
            projectTransaction.createOrReplace(project);
        });
        await projectTransaction.commit();
        console.log(`✅ Created ${portfolioProjects.length} portfolio projects`);

        console.log('🎉 Successfully seeded all data!');
        console.log('\n📋 Summary:');
        console.log(`- ${technologies.length} technologies created`);
        console.log(`- ${portfolioProjects.length} portfolio projects created`);
        console.log('\n🔗 You can now view your portfolio at: http://localhost:3000/portfolio');
        console.log('🎨 Edit projects in Sanity Studio at: http://localhost:3333');

    } catch (error) {
        console.error('❌ Error seeding data:', error);
        if (error.message.includes('Insufficient permissions')) {
            console.error('');
            console.error('🔐 Permission error: Make sure your SANITY_API_WRITE_TOKEN has Editor permissions');
            console.error('   1. Go to https://sanity.io/manage');
            console.error('   2. Select your project');
            console.error('   3. Go to API → Tokens');
            console.error('   4. Create a new token with Editor permissions');
        }
        process.exit(1);
    }
}

// Run the seed function
seedData();