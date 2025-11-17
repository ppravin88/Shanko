# GitHub Push Guide - Step by Step

This guide will help you push your Shanko Card Game code to GitHub.

## Current Status

⚠️ **Git is not installed on your system**

Don't worry! I'll guide you through the entire process.

---

## Option 1: Install Git and Push via Command Line

### Step 1: Install Git

1. **Download Git for Windows:**
   - Go to: https://git-scm.com/download/win
   - Download the latest version (64-bit recommended)
   - Run the installer

2. **Installation Settings:**
   - Accept the license
   - Choose installation location (default is fine)
   - Select components: Keep all defaults
   - Choose default editor: Select "Use Visual Studio Code" or "Use Notepad"
   - Adjust PATH: Select "Git from the command line and also from 3rd-party software"
   - Choose HTTPS transport: "Use the OpenSSL library"
   - Line ending conversions: "Checkout Windows-style, commit Unix-style"
   - Terminal emulator: "Use MinTTY"
   - Default behavior of `git pull`: "Default (fast-forward or merge)"
   - Credential helper: "Git Credential Manager"
   - Extra options: Enable file system caching
   - Click "Install"

3. **Verify Installation:**
   - Close and reopen PowerShell
   - Run: `git --version`
   - Should show: `git version 2.x.x`

### Step 2: Configure Git

Open PowerShell and run these commands (replace with your info):

```powershell
# Set your name (will appear in commits)
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

### Step 3: Create a GitHub Repository

1. **Go to GitHub:**
   - Visit: https://github.com
   - Sign up for a free account (if you don't have one)
   - Sign in

2. **Create a New Repository:**
   - Click the "+" icon in the top right
   - Select "New repository"
   - Repository name: `shanko-card-game` (or your preferred name)
   - Description: "Strategic family card game with unique buying mechanics"
   - Visibility: Choose "Public" or "Private"
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

3. **Copy the Repository URL:**
   - You'll see a page with setup instructions
   - Copy the HTTPS URL (looks like: `https://github.com/yourusername/shanko-card-game.git`)

### Step 4: Initialize Git in Your Project

Open PowerShell in your project directory:

```powershell
# Navigate to your project (if not already there)
cd C:\Users\prempra\Shanko

# Initialize Git repository
git init

# Check status
git status
```

### Step 5: Add Files to Git

```powershell
# Add all files to staging
git add .

# Check what will be committed
git status

# Commit the files
git commit -m "Initial commit: Complete Shanko Card Game with deployment configs"
```

### Step 6: Connect to GitHub and Push

```powershell
# Add GitHub repository as remote (replace with your URL)
git remote add origin https://github.com/yourusername/shanko-card-game.git

# Verify remote was added
git remote -v

# Push to GitHub (first time)
git push -u origin main
```

**Note:** If you get an error about "master" vs "main", run:
```powershell
git branch -M main
git push -u origin main
```

### Step 7: Authenticate with GitHub

When you push for the first time, you'll be prompted to authenticate:

