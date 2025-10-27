# 🔐 Google OAuth Setup Guide for OpenBudget.ID

**Purpose:** Configure Google OAuth 2.0 for admin authentication
**Time Required:** 10-15 minutes
**Prerequisites:** Google account

---

## 📋 Overview

OpenBudget.ID uses Google OAuth to authenticate ministry officials for admin access. This guide will walk you through creating OAuth credentials in Google Cloud Console.

**What you'll get:**
- `GOOGLE_CLIENT_ID` - Public identifier for your app
- `GOOGLE_CLIENT_SECRET` - Secret key for authentication

---

## 🚀 Step-by-Step Setup

### Step 1: Access Google Cloud Console

1. **Open Google Cloud Console:**
   ```
   URL: https://console.cloud.google.com/
   ```

2. **Sign in with your Google account**
   - Use the account you want to manage the OAuth app
   - Can be your personal Gmail or organization account

---

### Step 2: Create or Select a Project

#### Option A: Create New Project

1. Click the **project dropdown** (top-left, near "Google Cloud")
2. Click **"NEW PROJECT"** button (top-right)
3. Fill in project details:
   - **Project name:** `OpenBudget-ID` (or your preferred name)
   - **Organization:** Leave as "No organization" (unless you have one)
   - **Location:** Leave default
4. Click **"CREATE"**
5. Wait 30 seconds for project creation
6. Select your new project from the dropdown

#### Option B: Use Existing Project

1. Click the **project dropdown** (top-left)
2. Select an existing project from the list
3. Proceed to Step 3

---

### Step 3: Enable Google+ API (Required for OAuth)

1. **In the search bar** (top), type: `Google+ API`
2. Click on **"Google+ API"** from results
3. Click the blue **"ENABLE"** button
4. Wait for API to enable (~10 seconds)

**Why needed?** Google OAuth requires this API to fetch user profile information (name, email, photo).

---

### Step 4: Configure OAuth Consent Screen

1. **Navigate to OAuth consent screen:**
   - Left sidebar → **APIs & Services** → **OAuth consent screen**
   - OR search "OAuth consent" in top search bar

2. **Select User Type:**
   - ⚪ **Internal** - Only users in your organization (if you have Google Workspace)
   - 🔵 **External** - Anyone with a Google account **(RECOMMENDED for development)**
   - Click **"CREATE"**

3. **Fill OAuth Consent Screen (Page 1):**

   **App information:**
   - **App name:** `OpenBudget.ID`
   - **User support email:** Your email address
   - **App logo:** (Optional) Upload logo if you have one

   **App domain:**
   - **Application home page:** `http://localhost:3000` (for dev)
   - **Application privacy policy link:** (Optional) Skip for dev
   - **Application terms of service link:** (Optional) Skip for dev

   **Authorized domains:**
   - Leave empty for localhost testing
   - For production: Add `openbudget.rectorspace.com`

   **Developer contact information:**
   - **Email addresses:** Your email

   Click **"SAVE AND CONTINUE"**

4. **Scopes (Page 2):**
   - Click **"ADD OR REMOVE SCOPES"**
   - Select these scopes:
     - ✅ `.../auth/userinfo.email` - View your email address
     - ✅ `.../auth/userinfo.profile` - See your personal info
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

5. **Test users (Page 3):**
   - Click **"+ ADD USERS"**
   - Add your email address(es) for testing
   - Add any other ministry officials' emails
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

6. **Summary (Page 4):**
   - Review your settings
   - Click **"BACK TO DASHBOARD"**

---

### Step 5: Create OAuth 2.0 Credentials

1. **Navigate to Credentials:**
   - Left sidebar → **APIs & Services** → **Credentials**
   - OR search "credentials" in top search bar

2. **Create Credentials:**
   - Click **"+ CREATE CREDENTIALS"** (top)
   - Select **"OAuth client ID"**

3. **Select Application Type:**
   - **Application type:** `Web application`

4. **Configure Web Application:**

   **Name:**
   ```
   OpenBudget.ID Web Client
   ```

   **Authorized JavaScript origins:**
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3000`
   - For production, also add: `https://openbudget.rectorspace.com`

   **Authorized redirect URIs:**
   - Click **"+ ADD URI"**
   - Add: `http://localhost:3000/api/auth/callback/google`
   - For production, also add: `https://openbudget.rectorspace.com/api/auth/callback/google`

5. **Create Credentials:**
   - Click **"CREATE"**
   - A popup will appear with your credentials

---

### Step 6: Copy Your Credentials

**IMPORTANT:** This popup shows your credentials. Copy them now!

1. **Your Client ID** (looks like):
   ```
   123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```
   - Click the copy icon
   - Save temporarily in a text file

2. **Your Client Secret** (looks like):
   ```
   GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
   ```
   - Click the copy icon
   - Save temporarily in a text file

3. Click **"OK"** to close the popup

**Note:** You can always retrieve these later from the Credentials page.

---

### Step 7: Update .env.local

1. **Open your .env.local file:**
   ```bash
   # Navigate to frontend directory
   cd /Users/rz/local-dev/openbudget-garuda-spark/frontend

   # Edit .env.local
   nano .env.local
   # OR
   code .env.local
   ```

2. **Add your credentials:**
   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
   GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
   ```

3. **Replace placeholders:**
   - Replace `YOUR_CLIENT_ID_HERE` with the Client ID you copied
   - Replace `YOUR_CLIENT_SECRET_HERE` with the Client Secret you copied

4. **Verify other OAuth variables exist:**
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-here
   ```

   **Generate NEXTAUTH_SECRET if missing:**
   ```bash
   openssl rand -base64 32
   ```
   Copy output and paste as NEXTAUTH_SECRET value

