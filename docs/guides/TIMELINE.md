# OpenBudget.ID - 4-Day Sprint Timeline

**Start Date:** 2025-10-26
**Submission Deadline:** ~2025-10-31 (4.9 days remaining)
**Strategy:** Aggressive but achievable MVP-first approach

---

## Daily Breakdown

### 📅 DAY 1: Foundation & Solana Program (Oct 26)

**Goal:** Working Solana program deployed to devnet

#### Morning (4 hours)

- [x] Workspace setup & documentation ✓
- [ ] Initialize Anchor project
- [ ] Define program architecture
  - Project account structure
  - Milestone struct
  - Ministry authority validation
- [ ] Implement core instructions:
  - `initialize_project()`
  - `add_milestone()`
  - `release_funds()`

#### Afternoon (4 hours)

- [ ] Write Anchor tests
- [ ] Deploy to Solana devnet
- [ ] Test all instructions via CLI
- [ ] Document program addresses & keypairs
- [ ] Create test data (3 sample projects)

#### Evening (2 hours)

- [ ] Initialize Next.js project
- [ ] Set up project structure
- [ ] Install dependencies:
  - @solana/web3.js
  - @solana/wallet-adapter-react
  - @coral-xyz/anchor (client)
  - NextAuth.js
  - TailwindCSS
  - shadcn/ui (optional)

**Deliverables:**

- ✅ Solana program deployed on devnet
- ✅ Test transactions confirmed
- ✅ Next.js skeleton ready

---

### 📅 DAY 2: Backend + Admin Dashboard (Oct 27)

**Goal:** Ministry can create projects & release funds via web interface

#### Morning (4 hours)

- [ ] Set up Supabase project (or local PostgreSQL)
- [ ] Create database schema:
  - `ministry_accounts` table
  - `projects` table
  - `milestones` table
- [ ] Configure NextAuth with Google OAuth
  - Get Google OAuth credentials
  - Set up provider
  - Test login flow
- [ ] Create API routes:
  - `POST /api/projects/create`
  - `POST /api/projects/[id]/milestones`
  - `POST /api/projects/[id]/release`

#### Afternoon (4 hours)

- [ ] Build admin dashboard UI
  - `/admin` - Login page
  - `/admin/dashboard` - Project overview
  - `/admin/projects/new` - Create project form
- [ ] Integrate Solana wallet adapter
  - Wallet connect modal
  - Sign transaction flow
- [ ] Connect form → Solana program
  - Test creating project on-chain
  - Save tx hash to database

#### Evening (2 hours)

- [ ] Build project management page
  - `/admin/projects/[id]/edit`
  - Milestone list UI
  - "Release funds" button
- [ ] Test end-to-end admin flow
  - Login → Create project → Release milestone
- [ ] Verify all data on Solana Explorer

**Deliverables:**

- ✅ Admin can login with Google
- ✅ Admin can create project (on-chain + DB)
- ✅ Admin can release milestone funds
- ✅ All transactions verifiable on devnet

---

### 📅 DAY 3: Public Dashboard + Integration (Oct 28)

**Goal:** Citizens can view and verify all spending

#### Morning (4 hours)

- [ ] Build public homepage (`/`)
  - Hero section
  - Key metrics (fetch from DB + on-chain)
  - Recent activity feed
  - Featured ministries
- [ ] Build projects list page (`/projects`)
  - Grid of project cards
  - Filter by ministry, status
  - Search functionality
  - Responsive design

#### Afternoon (4 hours)

- [ ] Build project detail page (`/projects/[id]`)
  - Project header (ministry, recipient, amount)
  - Milestone timeline (visual)
  - On-chain verification section
  - "View on Solana Explorer" links
  - Proof document links
- [ ] Create data fetching layer
  - Fetch projects from database
  - Verify data against on-chain accounts
  - Aggregate statistics

#### Evening (2 hours)

- [ ] Build analytics page (`/analytics`)
  - Simple stats (if time permits):
    - Total projects, funds allocated
    - Completion percentage
    - Projects by ministry (table or simple chart)
  - **OR skip if behind schedule**
- [ ] Build about page (`/about`)
  - How it works
  - Technology explanation
  - Contact info

**Deliverables:**

- ✅ Public can view all projects
- ✅ Public can verify transactions on Solana Explorer
- ✅ Responsive UI works on mobile
- ✅ Complete user journey: Ministry creates → Public verifies

---

### 📅 DAY 4: Polish, Demo & Submission (Oct 29-30)

**Goal:** Professional demo video + complete submission

#### Morning (3 hours)

- [ ] UI polish & bug fixes
  - Loading states
  - Error handling
  - Success notifications
  - Responsive tweaks
- [ ] Add real Indonesian government data
  - Use actual Ekraf program names
  - Authentic ministry branding
  - Realistic amounts (IDR)
- [ ] Add visual polish
  - Ministry logos
  - Indonesia flag/colors
  - Professional typography
  - Smooth transitions

#### Afternoon (4 hours)

- [ ] Deploy to VPS
  - Set up domain/subdomain
  - Configure environment variables
  - Deploy Next.js app
  - Test production build
- [ ] Create demo scenario data
  - 3-5 sample projects
  - Mix of completed/active milestones
  - Real Solana devnet transactions
- [ ] Test complete demo flow
  - Admin: Create + release
  - Public: View + verify
  - Mobile responsiveness check

