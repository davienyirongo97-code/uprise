# Railway Deployment - Quick Steps

## ✅ What You've Done So Far:
1. Created PostgreSQL database on Railway
2. Updated backend configuration for PostgreSQL
3. Committed changes to GitHub

## 🚀 Next Steps in Railway Dashboard:

### Step 1: Deploy Backend

1. Click **"New"** button (top right in Railway)
2. Select **"GitHub Repo"**
3. Choose **"uprise"** repository
4. Configure:
   - **Service Name**: `uprise-backend`
   - **Root Directory**: `backend`
   
5. **Add Environment Variables** (click "Variables" tab):
   - Go to your Postgres service
   - Copy these variables and add them to backend service:
     ```
     DATABASE_URL
     PGUSER
     PGPASSWORD
     PGDATABASE
     PGHOST
     PGPORT
     ```
   - Add one more variable:
     ```
     JWT_SECRET=uprise-secret-key-2024-change-this-in-production
     ```

6. Click **"Deploy"**

7. **Wait for deployment** (2-5 minutes)
   - Watch the logs
   - Look for "Started MicrofinanceApplication"

8. **Get your backend URL**:
   - Click "Settings" tab
   - Click "Generate Domain"
   - Copy the URL (e.g., `https://uprise-backend-production.up.railway.app`)

### Step 2: Update Frontend with Backend URL

1. In your local code, open `web/app-enhanced.js`
2. Find line 3 and replace `YOUR-BACKEND-URL` with your actual Railway backend URL:
   ```javascript
   const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
       ? 'http://localhost:8081/api'
       : 'https://uprise-backend-production.up.railway.app/api';
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Update backend URL for Railway"
   git push origin main
   ```

### Step 3: Deploy Frontend

1. In Railway, click **"New"** again
2. Select **"GitHub Repo"**
3. Choose **"uprise"** repository again
4. Configure:
   - **Service Name**: `uprise-frontend`
   - **Root Directory**: `web`

5. Click **"Deploy"**

6. **Generate Domain**:
   - Go to Settings
   - Click "Generate Domain"
   - You'll get a URL like: `https://uprise-frontend-production.up.railway.app`

### Step 4: Test Your Application

1. Open your frontend URL: `https://uprise-frontend-production.up.railway.app`
2. Login with:
   - **Admin**: `admin` / `admin123`
   - **Branch User**: `branch1` / `branch123`

3. Test features:
   - Register a client
   - Apply for a loan
   - View dashboard

## 🔧 Troubleshooting

### If Backend Fails to Start:

1. Check logs in Railway dashboard
2. Common issues:
   - Database connection: Make sure all PGXXX variables are set
   - Port: Railway automatically sets PORT variable
   - Build: Make sure Maven build completes

### If Frontend Can't Connect to Backend:

1. Check browser console (F12)
2. Verify backend URL in `app-enhanced.js`
3. Make sure backend is running (check Railway logs)
4. Check CORS settings in backend

### Database Issues:

1. Make sure Postgres service is running
2. Check connection variables are correct
3. Backend should auto-create tables on first run

## 📊 Your Services Structure:

```
Railway Project: uprise
├── Postgres (Database)
│   └── Provides: DATABASE_URL, PGUSER, PGPASSWORD, etc.
│
├── uprise-backend (Spring Boot)
│   ├── Root: backend/
│   ├── Uses: Postgres variables
│   └── URL: https://uprise-backend-production.up.railway.app
│
└── uprise-frontend (Static Site)
    ├── Root: web/
    ├── Connects to: backend URL
    └── URL: https://uprise-frontend-production.up.railway.app
```

## 🎯 Final URLs:

Once deployed, you'll have:
- **Frontend**: `https://your-frontend.up.railway.app`
- **Backend API**: `https://your-backend.up.railway.app`
- **Database**: Internal Railway connection

Share the frontend URL with anyone to access your application!

## 💰 Cost:

- Railway gives you **$5/month free credit**
- Your setup should cost ~$3-4/month
- Plenty for development and testing

## 🔐 Security Notes:

1. Change JWT_SECRET to something secure
2. Don't commit sensitive data to GitHub
3. Use Railway's environment variables for secrets
4. Enable HTTPS (Railway does this automatically)

## Need Help?

If something doesn't work:
1. Check Railway logs (click on service → "Logs" tab)
2. Check browser console (F12)
3. Verify all environment variables are set
4. Make sure GitHub repo is up to date

Your application is now live and accessible from anywhere! 🎉
