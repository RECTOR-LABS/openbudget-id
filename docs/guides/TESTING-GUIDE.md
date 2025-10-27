# 🧪 OpenBudget.ID - Manual Testing Guide

**Date:** October 27, 2025
**Environment:** Development (localhost:3000)
**Status:** ✅ All prerequisites verified

---

## ✅ Prerequisites Verified

- ✅ Dev server running: http://localhost:3000
- ✅ PostgreSQL connected: 1 project in database
- ✅ Environment variables configured (.env.local)
- ✅ TypeScript/ESLint: 0 errors, 0 warnings

---

## 📋 Test Plan Overview

**Epic Coverage:**
- ✅ Epic 1: Solana program (tested via API)
- ✅ Epic 2: Database & API (tested via endpoints)
- ✅ Epic 3: Admin Dashboard (manual testing required)
- ✅ Epic 4: Public Dashboard (manual testing required)

**Test Duration:** ~15-20 minutes

---

## 🔍 Test 1: Public Homepage (Epic 4)

**Objective:** Verify public-facing citizen interface

### Steps:

1. **Open Homepage**
   ```
   URL: http://localhost:3000
   ```

2. **Expected Results:**
   - ✅ Header displays "OpenBudget.ID"
   - ✅ Indonesian text: "Transparansi Anggaran Pemerintah dengan Blockchain"
   - ✅ "Ministry Login" button in top-right corner
   - ✅ Search bar: "Cari proyek atau kementerian..."
   - ✅ Ministry filter dropdown with 5 ministries
   - ✅ Shows "1 proyek ditemukan" (1 project found)
   - ✅ One project card visible: "Program Vaksinasi Nasional 2025"

3. **Test Search**
   - Type "vaksin" in search bar
   - Press Enter or wait for auto-search
   - **Expected:** Project card remains visible
   - Clear search
   - Type "pendidikan"
   - **Expected:** "Tidak ada proyek ditemukan" (No projects found)

4. **Test Ministry Filter**
   - Select "Kementerian Kesehatan"
   - **Expected:** Project card remains visible (matches ministry)
   - Select "Kementerian Pendidikan"
   - **Expected:** No projects shown
   - Reset to "Semua Kementerian"

5. **Project Card Inspection**
   - **Expected fields visible:**
     - Title: "Program Vaksinasi Nasional 2025"
     - Ministry: "Kementerian Kesehatan"
     - Total Budget: Rp 5.00B
     - Released: Rp 2.00B
     - Progress bar showing ~40%
     - Green "Dipublikasikan" badge
     - "Lihat Detail" button

---

## 📄 Test 2: Project Detail Page (Epic 4)

**Objective:** Verify public project detail view with blockchain verification

### Steps:

1. **Navigate to Detail**
   - Click "Lihat Detail" on the project card
   ```
   URL: http://localhost:3000/projects/887b892c-196d-4195-bd54-0fbd633f41f3
   ```
   (UUID may differ - use your actual project ID)

2. **Expected Results - Header:**
   - ✅ "Kembali ke Beranda" back button (top-left)
   - ✅ Project title: "Program Vaksinasi Nasional 2025"
   - ✅ Ministry icon + name: "Kementerian Kesehatan"
   - ✅ Green "Dipublikasikan" status badge
   - ✅ Description visible

3. **Expected Results - Budget Summary:**
   - ✅ "Ringkasan Anggaran" section
   - ✅ Total Anggaran: Rp 5.00B (blue card)
   - ✅ Telah Direalisasikan: Rp 2.00B (green card)
   - ✅ Progress: 40.0% (gray card)
   - ✅ Progress bar showing 40% filled (green)

4. **Expected Results - Blockchain Verification:**
   - ✅ Blue gradient box: "Terverifikasi di Blockchain"
   - ✅ Text: "Proyek ini tercatat secara permanen di Solana blockchain"
   - ✅ Button: "Verifikasi di Solana Explorer"
   - ✅ Click button → Opens Solana Explorer in new tab
   - ✅ URL includes `?cluster=devnet`

