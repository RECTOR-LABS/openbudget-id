# EXECUTION PLAN: Epic 3 - Admin Ministry Dashboard

**Epic ID:** EPIC-03
**Last Updated:** 2025-10-26
**Overall Status:** 🔴 Not Started (Blocked by EPIC-02)
**Completion:** 0% (0/10 tasks completed)

---

## Epic Progress Dashboard

| Story | Status | Progress | Tasks Completed | Estimated | Actual | Blocker |
|-------|--------|----------|-----------------|-----------|--------|---------|
| 3.1: Setup NextAuth | 🔴 Not Started | 0% | 0/5 | 2h | - | - |
| 3.2: Wallet Adapter | 🔴 Not Started | 0% | 0/3 | 1.5h | - | - |
| 3.3: Dashboard Layout | 🔴 Not Started | 0% | 0/1 | 1h | - | Needs 3.1, 3.2 |
| 3.4: Create Project Flow | 🔴 Not Started | 0% | 0/2 | 1.5h | - | Needs 3.3 |
| 3.5: Milestone Management | 🔴 Not Started | 0% | 0/1 | 1h (optional) | - | Needs 3.4 |
| **TOTAL** | 🔴 | **0%** | **0/12** | **7h** | **-** | - |

---

## Prerequisites Check

| Prerequisite | Required From | Status | Notes |
|-------------|---------------|--------|-------|
| All API routes functional | EPIC-02 | 🔴 | Need 7 endpoints working |
| Database deployed | EPIC-02 | 🔴 | PostgreSQL with data |
| Solana utilities ready | EPIC-02 | 🔴 | lib/solana.ts |
| Google Cloud Console access | - | ❓ | For OAuth setup |
| Solana wallet installed | - | ❓ | Phantom or Solflare |

---

## Story 3.1: Setup NextAuth

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/5 tasks)
**Target Completion:** Day 2, Hour 7

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 3.1.1 | Configure Google OAuth credentials | 🔴 | RECTOR | 30m | - | None | Google Cloud Console |
| 3.1.2 | Install NextAuth and configure | 🔴 | RECTOR | 30m | - | 3.1.1 | API route setup |
| 3.1.3 | Create session provider | 🔴 | RECTOR | 15m | - | 3.1.2 | Wrap app |
| 3.1.4 | Create login page | 🔴 | RECTOR | 30m | - | 3.1.3 | UI component |
| 3.1.5 | Protect admin routes | 🔴 | RECTOR | 15m | - | 3.1.4 | Middleware |

### Task Details

#### ✅ **Task 3.1.1: Configure Google OAuth**
- **Steps:**
  1. Visit https://console.cloud.google.com
  2. Create project "OpenBudget ID" (if not exists)
  3. Enable APIs: Google+ API
  4. Credentials → Create OAuth 2.0 Client ID → Web application
  5. Authorized redirect: `http://localhost:3000/api/auth/callback/google`
  6. Save Client ID and Secret to `.env.local`

- **Validation Checklist:**
  - [ ] OAuth client created in Google Cloud Console
  - [ ] `.env.local` has GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
  - [ ] NEXTAUTH_SECRET generated: `openssl rand -base64 32`
  - [ ] NEXTAUTH_URL set to http://localhost:3000

---

#### ✅ **Task 3.1.2: Install and configure NextAuth**
- **Commands:**
  ```bash
  cd frontend
  npm install next-auth
  ```
- **File:** `app/api/auth/[...nextauth]/route.ts`
- **Validation Checklist:**
  - [ ] File created with Google provider config
  - [ ] signIn callback stores user in DB
  - [ ] session callback fetches user ID and role
  - [ ] Test: Visit http://localhost:3000/api/auth/signin

---

#### ✅ **Task 3.1.3: Create session provider**
- **Files:** `components/providers/SessionProvider.tsx` + update `app/layout.tsx`
- **Validation:**
  - [ ] SessionProvider wraps children in layout
  - [ ] No build errors: `npm run dev`

---

#### ✅ **Task 3.1.4: Create login page**
- **File:** `app/auth/signin/page.tsx`
- **Validation:**
  - [ ] Visit http://localhost:3000/auth/signin
  - [ ] Click "Sign in with Google" → OAuth flow starts
  - [ ] After auth, redirects to /admin
  - [ ] User created in `users` table (check with psql)

---

#### ✅ **Task 3.1.5: Protect admin routes**
- **File:** `middleware.ts`
- **Validation:**
  - [ ] Visiting /admin without login → redirects to /auth/signin
  - [ ] After login → /admin accessible

---

### Story 3.1 Completion Criteria
- [ ] Full OAuth flow working
- [ ] User sessions persist
- [ ] Admin routes protected

---

## Story 3.2: Wallet Adapter

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/3 tasks)
**Target Completion:** Day 2, Hour 8.5

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 3.2.1 | Install wallet packages | 🔴 | RECTOR | 15m | - | None | npm install |
| 3.2.2 | Create WalletProvider | 🔴 | RECTOR | 45m | - | 3.2.1 | Context setup |
| 3.2.3 | Create WalletButton component | 🔴 | RECTOR | 30m | - | 3.2.2 | UI integration |

### Task Details

#### ✅ **Task 3.2.1: Install packages**
- **Commands:**
  ```bash
  npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/wallet-adapter-base
  ```
- **Validation:**
  - [ ] Packages in package.json
  - [ ] No peer dependency warnings

---

