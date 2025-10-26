# Google OAuth Setup Guide

## Overview
This guide explains how to set up Google OAuth credentials for the OpenBudget.ID admin dashboard authentication.

## Prerequisites
- Google Account
- Access to Google Cloud Console

## Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" dropdown → "New Project"
3. Project name: `OpenBudget.ID` (or your preferred name)
4. Click "Create"

### 2. Enable Google+ API

1. In the left sidebar, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. User Type: Select **External** → Click "Create"
3. Fill in the required information:
   - App name: `OpenBudget.ID Admin`
   - User support email: Your email
   - Developer contact email: Your email
4. Click "Save and Continue"
5. Scopes: Click "Add or Remove Scopes"
   - Add: `.../auth/userinfo.email`
   - Add: `.../auth/userinfo.profile`
6. Click "Save and Continue"
7. Test users: Add your email address (for development)
8. Click "Save and Continue" → "Back to Dashboard"

### 4. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `OpenBudget.ID Admin Web Client`
5. Authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://openbudget.rectorspace.com` (for production)
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://openbudget.rectorspace.com/api/auth/callback/google` (production)
7. Click "Create"

### 5. Copy Credentials

After creating, you'll see a modal with:
- **Client ID**: Copy this value
- **Client Secret**: Copy this value

### 6. Update Environment Variables

Edit `/frontend/.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

**IMPORTANT:** Never commit these credentials to Git! They are already in `.gitignore`.

### 7. Verify Setup

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000/auth/signin`
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After granting permissions, you'll be redirected back to the admin dashboard

## Troubleshooting

### Error: redirect_uri_mismatch
- **Cause:** The redirect URI in Google Console doesn't match the one NextAuth is using
- **Fix:** Make sure the redirect URI in Google Console is exactly:
  - `http://localhost:3000/api/auth/callback/google` (with no trailing slash)

### Error: Access blocked
- **Cause:** App is in testing mode and user is not added as test user
- **Fix:** Add your email to test users in OAuth consent screen

### Error: Invalid client_id or client_secret
- **Cause:** Credentials not copied correctly or environment variables not loaded
- **Fix:**
  - Verify credentials in Google Console
  - Restart dev server after updating `.env.local`
  - Check for extra spaces or newlines in credentials

## Production Deployment

For production (`openbudget.rectorspace.com`):

1. Update `.env.local` on production server with same credentials
2. OR create separate OAuth client for production (recommended)
3. Ensure redirect URI includes production domain
4. Consider moving app from "Testing" to "In Production" in OAuth consent screen

## Security Best Practices

1. **Never commit credentials**: Always keep `.env.local` in `.gitignore`
2. **Rotate secrets**: If credentials are exposed, immediately create new ones
3. **Separate environments**: Use different OAuth clients for dev/staging/prod
4. **Restrict domains**: Only add necessary authorized origins and redirect URIs
5. **Monitor usage**: Regularly check OAuth usage in Google Cloud Console

## Testing with Placeholder Credentials

For initial development without Google OAuth:
- The current placeholder credentials in `.env.local` won't work for actual sign-in
- You can mock authentication for testing by modifying `lib/auth.ts` (not recommended for production)
- Replace placeholders with real credentials as soon as possible

## Reference

- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