5. **Expected Results - Milestones:**
   - ✅ "Milestone Realisasi" section
   - ✅ 2 milestones visible (Milestone #0 and #1)

   **Milestone #0:**
   - ✅ Title: "Procurement of vaccines from international suppliers"
   - ✅ Amount: Rp 1500.0M
   - ✅ Green badge: "Direalisasikan"
   - ✅ Released date shown
   - ✅ "Verifikasi Transaksi" link (opens Solana Explorer)

   **Milestone #1:**
   - ✅ Title: "Distribution to regional health centers"
   - ✅ Amount: Rp 500.0M
   - ✅ Green badge: "Direalisasikan"
   - ✅ Released date shown
   - ✅ "Verifikasi Transaksi" link

6. **Test Navigation:**
   - Click "Kembali ke Beranda"
   - **Expected:** Returns to homepage

---

## 🔐 Test 3: Admin Login (Epic 3)

**Objective:** Verify Google OAuth authentication

### Steps:

1. **Access Admin Login**
   ```
   URL: http://localhost:3000/admin
   ```
   OR click "Ministry Login" button on homepage

2. **Expected Results:**
   - ✅ Redirects to Google Sign-In page
   - ✅ Shows your Google accounts
   - ⚠️ **Warning:** May show "This app isn't verified" (normal for dev)
   - Click "Advanced" → "Go to OpenBudget.ID (unsafe)" if needed

3. **Sign In**
   - Select your Google account
   - Grant permissions (email, profile)
   - **Expected:** Redirects to `/admin` dashboard

4. **Verify Session**
   - Check top-right corner:
     - ✅ Your Google profile picture visible
     - ✅ Your name displayed
     - ✅ Ministry name (or "Unassigned" for new users)
     - ✅ Sign out button (exit icon)

5. **Database Verification** (Optional)
   ```bash
   psql -d openbudget -c "SELECT email, name, ministry_name FROM ministry_accounts WHERE email = 'your-email@gmail.com';"
   ```
   **Expected:** Your account record exists

---

## 💼 Test 4: Admin Dashboard (Epic 3)

**Objective:** Verify admin interface and navigation

### Steps:

1. **Dashboard Overview**
   ```
   URL: http://localhost:3000/admin
   ```

2. **Expected Results:**
   - ✅ Sidebar visible (left side, blue background)
     - Logo: "OpenBudget.ID"
     - Navigation items:
       - 📊 Dashboard (highlighted)
       - 📁 Projects
       - ➕ New Project
   - ✅ Wallet status in sidebar:
     - "No Wallet Connected" OR wallet address if connected
   - ✅ Main content area:
     - Welcome message with your name
     - Ministry name
     - Quick stats or action cards

3. **Test Navigation:**
   - Click "📁 Projects" in sidebar
   - **Expected:** Navigate to `/admin/projects`

---

## 📁 Test 5: Projects List (Epic 3)

**Objective:** Verify project management interface

### Steps:

1. **Access Projects List**
   ```
   URL: http://localhost:3000/admin/projects
   ```

2. **Expected Results:**
   - ✅ Header: "Budget Projects"
   - ✅ Subtitle: "Manage your transparency projects"
   - ✅ Blue "New Project" button (top-right)
   - ✅ Filter section:
     - "Status:" label
     - Three buttons: All, Draft, Published
     - "All" selected by default
   - ✅ Project card visible: "Program Vaksinasi Nasional 2025"

3. **Project Card Details:**
   - ✅ Title with green "published" badge
   - ✅ Description
   - ✅ Recipient: "Kementerian Kesehatan"
   - ✅ Created date
   - ✅ Total budget: Rp 5.00B
   - ✅ Allocated: Rp 3.50B
   - ✅ Released: Rp 2.00B
   - ✅ On-chain verification section (blue box at bottom)
   - ✅ Solana account address (truncated)
   - ✅ Link to Solana Explorer

4. **Test Filters:**
   - Click "Published" → Project remains visible
   - Click "Draft" → "No draft projects found"
   - Click "All" → Project visible again

5. **Navigation:**
   - Click the project card
   - **Expected:** Navigate to project detail page

---

## 🎯 Test 6: Wallet Connection (Epic 3 - Critical)

**Objective:** Connect Solana wallet for blockchain transactions

### Prerequisites:
- ✅ Phantom OR Solflare wallet extension installed
- ✅ Wallet set to **Devnet** network
- ✅ Some devnet SOL in wallet (get from https://faucet.solana.com/)

### Steps:

1. **Check Wallet Extension:**
   - Open browser extensions
   - Confirm Phantom or Solflare is installed
   - Open wallet → Settings → Change Network → **Devnet**
   - Verify you have at least 0.1 SOL on devnet

2. **Connect from Admin Dashboard:**
   ```
   URL: http://localhost:3000/admin
   ```
   - Look for wallet button in:
     - **Sidebar** (bottom section), OR
     - **Header** (top-right, near profile)

3. **Click Wallet Button:**
   - **Expected:** Wallet popup appears
   - Shows "Select Wallet" options:
     - Phantom
     - Solflare
     - Other wallets

4. **Select Your Wallet:**
   - Click Phantom or Solflare
   - **Expected:** Browser extension opens
   - Shows connection request
   - Shows your wallet address
   - Shows "OpenBudget.ID wants to connect"

5. **Approve Connection:**
   - Click "Connect" or "Approve"
   - **Expected:**
     - Popup closes
     - Wallet button changes from "Select Wallet" to wallet address
     - Shows truncated address (e.g., "abc...xyz")
     - Green/blue indicator (connected status)
     - Your SOL balance may be visible

6. **Verify Connection:**
   - Check sidebar/header:
     - ✅ Wallet address visible
     - ✅ Balance shown (if applicable)
     - ✅ Disconnect button available

7. **Test Persistence:**
   - Refresh page (F5)
   - **Expected:** Wallet remains connected (auto-reconnect)

8. **Test Disconnect:**
   - Click disconnect button
   - **Expected:** Returns to "Select Wallet" state

---

## ➕ Test 7: Create New Project (Epic 3)

**Objective:** Create draft project in database

### Steps:

1. **Access New Project Form:**
   ```
   URL: http://localhost:3000/admin/projects/new
   ```
   OR click "New Project" button

2. **Fill Form:**
   - **Title:** "Test Project - [Your Name]"
   - **Description:** "This is a test project for manual verification"
   - **Recipient Name:** "Test Ministry"
   - **Recipient Type:** Select "Government Ministry"
   - **Total Budget:** Enter "1000" (will be 1 Billion rupiah = 1,000,000,000 lamports)

3. **Expected UI:**
   - ✅ All fields have labels
   - ✅ Budget field shows "in Billions (IDR)"
   - ✅ Blue info box at bottom: "You'll need to connect your wallet..."
   - ✅ Green "Create Project" button

4. **Submit Form:**
   - Click "Create Project"
   - **Expected:**
     - Loading state (button disabled, spinner)
     - Success message/alert
     - Redirect to `/admin/projects`

5. **Verify in Projects List:**
   - **Expected:** New project visible with:
     - Yellow "draft" badge
     - Your entered details
     - No blockchain info (not published yet)

6. **Database Verification** (Optional):
   ```bash
   psql -d openbudget -c "SELECT title, status, total_amount FROM projects ORDER BY created_at DESC LIMIT 1;"
   ```
   **Expected:** Your test project with status='draft', total_amount='1000000000000'

---

## 🚀 Test 8: Publish Project to Blockchain (Epic 3 - Critical)

**Objective:** Deploy project to Solana devnet

### Prerequisites:
- ✅ Wallet connected (from Test 6)
- ✅ Devnet SOL in wallet (≥0.1 SOL)
- ✅ Draft project created (from Test 7)

### Steps:

1. **Navigate to Your Draft Project:**
   - Go to `/admin/projects`
   - Click your draft project card
   - **Expected:** Project detail page opens

2. **Expected UI:**
   - ✅ Yellow "draft" badge
   - ✅ Green "Publish to Blockchain" button (top-right)
   - ✅ Lightning bolt icon on button
   - ✅ No blockchain verification section yet

3. **Click "Publish to Blockchain":**
   - Button should be enabled (wallet connected)
   - **Expected:** Wallet popup appears immediately

4. **Wallet Transaction Approval:**
   - **Phantom/Solflare shows:**
     - Transaction type: "Unknown" or "Program Interaction"
     - From: Your wallet address
     - To: Program ID (RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY)
     - Network: Devnet
     - Estimated fee: ~0.00001-0.0001 SOL

5. **Approve Transaction:**
   - Click "Approve" or "Confirm"
   - **Expected:**
     - Wallet popup closes
     - Button shows loading state: "Publishing..."
     - Spinner visible

6. **Wait for Confirmation:**
   - Takes 5-15 seconds
   - **Expected:**
     - Alert: "Project published to blockchain successfully!"
     - Page refreshes automatically
     - Badge changes from yellow "draft" to green "published"

7. **Verify Blockchain Integration:**
   - **Expected sections visible:**
     - ✅ Blue "Terverifikasi di Blockchain" box
     - ✅ Solana account address (truncated)
     - ✅ "View on Solana Explorer" link

8. **Click Solana Explorer Link:**
   - Opens in new tab
   - **Expected URL:** https://explorer.solana.com/address/[PROJECT_PDA]?cluster=devnet
   - **Expected content:**
     - Account exists
     - Shows transaction history
     - Shows creation transaction
     - Program: Your program ID
     - Recent activity visible

9. **Database Verification** (Optional):
   ```bash
   psql -d openbudget -c "SELECT title, status, blockchain_id, solana_account, creation_tx FROM projects WHERE title LIKE 'Test Project%';"
   ```
   **Expected:**
   - status = 'published'
   - blockchain_id populated (e.g., "PROJ-20251027-ABC123")
   - solana_account populated (44-char base58 address)
   - creation_tx populated (88-char transaction signature)

---

## 📝 Test 9: Add Milestone (Epic 3 - Advanced)

**Objective:** Create milestone and deploy to blockchain

### Prerequisites:
- ✅ Wallet connected
- ✅ Published project (from Test 8)
- ✅ Devnet SOL in wallet

### Steps:

1. **Navigate to Published Project:**
   - `/admin/projects/[your-project-id]`
   - Ensure status is "published" (green badge)

2. **Find "Add Milestone" Section:**
   - Scroll down below project details
   - **Expected:** Gray form section with fields:
     - Index (number)
     - Description (text)
     - Amount (in Billions IDR)

3. **Fill Milestone Form:**
   - **Index:** 0 (first milestone)
   - **Description:** "Initial procurement phase"
   - **Amount:** 0.3 (300 million rupiah)
   - **Note:** Amount must be ≤ remaining budget

4. **Submit Milestone:**
   - Click "Add Milestone" button
   - **Expected:** Wallet transaction popup appears

5. **Approve Transaction:**
   - Similar to project publishing
   - Fee: ~0.00001 SOL
   - Click "Approve"
   - **Expected:**
     - Loading state: "Adding..."
     - 5-15 seconds wait
     - Success alert
     - Milestone appears in list

6. **Verify Milestone Card:**
   - **Expected display:**
     - ✅ "Milestone #0" label
     - ✅ Description shown
     - ✅ Amount: Rp 300.0M
     - ✅ Yellow "Pending" badge (not released yet)
     - ✅ "Release Funds" button visible

7. **Try Budget Constraint:**
   - Add another milestone with amount > remaining budget
   - **Expected:** Error message: "Amount exceeds remaining budget..."

---

## 💸 Test 10: Release Milestone Funds (Epic 3 - Final)

**Objective:** Execute funds release to blockchain

### Prerequisites:
- ✅ Wallet connected
- ✅ Milestone created (from Test 9)
- ✅ Devnet SOL in wallet

### Steps:

1. **Locate Milestone:**
   - On project detail page
   - Find milestone with yellow "Pending" badge

2. **Click "Release Funds":**
   - **Expected:** Proof URL input form appears
   - Shows text input: "Proof Document URL"
   - Shows "Confirm Release" button

3. **Enter Proof URL:**
   - Example: "https://example.com/proof.pdf"
   - Any valid URL format
   - **Required field**

4. **Click "Confirm Release":**
   - **Expected:** Wallet transaction popup appears

5. **Approve Transaction:**
   - Transaction type: Release funds instruction
   - Fee: ~0.00001 SOL
   - Click "Approve"
   - **Expected:**
     - Loading state: "Releasing..."
     - 5-15 seconds wait
     - Alert: "Funds released successfully!"

6. **Verify Release:**
   - **Expected changes:**
     - ✅ Badge changes: Yellow "Pending" → Green "Direalisasikan"
     - ✅ Released date shown
     - ✅ "Release Funds" button disappears
     - ✅ "Verifikasi Transaksi" link appears
     - ✅ "Lihat Dokumen Bukti" link appears

7. **Click Verification Links:**
   - **"Verifikasi Transaksi":**
     - Opens Solana Explorer
     - Shows release transaction
     - Confirms on-chain execution

   - **"Lihat Dokumen Bukti":**
     - Opens your proof URL
     - Confirms document link works

8. **Check Budget Update:**
   - Scroll to top of page
   - **Expected:** "Telah Direalisasikan" increased by milestone amount
   - Progress bar updated

---

## 🔍 Test 11: Public Verification (Epic 4)

**Objective:** Verify published data visible to citizens

### Steps:

1. **Sign Out from Admin:**
   - Click sign out button (top-right)
   - OR open incognito/private window

2. **Visit Homepage:**
   ```
   URL: http://localhost:3000
   ```

3. **Find Your Test Project:**
   - Should appear in project list
   - Shows published data
   - Green "published" badge

4. **View Project Detail:**
   - Click "Lihat Detail"
   - **Expected:** All information visible:
     - Budget summary
     - Blockchain verification
     - Milestones with status
     - Verification links work

5. **Test Blockchain Verification:**
   - Click Solana Explorer links
   - Confirm all transactions visible on-chain
   - Verify data matches what's shown on site

---

## 📊 Test Results Template

Copy and fill this checklist as you test:

```
### ✅ Test Results - [Your Name]
**Date:** October 27, 2025
**Browser:** [Chrome/Firefox/Safari]
**Wallet:** [Phantom/Solflare]

[ ] Test 1: Public Homepage - PASS/FAIL
    Notes: ___

[ ] Test 2: Project Detail Page - PASS/FAIL
    Notes: ___

[ ] Test 3: Admin Login - PASS/FAIL
    Email used: ___
    Notes: ___

[ ] Test 4: Admin Dashboard - PASS/FAIL
    Notes: ___

[ ] Test 5: Projects List - PASS/FAIL
    Notes: ___

[ ] Test 6: Wallet Connection - PASS/FAIL
    Wallet address: ___
    Notes: ___

[ ] Test 7: Create New Project - PASS/FAIL
    Project title: ___
    Notes: ___

[ ] Test 8: Publish to Blockchain - PASS/FAIL
    Transaction signature: ___
    Solana account: ___
    Notes: ___

[ ] Test 9: Add Milestone - PASS/FAIL
    Milestone description: ___
    Notes: ___

[ ] Test 10: Release Funds - PASS/FAIL
    Release transaction: ___
    Notes: ___

[ ] Test 11: Public Verification - PASS/FAIL
    Notes: ___

### Issues Found:
1. ___
2. ___

### Overall Status: PASS / FAIL / NEEDS FIXES
```

---

## 🐛 Common Issues & Solutions

### Issue: Wallet Won't Connect
**Solutions:**
- Ensure wallet extension is unlocked
- Check network is set to Devnet (not Mainnet)
- Try refreshing page
- Clear browser cache
- Try different browser

### Issue: "Insufficient Funds" Error
**Solution:**
- Visit https://faucet.solana.com/
- Enter your devnet wallet address
- Request 1-2 SOL
- Wait 30 seconds
- Retry transaction

### Issue: Transaction Fails
**Solutions:**
- Check Solana devnet status: https://status.solana.com/
- Ensure wallet has enough SOL (≥0.1)
- Wait 1 minute and retry
- Check transaction on Solana Explorer for error details

### Issue: Google Login Fails
**Solutions:**
- Clear browser cookies for localhost
- Check .env.local has GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Verify Google OAuth consent screen is configured
- Try different Google account

### Issue: "Project Not Found" After Publishing
**Solution:**
- Wait 10-15 seconds for Solana confirmation
- Refresh page manually
- Check Solana Explorer to confirm transaction succeeded

### Issue: Budget Validation Error
**Solution:**
- Check remaining budget calculation
- Ensure milestone amount ≤ (total_budget - total_allocated)
- Verify amounts in billions, not millions

---

## 📞 Need Help?

**Check Server Logs:**
```bash
tail -f /tmp/nextjs-dev.log
```

**Check Database:**
```bash
psql -d openbudget -c "\dt"  # List tables
psql -d openbudget -c "SELECT * FROM projects;"  # View projects
```

**Restart Dev Server:**
```bash
npm run clean && npm run dev
```

**Devnet SOL Faucet:**
https://faucet.solana.com/

**Solana Explorer:**
https://explorer.solana.com/?cluster=devnet

---

## ✅ Success Criteria

**All tests pass when:**
- ✅ Can view projects as public citizen
- ✅ Can verify blockchain data on Solana Explorer
- ✅ Can login with Google OAuth
- ✅ Can connect Solana wallet
- ✅ Can create and publish projects
- ✅ Can add milestones with budget validation
- ✅ Can release funds with proof
- ✅ All data syncs between DB ↔ Blockchain ↔ UI

**Alhamdulillah! May your testing be successful! 🎯**