**Option A: GitHub Personal Access Token (Recommended)**
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Shanko Deployment"
4. Select scopes: Check "repo" (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. When prompted for password in Git, paste the token

**Option B: GitHub CLI**
- Install GitHub CLI from: https://cli.github.com
- Run: `gh auth login`
- Follow the prompts

### Step 8: Verify Upload

1. Go to your GitHub repository in the browser
2. Refresh the page
3. You should see all your files!

---

## Option 2: Use GitHub Desktop (Easier for Beginners)

If you prefer a graphical interface:

### Step 1: Install GitHub Desktop

1. **Download:**
   - Go to: https://desktop.github.com
   - Download for Windows
   - Run the installer

2. **Sign In:**
   - Open GitHub Desktop
   - Click "Sign in to GitHub.com"
   - Enter your GitHub credentials
   - Authorize GitHub Desktop

### Step 2: Add Your Project

1. **Add Repository:**
   - Click "File" → "Add local repository"
   - Click "Choose..." and navigate to `C:\Users\prempra\Shanko`
   - Click "Add repository"

2. **If Git Not Initialized:**
   - If you see "This directory does not appear to be a Git repository"
   - Click "Create a repository"
   - Name: `shanko-card-game`
   - Description: "Strategic family card game"
   - Keep "Initialize this repository with a README" unchecked
   - Click "Create repository"

### Step 3: Commit Your Files

1. **Review Changes:**
   - You'll see all your files listed in the left panel
   - Review the changes in the right panel

2. **Commit:**
   - In the bottom left, enter commit message:
     - Summary: "Initial commit: Complete Shanko Card Game"
     - Description: "Includes all game features, deployment configs, and marketing materials"
   - Click "Commit to main"

### Step 4: Publish to GitHub

1. **Publish Repository:**
   - Click "Publish repository" button at the top
   - Name: `shanko-card-game`
   - Description: "Strategic family card game with unique buying mechanics"
   - Choose "Public" or "Private"
   - **Uncheck** "Keep this code private" if you want it public
   - Click "Publish repository"

2. **Wait for Upload:**
   - GitHub Desktop will upload all your files
   - This may take a few minutes depending on your internet speed

3. **View on GitHub:**
   - Click "View on GitHub" button
   - Your repository is now live!

---

## Option 3: Upload via GitHub Web Interface (No Git Required)

If you don't want to install Git:

### Step 1: Create Repository on GitHub

1. Go to https://github.com and sign in
2. Click "+" → "New repository"
3. Name: `shanko-card-game`
4. Description: "Strategic family card game"
5. Choose Public or Private
6. Click "Create repository"

### Step 2: Upload Files

1. **On the repository page:**
   - Click "uploading an existing file"

2. **Drag and Drop:**
   - Open File Explorer to `C:\Users\prempra\Shanko`
   - Select all files and folders
   - Drag them into the GitHub upload area
   - **OR** click "choose your files" and select all

3. **Commit:**
   - Scroll down
   - Commit message: "Initial commit: Complete Shanko Card Game"
   - Click "Commit changes"

**Note:** This method works but is less ideal for future updates. Consider using Git or GitHub Desktop for ongoing development.

---

## After Pushing to GitHub

### Verify Your Upload

1. **Check Repository:**
   - Go to your GitHub repository
   - Verify all files are present:
     - `src/` folder with all components
     - `public/` folder
     - `package.json`
     - `netlify.toml`
     - `vercel.json`
     - All documentation files

2. **Check File Count:**
   - You should see 100+ files
   - Multiple folders (src, public, .github, etc.)

### Next Steps: Deploy to Netlify

Now that your code is on GitHub, you can deploy:

1. **Go to Netlify:**
   - Visit: https://netlify.com
   - Sign up with your GitHub account (easiest)

2. **Import Project:**
   - Click "Add new site" → "Import an existing project"
   - Click "GitHub"
   - Authorize Netlify to access your repositories
   - Select `shanko-card-game` repository

3. **Configure Build:**
   - Netlify will auto-detect settings from `netlify.toml`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

4. **Wait for Deployment:**
   - First deployment takes 2-3 minutes
   - Netlify will install dependencies and build your app
   - You'll get a live URL!

5. **Test Your Live Site:**
   - Click the URL Netlify provides
   - Play through a game
   - Test on mobile
   - Share with friends!

---

## Troubleshooting

### Issue: "Git is not recognized"

**Solution:** 
- Git is not installed or not in PATH
- Install Git from https://git-scm.com/download/win
- Restart PowerShell after installation

### Issue: "Permission denied (publickey)"

**Solution:**
- Use HTTPS instead of SSH
- URL should start with `https://` not `git@`
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Issue: "Authentication failed"

**Solution:**
- Use a Personal Access Token instead of password
- Generate token at: GitHub → Settings → Developer settings → Personal access tokens
- Use token as password when prompted

### Issue: "Repository not found"

**Solution:**
- Check the repository URL is correct
- Ensure you have access to the repository
- Verify you're signed in to the correct GitHub account

### Issue: "Large files warning"

**Solution:**
- GitHub has a 100MB file size limit
- Your project should be well under this
- If you have large files, consider using Git LFS

### Issue: "Failed to push some refs"

**Solution:**
- Someone else pushed changes (unlikely for new repo)
- Run: `git pull origin main --rebase`
- Then: `git push origin main`

---

## Git Cheat Sheet (For Future Updates)

Once your code is on GitHub, use these commands for updates:

```powershell
# Check status
git status

# Add new/modified files
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push

# Pull latest changes (if working with others)
git pull

# View commit history
git log

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

---

## Recommended Approach

For beginners, I recommend:

1. **Use GitHub Desktop** (easiest, visual interface)
   - Download from https://desktop.github.com
   - Sign in with GitHub
   - Add your project
   - Commit and publish

2. **Then Deploy to Netlify**
   - Sign up at https://netlify.com with GitHub
   - Import your repository
   - Automatic deployment!

**Total Time:** 15-20 minutes

---

## Alternative: Skip Git Entirely

If you want to deploy immediately without Git:

1. **Zip your project:**
   - Right-click the `Shanko` folder
   - Send to → Compressed (zipped) folder

2. **Deploy to Netlify:**
   - Go to https://netlify.com
   - Drag and drop the zip file
   - Netlify will deploy it

**Note:** This works for a one-time deployment but won't allow automatic updates from Git.

---

## Summary

### Easiest Path (Recommended):
1. ✅ Install GitHub Desktop
2. ✅ Add your project
3. ✅ Commit and publish to GitHub
4. ✅ Deploy to Netlify from GitHub

**Time:** 15-20 minutes

### Command Line Path:
1. ✅ Install Git
2. ✅ Configure Git
3. ✅ Initialize repository
4. ✅ Commit and push to GitHub
5. ✅ Deploy to Netlify from GitHub

**Time:** 20-30 minutes

### Quick Path (No Git):
1. ✅ Create GitHub repository
2. ✅ Upload files via web interface
3. ✅ Deploy to Netlify from GitHub

**Time:** 10-15 minutes

---

## Need Help?

If you encounter any issues:

1. **Check the error message carefully**
2. **Search the error on Google or Stack Overflow**
3. **Consult GitHub documentation:** https://docs.github.com
4. **Ask in GitHub Community:** https://github.community

---

## Next Steps After GitHub Push

Once your code is on GitHub:

1. ✅ Deploy to Netlify (follow steps above)
2. ✅ Test the live site
3. ✅ Capture screenshots for marketing
4. ✅ Share your game!

**You're almost there! Choose your preferred method and let's get your code on GitHub!**

---

*Last Updated: 2024*
*Difficulty: Beginner-Friendly*
*Estimated Time: 15-30 minutes*
