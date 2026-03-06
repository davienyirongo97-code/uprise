# Uprise Microfinance - Deployment Guide

## Quick Start: Deploy in 5 Minutes (Frontend Only)

### Option 1: GitHub Pages (Easiest)

1. **Enable GitHub Pages:**
   - Go to: https://github.com/davienyirongo97-code/uprise/settings/pages
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/web` (if available) or `/ (root)`
   - Click Save

2. **Access Your Site:**
   - URL: `https://davienyirongo97-code.github.io/uprise/web/`
   - Wait 2-3 minutes for deployment

3. **Add Custom Domain (Optional):**
   - Buy domain from Namecheap, GoDaddy, etc.
   - Add CNAME record pointing to: `davienyirongo97-code.github.io`
   - Add custom domain in GitHub Pages settings

**Note:** This deploys frontend only. Backend won't work, but you can use demo mode.

---

### Option 2: Netlify (Recommended - Best Free Option)

1. **Sign Up:**
   - Go to: https://app.netlify.com/signup
   - Click "Sign up with GitHub"

2. **Deploy:**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your `uprise` repository
   - Configure:
     ```
     Base directory: web
     Build command: (leave empty)
     Publish directory: web
     ```
   - Click "Deploy site"

3. **Your Site:**
   - Live at: `https://random-name-12345.netlify.app`
   - Click "Site settings" → "Change site name" to customize
   - Example: `uprise-microfinance.netlify.app`

4. **Custom Domain:**
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Follow DNS configuration instructions

**Advantages:**
- Free HTTPS
- Automatic deployments on git push
- Custom domain support
- Fast CDN
- 100GB bandwidth/month free

---

### Option 3: Vercel (Great Alternative)

1. **Sign Up:**
   - Go to: https://vercel.com/signup
   - Sign up with GitHub

2. **Deploy:**
   - Click "Add New" → "Project"
   - Import your `uprise` repository
   - Configure:
     ```
     Framework Preset: Other
     Root Directory: web
     Build Command: (leave empty)
     Output Directory: .
     ```
   - Click "Deploy"

3. **Your Site:**
   - Live at: `https://uprise-xyz.vercel.app`
   - Can customize subdomain

---

## Full Stack Deployment (Frontend + Backend + Database)

### Option 4: Railway.app (Recommended for Full Stack)

**What You Get:**
- Frontend hosting
- Backend (Spring Boot) hosting
- PostgreSQL database
- $5/month free credit
- Custom domain support

**Steps:**

1. **Sign Up:**
   - Go to: https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `uprise` repository

3. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will create a database and provide connection details

4. **Deploy Backend:**
   - Click "New" → "GitHub Repo"
   - Select your repo
   - Configure:
     ```
     Root Directory: backend
     Build Command: ./mvnw clean package -DskipTests
     Start Command: java -jar target/*.jar
     ```
   - Add environment variables:
     ```
     SPRING_DATASOURCE_URL=<from PostgreSQL service>
     SPRING_DATASOURCE_USERNAME=<from PostgreSQL service>
     SPRING_DATASOURCE_PASSWORD=<from PostgreSQL service>
     ```

5. **Deploy Frontend:**
   - Click "New" → "GitHub Repo"
   - Select your repo
   - Configure:
     ```
     Root Directory: web
     Build Command: (none)
     ```
   - Update `web/app.js` API_BASE_URL to your backend URL

6. **Connect Everything:**
   - Backend URL: `https://your-backend.railway.app`
   - Frontend URL: `https://your-frontend.railway.app`
   - Update frontend to point to backend

---

### Option 5: Render (Full Stack Alternative)

**Free Tier Includes:**
- Static site hosting
- Web service (for backend)
- PostgreSQL database (90 days free)

**Steps:**

1. **Sign Up:**
   - Go to: https://render.com
   - Sign up with GitHub

2. **Deploy Backend:**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Configure:
     ```
     Name: uprise-backend
     Root Directory: backend
     Environment: Java
     Build Command: ./mvnw clean package -DskipTests
     Start Command: java -jar target/*.jar
     ```

3. **Add PostgreSQL:**
   - Click "New" → "PostgreSQL"
   - Create database
   - Copy connection string

4. **Deploy Frontend:**
   - Click "New" → "Static Site"
   - Connect your GitHub repo
   - Configure:
     ```
     Name: uprise-frontend
     Root Directory: web
     Publish Directory: web
     ```

---

## Custom Domain Setup

### If You Buy a Domain (e.g., upriseloans.com):

1. **Buy Domain:**
   - Namecheap: ~$10/year
   - GoDaddy: ~$12/year
   - Google Domains: ~$12/year

2. **Configure DNS:**
   
   **For Netlify/Vercel:**
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app (or vercel.app)
   
   Type: A
   Name: @
   Value: (provided by hosting service)
   ```

3. **Add to Hosting:**
   - Go to your hosting dashboard
   - Add custom domain
   - Wait for DNS propagation (5-30 minutes)

---

## Recommended Deployment Strategy

### For Demo/Testing:
**Use Netlify** (frontend only)
- Fastest to set up
- Free forever
- Good for showcasing

### For Production:
**Use Railway or Render** (full stack)
- Complete application
- Real database
- Scalable

---

## Quick Deployment Commands

### Prepare for Deployment:

```bash
# 1. Update API URL in frontend
# Edit web/app.js and change:
const API_BASE_URL = 'https://your-backend-url.railway.app';

# 2. Commit changes
git add .
git commit -m "Prepare for deployment"
git push origin main

# 3. Deploy will happen automatically if connected to hosting service
```

---

## Environment Variables Needed

### Backend (.env or hosting dashboard):
```
SPRING_DATASOURCE_URL=jdbc:postgresql://host:port/database
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your-secret-key-here
SERVER_PORT=8080
```

### Frontend (update in app.js):
```javascript
const API_BASE_URL = 'https://your-backend.railway.app';
```

---

## Cost Breakdown

### Free Options:
- **GitHub Pages**: Free forever (frontend only)
- **Netlify**: Free forever (100GB bandwidth)
- **Vercel**: Free forever (100GB bandwidth)
- **Railway**: $5/month credit (enough for small apps)
- **Render**: Free tier (with limitations)

### Paid Options (if you outgrow free tier):
- **Railway**: ~$5-20/month
- **Render**: ~$7-25/month
- **Heroku**: ~$7-25/month
- **DigitalOcean**: ~$5-10/month

---

## Next Steps

1. **Choose your deployment option** (I recommend Netlify for quick start)
2. **Follow the steps above**
3. **Test your deployed application**
4. **Share the URL!**

Your application will be live and accessible from anywhere in the world!

Need help with any specific deployment? Let me know!
