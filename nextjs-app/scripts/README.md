# Portfolio Data Seeding

This script will populate your Sanity database with sample portfolio data including technologies and portfolio projects.

## Quick Test

First, test your Sanity connection:
```bash
cd nextjs-app
npm run test-sanity
```

This will show you what data currently exists and verify your connection is working.

## Setup

1. **Get a Sanity Write Token:**
   - Go to your Sanity project dashboard: https://sanity.io/manage
   - Navigate to your project (`cwls6cmx`)
   - Go to **API** → **Tokens**
   - Click **Add API token**
   - Give it a name like "Portfolio Seeding"
   - Set permissions to **Editor** (not Viewer)
   - Click **Save**
   - Copy the token (it will only be shown once!)

2. **Add the Write Token to your environment:**
   Add this line to your `nextjs-app/.env.local` file:
   ```
   SANITY_API_WRITE_TOKEN=your_write_token_here
   ```

3. **Run the seeding script:**
   ```bash
   cd nextjs-app
   npm run seed-portfolio
   ```

## What gets created:

### Technologies (7 items):
- Next.js
- TypeScript  
- PostgreSQL
- Stripe
- Python
- React

### Portfolio Projects (7 items):
- **E-commerce Platform** (Coding) - Featured
- **Urban Photography Series** (Photography) - Featured  
- **Sales Analytics Dashboard** (Data Analysis)
- **Brand Identity Animation** (Animation)
- **Mobile App UI Design** (Design) - Featured
- **Product Launch Video** (Creative)
- **Machine Learning Model Deployment** (Coding) - Featured

## After seeding:

1. Visit http://localhost:3000/portfolio to see your populated portfolio
2. You can edit/add more projects in the Sanity Studio at http://localhost:3333
3. The sample data includes realistic project details, client information, and technical specifications

## Troubleshooting:

- **"Missing SANITY_API_WRITE_TOKEN" error**: Make sure you added the write token to your .env.local file
- **Permission errors**: Ensure your token has Editor permissions in the Sanity dashboard
- **Network errors**: Check that your project ID and dataset are correct in .env.local

## Customization:

You can modify the sample data in `scripts/seed-portfolio.js` before running the script to match your actual portfolio projects and technologies.