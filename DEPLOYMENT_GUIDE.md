# Candles By Tj - Deployment Guide

## Overview
This guide covers deploying the Candles By Tj application to Cloudflare Pages and registering webhooks for payment processing.

**Build Status:** ✓ COMPLETE (dist/ folder ready for deployment)

---

## Part 1: Build & Prepare for Deployment

### Step 1: Build the Project
The project has been successfully built:

```powershell
npm run build
```

**Build Output:**
- `dist/index.html` - Main HTML entry point
- `dist/assets/index-*.css` - Minified stylesheet (~13.5 KB gzipped)
- `dist/assets/index-*.js` - Minified JavaScript (~135 KB gzipped)
- `dist/logo.png` - Logo image asset

The build is optimized for production with minified assets and gzip compression.

---

## Part 2: GitHub Repository Setup

### Step 2a: Create GitHub Repository (User Action Required)

1. Go to https://github.com/new
2. Repository name: `candles-by-tj`
3. Description: "Premium handcrafted candles e-commerce platform"
4. Make it **Public** (required for free Cloudflare Pages)
5. Initialize with: **No README, .gitignore, or license** (repo is already initialized locally)
6. Click "Create repository"

### Step 2b: Add Remote and Push to GitHub

Once the repo is created, run these commands in PowerShell from the project directory:

```powershell
cd C:\Users\Tjuan\OneDrive\Documents\Claude Workspace\candles-by-tj

# Add the remote (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/candles-by-tj.git

# Verify the branch is named 'main'
git branch -M main

# Push all commits to GitHub
git push -u origin main
```

**What this does:**
- Connects local git repo to GitHub
- Uploads all commits and branches
- Sets up tracking so future `git push` commands work automatically

---

## Part 3: Connect to Cloudflare Pages

### Step 3: Connect Git to Cloudflare Pages (Dashboard)

**You must do this through the Cloudflare web dashboard (cannot be automated).**

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Pages** (left sidebar)
3. Click **"Create application"**
4. Click **"Connect to Git"**
5. Authorize Cloudflare to access your GitHub account
6. Select the **candles-by-tj** repository
7. Click **"Begin setup"**

### Step 4: Configure Build Settings

In the Cloudflare Pages setup form:

| Field | Value |
|-------|-------|
| **Production branch** | `main` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` |

Leave other fields at their defaults. Click **"Save and Deploy"**.

**What happens next:**
- Cloudflare builds your project using the build command
- The `dist/` folder is deployed as a static site
- Your app is live at `https://candles-by-tj.pages.dev` (auto-generated URL)

---

## Part 4: Set Environment Variables

### Step 5: Add Production Environment Variables (Dashboard)

Once the Pages project is created, configure environment variables:

1. Go to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Pages** → **candles-by-tj**
3. Click **Settings** → **Environment variables**
4. Click **"Edit variables"** under **Production**

Add these variables (values in brackets need to be filled in by you):

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | `[Neon connection string]` | See "Getting Database URL" section below |
| `STRIPE_SECRET_KEY` | `[Stripe secret key]` | From stripe.com/dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | `[Will add after registering webhook]` | See "Part 5" below |
| `PAYPAL_CLIENT_ID` | `[PayPal Client ID]` | From developer.paypal.com → Apps & Credentials |
| `PAYPAL_CLIENT_SECRET` | `[PayPal Client Secret]` | From developer.paypal.com → Apps & Credentials |
| `ADMIN_PASSWORD` | `[Choose a secure password]` | For `/admin` login |
| `ADMIN_JWT_SECRET` | `[32-char random string]` | Generate: `node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"` |

Click **Save** after adding all variables.

### Step 6: Add Build Environment Variables (for PayPal)

The frontend build needs the PayPal Client ID:

1. In the same **Environment variables** page
2. Click **"Edit variables"** under **Preview** (above Production)
3. Add this variable:

| Name | Value |
|------|-------|
| `VITE_PAYPAL_CLIENT_ID` | `[Same as PAYPAL_CLIENT_ID above]` |

Click **Save**.

**Why these are needed:**
- `DATABASE_URL` - Connects the backend to your Neon PostgreSQL database
- `STRIPE_SECRET_KEY` - Authenticates Stripe API calls (secret, never expose to client)
- `PAYPAL_CLIENT_ID` - Identifies your app to PayPal (shown in frontend)
- `PAYPAL_CLIENT_SECRET` - Authenticates PayPal API calls (secret)
- `ADMIN_PASSWORD` - Secures the `/admin` login page
- `ADMIN_JWT_SECRET` - Signs JWT tokens for admin sessions

---

## Part 5: Register Stripe Webhook

### Step 7: Get Stripe Webhook Secret (Dashboard)

1. Go to https://dashboard.stripe.com
2. Click **Developers** → **Webhooks** (left sidebar)
3. Click **"Add endpoint"**
4. **Endpoint URL:** `https://candles-by-tj.pages.dev/api/webhooks/stripe`
   - Or if using custom domain: `https://candlesbytj.com/api/webhooks/stripe`
5. **Events to send:** Select only `checkout.session.completed`
6. Click **"Add endpoint"**
7. You'll see the **Signing secret** (starts with `whsec_`)
8. Copy this value