#### ✅ **Task 3.2.2: Create WalletProvider**
- **File:** `components/providers/WalletProvider.tsx`
- **Validation:**
  - [ ] ConnectionProvider uses NEXT_PUBLIC_SOLANA_RPC_URL
  - [ ] Wallets array includes Phantom and Solflare
  - [ ] Wrapped in `app/admin/layout.tsx`

---

#### ✅ **Task 3.2.3: Create WalletButton**
- **File:** `components/WalletButton.tsx`
- **Validation:**
  - [ ] Button renders in admin header
  - [ ] Click opens wallet selection modal
  - [ ] Connects to Phantom/Solflare successfully
  - [ ] Shows wallet address when connected

---

### Story 3.2 Completion Criteria
- [ ] Wallet connection works
- [ ] Wallet address displayed
- [ ] Ready to sign transactions

---

## Story 3.3: Dashboard Layout

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/1 task)
**Target Completion:** Day 3, Hour 1.5

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 3.3.1 | Create admin dashboard page | 🔴 | RECTOR | 60m | - | 3.1, 3.2 | Main UI |

### Task Details

#### ✅ **Task 3.3.1: Create dashboard**
- **File:** `app/admin/page.tsx`
- **Validation:**
  - [ ] Header shows user name/email
  - [ ] WalletButton in header
  - [ ] Tabs: "Draft Projects" and "Published Projects"
  - [ ] Fetches projects from API on load
  - [ ] Displays project count in tabs
  - [ ] Responsive layout (test on mobile)

---

### Story 3.3 Completion Criteria
- [ ] Dashboard loads with user session
- [ ] Projects fetched and displayed
- [ ] Navigation works

---

## Story 3.4: Create Project Flow

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/2 tasks)
**Target Completion:** Day 3, Hour 3

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 3.4.1 | Create project form | 🔴 | RECTOR | 45m | - | 3.3.1 | Form component |
| 3.4.2 | Implement publish-to-blockchain | 🔴 | RECTOR | 45m | - | 3.4.1, 3.2.3 | Wallet signing |

### Task Details

#### ✅ **Task 3.4.1: Create project form**
- **File:** `components/CreateProjectForm.tsx`
- **Validation:**
  - [ ] Form has title, ministry, budget fields
  - [ ] Client validation (required, budget > 0)
  - [ ] Submit calls POST /api/projects
  - [ ] Success → refreshes dashboard
  - [ ] Error handling with toast/alert

---

#### ✅ **Task 3.4.2: Publish button**
- **File:** `components/PublishProjectButton.tsx`
- **Validation:**
  - [ ] Button disabled if wallet not connected
  - [ ] Click triggers Anchor instruction `initialize_project`
  - [ ] Wallet prompts for signature
  - [ ] After tx confirmed → calls POST /api/projects/[id]/publish
  - [ ] DB updated with solana_account and creation_tx
  - [ ] Shows Solana Explorer link
  - [ ] Test full flow: draft → publish → verify on Explorer

---

### Story 3.4 Completion Criteria
- [ ] End-to-end project creation works
- [ ] Blockchain publish successful
- [ ] DB state consistent

---

## Story 3.5: Milestone Management (Optional)

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/1 task)
**Target Completion:** Day 3, Hour 4 (if time permits)

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 3.5.1 | Add milestone + release UI | 🔴 | RECTOR | 60m | - | 3.4.2 | Combined component |

**Note:** Can defer to Epic 4 if time constrained. Focus on project publishing first.

---

## Critical Path

```
3.1.1 (OAuth) → 3.1.2 → 3.1.3 → 3.1.4 → 3.1.5 (Auth complete)
                                            ↓
                                   3.2.1 (Wallet) → 3.2.2 → 3.2.3
                                                            ↓
                                                       3.3.1 (Dashboard)
                                                            ↓
                                                       3.4.1 (Form) → 3.4.2 (Publish)
```

**Critical Path Time:** 3.1 (2h) + 3.2 (1.5h) + 3.3 (1h) + 3.4 (1.5h) = **6 hours**

---

## Risk Register

| Risk ID | Description | Impact | Probability | Mitigation | Owner |
|---------|-------------|--------|-------------|------------|-------|
| R10 | Google OAuth verification delay | 🟡 Medium | Low | Use localhost first (no verification needed) | RECTOR |
| R11 | Wallet adapter version conflicts | 🟡 Medium | Medium | Pin exact versions in package.json | RECTOR |
| R12 | Transaction signing fails (wallet rejection) | 🟢 Low | High | Add error handling, retry UI | RECTOR |
| R13 | PDA derivation mismatch in frontend | 🔴 High | Low | Test PDAs match backend lib/solana.ts | RECTOR |

---

## Blockers & Issues

| Blocker ID | Description | Story | Severity | Status | Resolution | Date |
|------------|-------------|-------|----------|--------|------------|------|
| B2 | Epic 3 blocked until EPIC-02 completes | All | 🔴 High | Active | Awaiting Epic 2 | 2025-10-26 |

---

## Handoff to Epic 4

**Prerequisites for Epic 4 Start:**
- ✅ Ministry login works (NextAuth)
- ✅ Wallet connection functional
- ✅ Project creation and publishing tested
- ✅ At least 2 sample projects published to devnet

**Deliverables:**
1. **Admin Dashboard:** http://localhost:3000/admin
2. **Test Accounts:** Ministry users in `users` table
3. **Sample Projects:** 2+ projects on blockchain (draft + published)
4. **Transaction Signatures:** Saved in DB for public verification

**Next Epic Owner:** RECTOR (Epic 4: Public Citizen Dashboard)

---

**Last Updated:** 2025-10-26
**Next Review:** After Epic 2 completes
