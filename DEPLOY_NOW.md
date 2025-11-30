# 🚀 Deploy to Vercel - Quick Start

## Option 1: Deploy via Vercel CLI (Fastest - No GitHub needed)

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
(This will open your browser to authenticate)

### Step 3: Deploy
```bash
cd "/Users/williamdoss/IcePulse Player App"
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Choose your account)
- Link to existing project? **No**
- Project name? (Press Enter for default or type a name)
- Directory? (Press Enter - it's `.`)
- Override settings? **No**

### Step 4: Deploy to Production
```bash
vercel --prod
```

**Done!** Your app will be live at `https://your-project-name.vercel.app`

---

## Option 2: Deploy via GitHub (Recommended for continuous deployment)

### Step 1: Initialize Git
```bash
cd "/Users/williamdoss/IcePulse Player App"
git init
git add .
git commit -m "Initial commit - Ready for Vercel"
```

### Step 2: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New Repository"
3. Name it (e.g., "icepulse-player-app")
4. Don't initialize with README
5. Click "Create repository"

### Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login (use GitHub)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite
6. Click "Deploy"
7. Wait ~2 minutes
8. **Done!** Your app is live!

---

## ✅ What's Already Configured

- ✅ `vercel.json` - Vercel configuration file
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ SPA routing configured (all routes → index.html)

## 🔧 Environment Variables (If Needed Later)

If you add backend APIs later, add env vars in Vercel:
1. Go to Project Settings → Environment Variables
2. Add variables with `VITE_` prefix (e.g., `VITE_API_URL`)
3. Redeploy

## 📝 Notes

- **Build tested**: ✅ Build works locally
- **HTTPS**: Automatically provided by Vercel (required for camera access)
- **LocalStorage**: Works in production
- **Auto-deploy**: If using GitHub, every push auto-deploys

## 🎉 Your App Will Be Live At:

After deployment, you'll get a URL like:
- `https://icepulse-player-app.vercel.app`
- Or your custom domain if you add one

