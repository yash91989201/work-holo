# Push Notifications Setup Guide

This guide will help you set up Web Push Notifications for Work Holo.

## Prerequisites

- Node.js/Bun installed
- The `web-push` package is already installed in `packages/api`

## Step 1: Generate VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for Web Push. These keys identify your application to push services.

### Option A: Using the installed web-push package

```bash
cd packages/api
npx web-push generate-vapid-keys
```

### Option B: Using the global web-push package

```bash
npm install -g web-push
web-push generate-vapid-keys
```

### Expected Output

You should see output like this:

```
=======================================

Public Key:
BNxXYZ123abc...long-string-here...

Private Key:
abc123XYZ...another-long-string...

=======================================
```

## Step 2: Add Keys to Environment Variables

Copy the generated keys and add them to your environment files.

### For Development

Add to `packages/api/.env`:

```bash
# Web Push Notifications
VAPID_PUBLIC_KEY="BNxXYZ123abc...your-public-key..."
VAPID_PRIVATE_KEY="abc123XYZ...your-private-key..."
VAPID_SUBJECT="mailto:your-email@example.com"
```

Add to `apps/server/.env`:

```bash
# Web Push Notifications
VAPID_PUBLIC_KEY="BNxXYZ123abc...your-public-key..."
VAPID_PRIVATE_KEY="abc123XYZ...your-private-key..."
VAPID_SUBJECT="mailto:your-email@example.com"
```

### For Production

Add these environment variables to your production environment:

- `VAPID_PUBLIC_KEY` - The public key from step 1
- `VAPID_PRIVATE_KEY` - The private key from step 1
- `VAPID_SUBJECT` - Either:
  - A mailto: link (e.g., `mailto:admin@work-holo.com`)
  - An HTTPS URL (e.g., `https://work-holo.com`)

## Step 3: Run Database Migration

The `pushSubscription` table needs to be created in your database:

```bash
cd apps/server
bun run db:push
```

This will create the necessary table for storing push subscriptions.

## Step 4: Build and Test

### Build for Production

```bash
# From project root
bun run build
```

### Test in Production Mode

```bash
bun run preview
```

### Test Push Notifications

1. Open the app in your browser (must be HTTPS or localhost)
2. Navigate to Settings → Notifications
3. Grant notification permissions when prompted
4. Enable "Push Notifications" toggle
5. Click "Send Test Notification"
6. You should receive a test notification!

## Step 5: Verify Setup

### Check Service Worker Registration

1. Open browser DevTools
2. Go to Application → Service Workers
3. You should see `/sw.js` registered

### Check Push Subscription

1. Open browser DevTools
2. Go to Application → Service Workers → Your service worker
3. Look for "Push" section
4. You should see a subscription endpoint

### Check Database

Run this query to verify subscriptions are being saved:

```sql
SELECT * FROM "pushSubscription";
```

## Important Notes

### Browser Support

Push notifications work in:

- ✅ Chrome/Edge (desktop & Android)
- ✅ Firefox (desktop & Android)
- ✅ Safari 16+ (desktop & iOS 16.4+)
- ❌ Safari < 16 (not supported)

### HTTPS Requirement

Push notifications **only work**:

- On HTTPS sites (in production)
- On localhost (for development)
- NOT on HTTP sites

### Service Worker Scope

The service worker is registered at the root scope (`/`), which means it can handle notifications for the entire app.

## Troubleshooting

### Issue: "Service worker not registered"

**Solution**: Make sure you're running in production mode (`bun run build && bun run preview`). Service workers don't register in development mode.

### Issue: "Notification permission denied"

**Solution**:

1. Click the lock icon in the browser address bar
2. Find "Notifications" in permissions
3. Change from "Block" to "Allow"
4. Reload the page

### Issue: "VAPID keys not found"

**Solution**: Make sure you've added the VAPID keys to both:

- `packages/api/.env`
- `apps/server/.env`

And restart your server after adding them.

### Issue: "Push notifications not received"

**Solution**:

1. Check browser console for errors
2. Verify service worker is active
3. Check that subscription was saved (query database)
4. Try the "Send Test Notification" button
5. Make sure notifications aren't muted in OS settings

## Security Best Practices

1. **Never commit VAPID keys** to version control
   - Add `.env` files to `.gitignore` (already done)
   - Use different keys for development and production

2. **Rotate keys periodically**
   - Generate new VAPID keys every 6-12 months
   - Update environment variables
   - Existing subscriptions will need to resubscribe

3. **Store keys securely**
   - Use environment variables (not hardcoded)
   - Use secrets management in production (e.g., AWS Secrets Manager, Vault)

## How It Works

1. **User visits app** → Service worker registers automatically
2. **User grants permission** → App requests push subscription from browser
3. **Browser creates subscription** → Contains endpoint and encryption keys
4. **App saves subscription** → Stored in database with userId
5. **User gets mentioned** → Backend sends push notification to all user's devices
6. **Browser receives push** → Service worker displays notification
7. **User clicks notification** → App opens and navigates to relevant channel

## Additional Resources

- [Web Push API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [VAPID Specification](https://tools.ietf.org/html/rfc8292)
- [web-push Library](https://github.com/web-push-libs/web-push)