#### Evening (3 hours)

- [ ] **Record demo video (MAX 3 minutes)**
  - Script narration (see script below)
  - Screen recording (1080p minimum)
  - Show both admin and public view
  - Verify on Solana Explorer live
  - Show mobile view
  - Professional editing (simple cuts OK)

**Video Script Structure:**

```
00:00-00:20  Problem (corruption, opacity)
00:20-00:40  Solution (blockchain as trust layer)
00:40-01:20  Ministry demo (create + release)
01:20-02:00  Citizen demo (view + verify)
02:00-02:30  Technology & architecture
02:30-03:00  Impact & future vision
```

- [ ] Create pitch deck (Google Slides)
  - Slide 1: Title + tagline
  - Slide 2: Problem statement
  - Slide 3: Solution overview
  - Slide 4: How it works (architecture diagram)
  - Slide 5: Demo screenshots
  - Slide 6: Technology stack
  - Slide 7: Impact potential
  - Slide 8: Business model & sustainability
  - Slide 9: Team (if applicable)
  - Slide 10: Future roadmap
  - Slide 11: Contact & GitHub

#### Late Evening (2 hours)

- [ ] Prepare GitHub repository
  - Clean up code
  - Add comprehensive README
  - Document setup instructions
  - Add LICENSE (MIT recommended)
  - Tag release version
- [ ] **Submit to Superteam Earn**
  - Project title & description
  - Link to live MVP (VPS URL)
  - Link to demo video (YouTube/Loom)
  - Link to GitHub repo
  - Link to pitch deck
- [ ] **Submit to Cypherpunk Colosseum**
  - Dual submission required per rules
  - Same materials as Superteam

**Deliverables:**

- ✅ Live MVP on public URL
- ✅ 3-minute demo video
- ✅ Pitch deck
- ✅ GitHub repo (public)
- ✅ Submitted to both platforms

---

## Buffer Time & Contingency

### If Ahead of Schedule

**Priority additions:**

1. Analytics page with charts (Chart.js or Recharts)
2. Advanced search/filter on projects list
3. Export data to CSV
4. Email notifications for milestone releases
5. Recipient portal (basic version)

### If Behind Schedule

**Cut features in this order:**

1. ❌ Analytics page (use simple stats instead)
2. ❌ About page (can be minimal text)
3. ❌ Advanced filters (just basic dropdown)
4. ❌ Mobile optimization (desktop-first demo OK)
5. ⚠️ **NEVER cut:**
   - Core on-chain functionality
   - Admin create + release flow
   - Public view + verification
   - Demo video

---

## Daily Checkpoints

**End of each day, verify:**

- [ ] Code committed to Git
- [ ] Features work end-to-end (no broken state)
- [ ] On-chain data verifiable on Solana Explorer
- [ ] No critical bugs blocking next day's work

**Red flags that require scope cut:**

- Behind schedule by >4 hours
- Bugs taking >2 hours to debug
- Third-party service issues (Solana RPC, Supabase, etc.)

---

## Team Roles (if working solo, prioritize in order)

**If solo:**

1. Backend + Blockchain (critical path)
2. Frontend (core pages only)
3. Design (use Tailwind defaults + minimal custom)
4. Content (write copy during breaks)

**If team of 2-3:**

- Person A: Solana program + API routes
- Person B: Frontend UI + integration
- Person C: Design, demo video, pitch deck

---

## Success Metrics

**Minimum Viable Demo:**

- [x] Ministry can login
- [x] Ministry can create project on-chain
- [x] Ministry can release milestone on-chain
- [x] Public can view project
- [x] Public can click TX hash → verify on Solana Explorer
- [x] Demo video shows complete flow
- [x] Submitted before deadline

**Stretch Goals:**

- [ ] Analytics page with charts
- [ ] Mobile-optimized UI
- [ ] Real Ekraf program data
- [ ] Multiple ministries demonstrated
- [ ] Advanced search/filters

---

## Critical Path Items (CANNOT BE DELAYED)

**Day 1:**

- ✅ Solana program working on devnet

**Day 2:**

- ✅ Admin can create projects on-chain via web UI

**Day 3:**

- ✅ Public can view and verify projects

**Day 4:**

- ✅ Demo video recorded
- ✅ Submission completed

**Any delay in critical path → immediately cut non-critical features**

---

## Emergency Contacts & Resources

**Solana Issues:**

- Devnet RPC: <https://api.devnet.solana.com>
- Explorer: <https://explorer.solana.com/?cluster=devnet>
- Discord: Solana Tech support

**Hackathon Support:**

- Telegram: @Steven4293
- Superteam Indonesia community

**Deployment:**

- VPS provider support
- Domain registrar support

---

## Motivation Checkpoints

**Daily affirmations:**

- ✅ "This solves a real problem"
- ✅ "The tech approach is sound"
- ✅ "Winning probability is high"
- ✅ "Even if we don't win, this is valuable"

**When feeling overwhelmed:**

- Focus on critical path only
- Cut features ruthlessly
- Working simple > broken complex
- Demo quality > feature count

**Remember:**

- 8 submissions = low competition
- Judges are ministry partners = built-in alignment
- Your concept is already strong
- Execution just needs to be solid, not perfect

---

**Bismillah! Let's execute this plan and build something excellent! 🚀**

**InshaAllah, we finish on time with quality work.**