### Step 8: Add Webhook Secret to Cloudflare Pages

1. Go back to https://dash.cloudflare.com
2. Navigate to **Workers & Pages** → **Pages** → **candles-by-tj** → **Settings** → **Environment variables** → **Production**
3. Edit the `STRIPE_WEBHOOK_SECRET` variable
4. Paste the signing secret from Stripe
5. Click **Save**

### Step 9: Trigger Redeployment

After updating the webhook secret, redeploy:

1. Go to **Deployments** tab in your Pages project
2. Click the **"..." menu** on the latest deployment
3. Click **"Redeploy"**

Or trigger a deploy via git:

```powershell
git commit --allow-empty -m "chore: trigger deploy with webhook secret"
git push origin main
```

---

## Part 6: Set Up Custom Domain (Optional)

### Step 10: Configure Custom Domain

To use `candlesbytj.com` instead of the auto-generated URL:

1. In Cloudflare Pages project → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter: `candlesbytj.com`
4. Cloudflare auto-detects that the domain is on your account
5. Click **"Activate domain"**
6. SSL certificate is auto-issued (no extra action needed)

**Update Stripe Webhook URL if using custom domain:**
1. Go back to Stripe → Developers → Webhooks
2. Find your endpoint
3. Edit it to use: `https://candlesbytj.com/api/webhooks/stripe`

---

## Getting Required Values

### Database URL (Neon)

1. Go to https://console.neon.tech (or create account)
2. Select your **candles-by-tj** project
3. Go to **Connection strings** → **Pooled connection**
4. Copy the PostgreSQL connection string (looks like: `postgresql://user:password@host/dbname`)
5. Use this as `DATABASE_URL`

### Stripe API Keys

1. Go to https://dashboard.stripe.com/developers/api-keys
2. Copy the **Secret key** (not publishable key)
3. Use this as `STRIPE_SECRET_KEY`

### PayPal Credentials

1. Go to https://developer.paypal.com/dashboard
2. Log in or create a developer account
3. Go to **Apps & Credentials** → **Sandbox** (for testing)
4. Create or select an app
5. Copy **Client ID** and **Client Secret**
6. Use for `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`

### Generate Admin JWT Secret

Run this in PowerShell or Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

This generates a random 32-character hex string. Use this as `ADMIN_JWT_SECRET`.

---

## Deployment Checklist

- [ ] Project builds successfully (`npm run build`)
- [ ] dist/ folder contains index.html and assets
- [ ] GitHub repository created at https://github.com/YOUR_USERNAME/candles-by-tj
- [ ] Code pushed to GitHub with `git push -u origin main`
- [ ] Cloudflare Pages connected to GitHub repo
- [ ] Build settings configured (command: `npm run build`, output: `dist`)
- [ ] Production environment variables set (DATABASE_URL, Stripe keys, PayPal keys, admin password, JWT secret)
- [ ] Preview environment variable set (VITE_PAYPAL_CLIENT_ID)
- [ ] Stripe webhook registered at `/api/webhooks/stripe`
- [ ] Stripe webhook secret added to Cloudflare Pages
- [ ] Pages redeployed with webhook secret
- [ ] Custom domain configured (optional)

---

## Deployment URLs

After completion:

- **Auto-generated URL:** https://candles-by-tj.pages.dev
- **Custom Domain:** https://candlesbytj.com (if configured)
- **Admin Dashboard:** https://candlesbytj.com/admin (or pages.dev URL)
- **API Base:** https://candlesbytj.com/api (same domain as frontend)

---

## Troubleshooting

### Build fails on Cloudflare Pages

**Check:**
1. Go to **Deployments** → Click failed deployment → **View build logs**
2. Look for errors in the build output
3. Common causes:
   - Missing environment variables (especially `DATABASE_URL`)
   - TypeScript errors (check types: `npm run check`)
   - Missing dependencies (run `npm install` locally and commit lockfile)

### Stripe payments not working

**Check:**
1. Is `STRIPE_SECRET_KEY` set in environment variables?
2. Is the webhook registered and returning `200` responses?
3. Check Stripe dashboard → Developers → Webhooks → View endpoint logs

### PayPal button not showing

**Check:**
1. Is `VITE_PAYPAL_CLIENT_ID` set in Preview environment variables?
2. Did you rebuild/redeploy after adding it?
3. Check browser console for errors (F12 in Chrome)

### Admin login not working

**Check:**
1. Is `ADMIN_PASSWORD` and `ADMIN_JWT_SECRET` set?
2. Are you using the correct password?
3. Clear browser cookies and try again

---

## Rollback / Redeploy

To rollback to a previous version:

1. Go to **Deployments** tab
2. Find the previous version
3. Click **"..." menu** → **"Redeploy"**

To trigger a new deployment without code changes:

```powershell
git commit --allow-empty -m "chore: trigger deploy"
git push origin main
```

---

## Support & Docs

- **Cloudflare Pages:** https://developers.cloudflare.com/pages/
- **Stripe Webhooks:** https://stripe.com/docs/webhooks
- **PayPal Integration:** https://developer.paypal.com/docs/
- **Neon Database:** https://neon.tech/docs

---

**Last Updated:** June 15, 2026
**Build Status:** ✓ Ready for deployment
