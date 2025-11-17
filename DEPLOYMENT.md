# Shanko Card Game - Deployment Guide

This guide covers deploying the Shanko Card Game to production hosting platforms.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git repository (for automated deployments)

## Building for Production

### Local Build

To create a production build locally:

```bash
npm run build
```

This will:
- Run TypeScript compiler to check for type errors
- Bundle and minify all JavaScript and CSS
- Optimize assets and images
- Generate source maps for debugging
- Output everything to the `dist/` directory

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

This starts a local server at `http://localhost:4173` serving the production build.

## Deployment Options

### Option 1: Netlify (Recommended)

Netlify provides excellent support for static sites with automatic deployments from Git.

#### Automated Deployment (Git-based)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider and select your repository
   - Netlify will auto-detect the settings from `netlify.toml`

3. **Deploy:**
   - Click "Deploy site"
   - Netlify will automatically build and deploy
   - Every push to your main branch will trigger a new deployment

#### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Custom Domain Setup (Netlify)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure DNS
4. Netlify will automatically provision SSL certificate

### Option 2: Vercel

Vercel offers similar features with excellent performance and DX.

#### Automated Deployment (Git-based)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect the settings from `vercel.json`

3. **Deploy:**
   - Click "Deploy"
   - Automatic deployments on every push

#### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Build the project
npm run build

# Deploy
vercel --prod
```

#### Custom Domain Setup (Vercel)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. SSL is automatically provisioned

### Option 3: GitHub Pages

For free hosting directly from your GitHub repository.

#### Setup

1. **Install gh-pages package:**
```bash
npm install --save-dev gh-pages
```

2. **Add deployment script to package.json:**
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. **Update vite.config.ts base path:**
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

4. **Deploy:**
```bash
npm run deploy
```

5. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Select `gh-pages` branch as source
   - Your site will be at `https://username.github.io/repo-name/`

### Option 4: AWS S3 + CloudFront

For enterprise-grade hosting with CDN.

#### Setup

1. **Create S3 bucket:**
   - Enable static website hosting
   - Configure bucket policy for public read access

2. **Create CloudFront distribution:**
   - Origin: Your S3 bucket
   - Enable HTTPS
   - Configure custom domain (optional)

3. **Deploy:**
```bash
# Build
npm run build

# Upload to S3 (requires AWS CLI)
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Environment Variables

If you need environment-specific configuration:

1. **Create `.env.production` file:**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_ANALYTICS_ID=your-analytics-id
```

2. **Access in code:**
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

3. **Configure in hosting platform:**
   - Netlify: Site settings → Environment variables
   - Vercel: Project Settings → Environment Variables

## Performance Optimization

The production build includes:

- **Code Splitting:** Vendor libraries separated for better caching
- **Minification:** JavaScript and CSS minified with Terser
- **Tree Shaking:** Unused code removed
- **Asset Optimization:** Images and assets optimized
- **Compression:** Gzip/Brotli compression enabled on hosting platforms
- **Source Maps:** Generated for debugging production issues

## Post-Deployment Checklist

- [ ] Test the deployed site on multiple devices
- [ ] Verify all game features work correctly
- [ ] Check browser console for errors
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify mobile responsiveness
- [ ] Test accessibility features
- [ ] Check page load performance (use Lighthouse)
- [ ] Verify custom domain and SSL certificate (if applicable)
- [ ] Set up monitoring/analytics (optional)

## Monitoring and Analytics

### Google Analytics (Optional)

1. Create a Google Analytics property
2. Add tracking code to `index.html` or use a React analytics library
3. Track game events (game starts, rounds completed, etc.)

### Error Tracking (Optional)

Consider integrating error tracking services:
- Sentry
- LogRocket
- Rollbar

## Rollback Strategy

### Netlify/Vercel
- Both platforms keep deployment history
- You can rollback to any previous deployment with one click
- Go to Deployments → Select previous deployment → Publish

### Manual Deployments
- Keep Git tags for each deployment
- Rebuild and redeploy from a previous commit if needed

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### 404 Errors on Refresh
- Ensure SPA redirect rules are configured (included in netlify.toml and vercel.json)

### Assets Not Loading
- Check base path in vite.config.ts
- Verify asset paths are relative

### Performance Issues
- Run Lighthouse audit
- Check bundle size: `npm run build:analyze`
- Consider lazy loading components

## Support

For deployment issues:
- Check hosting platform documentation
- Review build logs for errors
- Ensure all dependencies are installed
- Verify configuration files are correct

## Security Considerations

The deployment includes:
- Security headers (X-Frame-Options, CSP, etc.)
- HTTPS enforcement (automatic on Netlify/Vercel)
- No sensitive data in client-side code
- Source maps for debugging (can be disabled if needed)

## Cost Estimates

- **Netlify Free Tier:** 100GB bandwidth/month, unlimited sites
- **Vercel Free Tier:** 100GB bandwidth/month, unlimited deployments
- **GitHub Pages:** Free for public repositories
- **AWS S3 + CloudFront:** Pay-as-you-go (typically $1-5/month for small sites)

All free tiers are sufficient for most use cases.
