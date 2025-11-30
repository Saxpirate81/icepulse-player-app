# Create GitHub Repository and Push Code

## Step 1: Create Repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. **Repository name:** `icepulse-player-app` (or any name you want)
3. **Description:** (optional) "IcePulse Player Training App"
4. **Visibility:** Choose Private or Public
5. **IMPORTANT:** Do NOT check "Add a README file"
6. **IMPORTANT:** Do NOT check "Add .gitignore"
7. **IMPORTANT:** Do NOT check "Choose a license"
8. Click **"Create repository"**

## Step 2: Copy the Repository URL

After creating, GitHub will show you commands. Look for the URL like:
```
https://github.com/Saxpirate81/icepulse-player-app.git
```

**Copy this URL!**

## Step 3: Push Your Code

Run these commands (replace `Saxpirate81` with your actual GitHub username if different):

```bash
cd "/Users/williamdoss/IcePulse Player App"

# Make sure everything is committed
git add .
git commit -m "Add deployment configuration and setup files"

# Add GitHub remote (REPLACE with your actual repository URL from Step 2)
git remote add origin https://github.com/Saxpirate81/icepulse-player-app.git

# Push to GitHub
git push -u origin main
```

## Step 4: Verify on GitHub

1. Go to [github.com/Saxpirate81/icepulse-player-app](https://github.com/Saxpirate81/icepulse-player-app)
2. You should see all your files!

## Step 5: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Find **`icepulse-player-app`** in your repositories
4. Click **"Import"**
5. Click **"Deploy"**

---

**Note:** Make sure you create the repository on GitHub FIRST before running the git commands!

