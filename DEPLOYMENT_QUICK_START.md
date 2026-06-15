# Quick Start: Deploy to Cloudflare Pages

## What's Done
✓ Project built successfully
✓ dist/ folder created with optimized assets
✓ All code committed to git

## Next Steps (In Order)

### 1. Create GitHub Repository (2 minutes)
Go to https://github.com/new and create a public repo called `candles-by-tj`

### 2. Push to GitHub (1 minute)
```powershell
cd C:\Users\Tjuan\OneDrive\Documents\Claude Workspace\candles-by-tj
git remote add origin https://github.com/YOUR_USERNAME/candles-by-tj.git
git branch -M main
git push -u origin main
```

### 3. Connect to Cloudflare Pages (5 minutes)
1. Go to https://dash.cloudflare.com → Workers & Pages → Pages
2. Click "Create application" → "Connect to Git"
3. Select your candles-by-tj repo
4. Build settings:
   - Build command: `npm run build`
   - Build output: `dist`
5. Click Deploy

### 4. Add Environment Variables (5 minutes)
In Cloudflare Pages Settings → Environment variables (Production):

```
DATABASE_URL=postgresql://...  [from Neon]
STRIPE_SECRET_KEY=sk_live_...  [from Stripe]
STRIPE_WEBHOOK_SECRET=whsec_... [leave empty for now]
PAYPAL_CLIENT_ID=...           [from PayPal]
PAYPAL_CLIENT_SECRET=...       [from PayPal]
ADMIN_PASSWORD=YourSecurePassword
ADMIN_JWT_SECRET=[run: node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"]
```

Also set in Preview environment variables:
```
VITE_PAYPAL_CLIENT_ID=[same as above]
```

### 5. Register Stripe Webhook (5 minutes)
1. Go to https://dashboard.stripe.com → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://candles-by-tj.pages.dev/api/webhooks/stripe` (or your custom domain)
4. Events: `checkout.session.completed`
5. Copy the webhook secret (whsec_...)
6. Back in Cloudflare Pages → Add it as `STRIPE_WEBHOOK_SECRET`
7. Click "Redeploy" on latest deployment

### 6. (Optional) Add Custom Domain
In Cloudflare Pages → Custom domains → Add `candlesbytj.com`

---

## Key Credentials Needed

| What | Where to Find |
|------|---------------|
| Neon Database URL | https://console.neon.tech → Connection strings |
| Stripe Secret Key | https://dashboard.stripe.com/developers → API Keys |
| PayPal Credentials | https://developer.paypal.com/dashboard → Apps & Credentials |

---

## That's It!

Your site will be live at:
- `https://candles-by-tj.pages.dev` (auto URL)
- `https://candlesbytj.com` (custom domain, if set up)

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
