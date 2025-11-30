# Push IcePulse Player App to GitHub

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New Repository"** (green button)
3. Repository name: `icepulse-player-app`
4. Description: (optional) "IcePulse Player Training App"
5. **Make it Private** (or Public - your choice)
6. **DO NOT** initialize with README, .gitignore, or license
7. Click **"Create repository"**

## Step 2: Copy the Repository URL

After creating, GitHub will show you a URL like:
- `https://github.com/YOUR_USERNAME/icepulse-player-app.git`

**Copy this URL!**

## Step 3: Push Your Code

Run these commands (replace YOUR_USERNAME with your GitHub username):

```bash
cd "/Users/williamdoss/IcePulse Player App"

# Add all new files
git add .

# Commit new files
git commit -m "Add deployment files and configuration"

# Add GitHub remote (REPLACE with your actual GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/icepulse-player-app.git

# Push to GitHub
git push -u origin main
```

## Step 4: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Find your `icepulse-player-app` repository
4. Click **"Import"**
5. Click **"Deploy"**

---

## Alternative: Fix SSL Issue & Use Vercel CLI

If you want to use Vercel CLI instead, fix the SSL certificate issue:

```bash
# Set Node to not verify SSL (temporary workaround)
export NODE_TLS_REJECT_UNAUTHORIZED=0

# Then deploy
vercel
```

Or use Vercel Dashboard manual upload (no CLI needed).

