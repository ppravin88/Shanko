# Hosting Setup Guide

This guide provides step-by-step instructions for deploying Shanko Card Game to various hosting platforms.

## Quick Start

The fastest way to deploy is using Netlify or Vercel with Git integration:

1. Push your code to GitHub
2. Connect your repository to Netlify or Vercel
3. Deploy automatically

Both platforms will auto-detect the configuration from `netlify.toml` or `vercel.json`.

## Netlify Deployment

### Method 1: Git-Based Deployment (Recommended)

1. **Create a Netlify account** at [netlify.com](https://netlify.com)

2. **Connect your Git repository:**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Netlify to access your repositories
   - Select the Shanko Card Game repository

3. **Configure build settings** (auto-detected from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

4. **Deploy:**
   - Click "Deploy site"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your site will be live at a random Netlify subdomain

5. **Set up custom domain (optional):**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain name (e.g., `shanko.yourdomain.com`)
   - Follow DNS configuration instructions:
     - Add a CNAME record pointing to your Netlify subdomain
     - Or use Netlify DNS for easier setup
   - SSL certificate is automatically provisioned

### Method 2: Netlify CLI Deployment

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site (first time only)
netlify init

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Netlify Environment Variables

If you need environment variables:

1. Go to Site settings → Environment variables
2. Add variables (must start with `VITE_`):
   - `VITE_API_URL`
   - `VITE_ANALYTICS_ID`
   - etc.
3. Redeploy for changes to take effect

### Netlify Features Included

- ✅ Automatic HTTPS
- ✅ CDN distribution
- ✅ Continuous deployment from Git
- ✅ Deploy previews for pull requests
- ✅ Rollback to previous deployments
- ✅ Custom domain support
- ✅ Form handling (if needed in future)
- ✅ Serverless functions (if needed in future)

## Vercel Deployment

### Method 1: Git-Based Deployment (Recommended)

1. **Create a Vercel account** at [vercel.com](https://vercel.com)

2. **Import your project:**
   - Click "Add New Project"
   - Import from your Git provider
   - Select the Shanko Card Game repository

3. **Configure project** (auto-detected from vercel.json):
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be live at a Vercel subdomain

5. **Set up custom domain (optional):**
   - Go to Project Settings → Domains
   - Click "Add"
   - Enter your domain name
   - Configure DNS:
     - Add an A record pointing to Vercel's IP
     - Or add a CNAME record to `cname.vercel-dns.com`
   - SSL is automatically provisioned

### Method 2: Vercel CLI Deployment

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (first time - follow prompts)
vercel

# Deploy to production
npm run build
vercel --prod
```

### Vercel Environment Variables

1. Go to Project Settings → Environment Variables
2. Add variables for each environment:
   - Production
   - Preview
   - Development
3. Variables must start with `VITE_`

### Vercel Features Included

- ✅ Automatic HTTPS
- ✅ Global CDN (Edge Network)
- ✅ Continuous deployment from Git
- ✅ Preview deployments for branches
- ✅ Instant rollbacks
- ✅ Custom domain support
- ✅ Analytics (optional)
- ✅ Serverless functions (if needed in future)

## GitHub Pages Deployment

### Setup

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Add deploy script to package.json:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update vite.config.ts:**
```typescript
export default defineConfig({
  base: '/shanko-card-game/', // Replace with your repo name
  // ... rest of config
})
```

4. **Deploy:**
```bash
npm run deploy
```

5. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` → `/ (root)`
   - Save

6. **Access your site:**
   - `https://yourusername.github.io/shanko-card-game/`

### GitHub Pages Limitations

- ⚠️ No custom headers (security headers not supported)
- ⚠️ No server-side redirects (SPA routing may have issues)
- ⚠️ Slower than CDN-based solutions
- ✅ Free for public repositories
- ✅ Good for demos and prototypes

## AWS S3 + CloudFront (Advanced)

For enterprise-grade hosting with full control.

### Prerequisites

- AWS account
- AWS CLI installed and configured
- Basic knowledge of AWS services

### Setup Steps

1. **Create S3 bucket:**
```bash
aws s3 mb s3://shanko-card-game
```

2. **Configure bucket for static hosting:**
```bash
aws s3 website s3://shanko-card-game \
  --index-document index.html \
  --error-document index.html
```

3. **Set bucket policy for public access:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::shanko-card-game/*"
    }
  ]
}
```

4. **Create CloudFront distribution:**
   - Origin: Your S3 bucket
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Compress Objects Automatically: Yes
   - Price Class: Use all edge locations
   - Alternate Domain Names: your-domain.com
   - SSL Certificate: Request or import certificate

5. **Deploy:**
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://shanko-card-game --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

6. **Configure DNS:**
   - Add CNAME record pointing to CloudFront distribution
   - Or use Route 53 for AWS-native DNS

### AWS Deployment Script

Create `deploy-aws.sh`:

```bash
#!/bin/bash

# Build the project
npm run build

# Upload to S3
aws s3 sync dist/ s3://shanko-card-game \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# Upload index.html with no-cache
aws s3 cp dist/index.html s3://shanko-card-game/index.html \
  --cache-control "public, max-age=0, must-revalidate"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy-aws.sh
```

## Custom Domain Setup

### DNS Configuration

For most hosting platforms, you'll need to configure DNS:

#### Option 1: CNAME Record (Subdomain)
```
Type: CNAME
Name: shanko (or www)
Value: your-site.netlify.app (or vercel.app)
TTL: 3600
```

#### Option 2: A Record (Root Domain)
```
Type: A
Name: @ (or leave blank)
Value: [Platform's IP address]
TTL: 3600
```

#### Option 3: ALIAS Record (AWS Route 53)
```
Type: ALIAS
Name: @ (or subdomain)
Value: CloudFront distribution
```

### SSL Certificate

All recommended platforms provide free SSL certificates:
- **Netlify:** Automatic via Let's Encrypt
- **Vercel:** Automatic via Let's Encrypt
- **AWS:** Use AWS Certificate Manager (free)

## Performance Optimization

### CDN Configuration

All platforms include CDN by default, but you can optimize:

1. **Enable compression:**
   - Gzip and Brotli (automatic on Netlify/Vercel)

2. **Set cache headers:**
   - Already configured in netlify.toml and vercel.json
   - HTML: no-cache
   - Assets: 1 year cache (immutable)

3. **Use HTTP/2:**
   - Enabled by default on all platforms

### Monitoring

Set up monitoring to track:
- Page load times
- Error rates
- Traffic patterns
- Geographic distribution

Tools:
- Google Analytics
- Vercel Analytics
- Netlify Analytics
- CloudWatch (AWS)

## Troubleshooting

### Build Fails

**Error: Node version mismatch**
```bash
# Solution: Specify Node version
# Netlify: Add to netlify.toml
[build.environment]
  NODE_VERSION = "18"

# Vercel: Add to package.json
"engines": {
  "node": ">=18.0.0"
}
```

**Error: Out of memory**
```bash
# Solution: Increase Node memory
# Add to package.json scripts:
"build": "NODE_OPTIONS=--max-old-space-size=4096 vite build"
```

### 404 Errors on Page Refresh

**Problem:** SPA routing doesn't work on direct URL access

**Solution:** Ensure redirect rules are configured
- Netlify: Check `netlify.toml` has `[[redirects]]` section
- Vercel: Check `vercel.json` has `rewrites` section
- GitHub Pages: Use hash routing or custom 404.html

### Assets Not Loading

**Problem:** Assets return 404 errors

**Solution:** Check base path in `vite.config.ts`
```typescript
export default defineConfig({
  base: '/', // For root domain
  // or
  base: '/repo-name/', // For GitHub Pages
})
```

### Slow Initial Load

**Problem:** Large bundle size

**Solution:**
1. Analyze bundle: `npm run build:analyze`
2. Implement code splitting
3. Lazy load components
4. Optimize images
5. Enable compression

## Cost Comparison

| Platform | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| **Netlify** | 100GB bandwidth/month | $19/month | Most projects |
| **Vercel** | 100GB bandwidth/month | $20/month | Next.js, Vite |
| **GitHub Pages** | Unlimited (public repos) | N/A | Open source |
| **AWS S3+CloudFront** | 50GB transfer (first year) | Pay-as-you-go | Enterprise |

For Shanko Card Game, the free tiers are more than sufficient.

## Security Checklist

- [x] HTTPS enabled
- [x] Security headers configured
- [x] No sensitive data in client code
- [x] Source maps available for debugging
- [x] Dependencies up to date
- [x] CSP headers (optional, can be added)
- [x] Rate limiting (platform-dependent)

## Next Steps

After deployment:

1. Test the live site thoroughly
2. Set up monitoring and analytics
3. Configure custom domain
4. Set up automated deployments
5. Create deployment documentation for team
6. Plan for scaling if needed

## Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Vercel Docs:** https://vercel.com/docs
- **GitHub Pages:** https://pages.github.com
- **AWS Docs:** https://docs.aws.amazon.com

For issues, check the platform's status page and community forums.