5. **Save the file**

---

### Step 8: Verify Configuration

**Your complete .env.local should include:**

```env
# Solana Program Configuration
NEXT_PUBLIC_SOLANA_PROGRAM_ID=RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=142fb48a-aa24-4083-99c8-249df5400b30
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Database Configuration
DATABASE_URL=postgresql://rz@localhost:5432/openbudget

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz123456  # Your generated secret

# Google OAuth Configuration
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com  # Your actual ID
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoP  # Your actual secret
```

---

### Step 9: Test OAuth Authentication

1. **Restart your dev server:**
   ```bash
   # Stop current server (Ctrl+C if running)
   npm run clean
   npm run dev
   ```

2. **Open your application:**
   ```
   URL: http://localhost:3000
   ```

3. **Test login:**
   - Click **"Ministry Login"** button
   - OR navigate to `http://localhost:3000/admin`

4. **Expected flow:**
   - ✅ Redirects to Google Sign-In page
   - ✅ Shows "Sign in with Google"
   - ✅ Lists your Google accounts
   - ⚠️ May show "This app isn't verified" warning (normal for development)
   - ✅ After clicking account → redirects to `/admin` dashboard
   - ✅ Shows your name and profile picture in header

5. **If you see "This app isn't verified":**
   - This is **normal for development**
   - Click **"Advanced"**
   - Click **"Go to OpenBudget.ID (unsafe)"**
   - This only appears for first-time sign-in

---

## 🐛 Troubleshooting

### Issue: "Redirect URI mismatch" Error

**Cause:** The redirect URI in Google Console doesn't match your app's callback URL.

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Click your OAuth Client ID
3. Under "Authorized redirect URIs", ensure you have:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (Exact match, including `/api/auth/callback/google`)
4. Save and retry in 1 minute

---

### Issue: "Access Blocked: This app's request is invalid"

**Cause:** OAuth consent screen not properly configured.

**Solution:**
1. Go to OAuth consent screen
2. Ensure **User Type** is set to "External" (for testing)
3. Ensure your email is added to **Test users**
4. Ensure at least these scopes are added:
   - `userinfo.email`
   - `userinfo.profile`
5. Save and retry

---

### Issue: "Google+ API has not been used in project"

**Cause:** Google+ API not enabled for this project.

**Solution:**
1. Go to APIs & Services → Library
2. Search "Google+ API"
3. Click it → Click "ENABLE"
4. Wait 30 seconds → Retry login

---

### Issue: "NEXTAUTH_SECRET environment variable is not set"

**Cause:** Missing or invalid NEXTAUTH_SECRET in .env.local.

**Solution:**
1. Generate a new secret:
   ```bash
   openssl rand -base64 32
   ```
2. Add to .env.local:
   ```env
   NEXTAUTH_SECRET=<paste-generated-secret-here>
   ```
3. Restart dev server

---

### Issue: Login works but user info not showing

**Cause:** Session not configured correctly or database connection issue.

**Solution:**
1. Check database is running:
   ```bash
   psql -d openbudget -c "SELECT * FROM ministry_accounts LIMIT 1;"
   ```
2. Check NextAuth session configuration in `lib/auth.ts`
3. Clear browser cookies for localhost
4. Try login again

---

## 🔒 Security Best Practices

### Development (Localhost)

✅ **Safe:**
- Using "External" user type with test users
- HTTP for localhost (http://localhost:3000)
- Sharing Client ID (public identifier)

❌ **DO NOT:**
- Commit .env.local to Git (already in .gitignore)
- Share Client Secret publicly
- Use production credentials for development

### Production (Deployment)

**When deploying to openbudget.rectorspace.com:**

1. **Update Authorized JavaScript origins:**
   - Add: `https://openbudget.rectorspace.com`

2. **Update Authorized redirect URIs:**
   - Add: `https://openbudget.rectorspace.com/api/auth/callback/google`

3. **Update .env.local (or .env.production):**
   ```env
   NEXTAUTH_URL=https://openbudget.rectorspace.com
   ```

4. **Consider publishing OAuth consent screen:**
   - Go to OAuth consent screen → "PUBLISH APP"
   - Submit for verification (optional but recommended)
   - Removes "unverified app" warning for users

---

## 📞 Need Help?

**Google Cloud Console:** https://console.cloud.google.com/
**Google OAuth Documentation:** https://developers.google.com/identity/protocols/oauth2
**NextAuth Documentation:** https://next-auth.js.org/providers/google

**Common Quick Fixes:**
- Clear browser cache and cookies
- Restart dev server after .env.local changes
- Wait 1-2 minutes after updating Google Console settings
- Check browser console (F12) for detailed error messages

---

## ✅ Verification Checklist

Before moving to testing, verify:

- [ ] Google Cloud project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] Test user(s) added
- [ ] OAuth Client ID created
- [ ] Client ID copied to .env.local
- [ ] Client Secret copied to .env.local
- [ ] NEXTAUTH_SECRET generated and added
- [ ] NEXTAUTH_URL set to http://localhost:3000
- [ ] Authorized redirect URI includes `/api/auth/callback/google`
- [ ] Dev server restarted
- [ ] Login tested and working

**Alhamdulillah! You're ready to test admin authentication! 🎉**
