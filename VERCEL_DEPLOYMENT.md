# Deploying IcePulse Player App to Vercel

## 🚀 Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings

3. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **For production deployment**:
   ```bash
   vercel --prod
   ```

## 📋 Build Configuration

The project is already configured with:
- ✅ `vercel.json` - Vercel configuration
- ✅ `package.json` - Build scripts
- ✅ Vite framework auto-detection

## 🔧 Environment Variables (Optional)

If you need environment variables later, add them in Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add variables like:
  - `VITE_API_URL` - Your backend API URL
  - `VITE_EMAIL_API_URL` - Email service URL

## 📝 Important Notes

1. **Build Output**: The app builds to `dist/` directory
2. **SPA Routing**: All routes redirect to `index.html` (configured in `vercel.json`)
3. **LocalStorage**: Works in production (browser-based storage)
4. **Camera Access**: Requires HTTPS (Vercel provides this automatically)

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure `npm run build` works locally first

### Routes Not Working
- The `vercel.json` rewrite rule should handle this
- Make sure all routes go through React Router

### Environment Variables Not Working
- Vite requires `VITE_` prefix for client-side variables
- Restart deployment after adding variables

## 🎉 After Deployment

Your app will be available at:
- `https://your-project-name.vercel.app`
- You can add a custom domain in Vercel settings

