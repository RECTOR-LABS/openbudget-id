# PROJECT MASTER INDEX - OpenBudget.ID

**Project:** OpenBudget.ID - Blockchain Budget Transparency Platform
**Hackathon:** Garuda Spark October 2025
**Timeline:** 4 days to MVP
**Target:** openbudget.rectorspace.com

> 📖 **New to this documentation?** Start with [README.md](./README.md) for navigation guidance.

---

## Document Navigation

### Planning Documents (PRD)
1. **[PRD-Epic1-Blockchain-Infrastructure.md](./planning/PRD-Epic1-Blockchain-Infrastructure.md)**
   - Solana program development (Anchor/Rust)
   - Accounts: PlatformState, Project, Milestone
   - Instructions: initialize_platform, initialize_project, add_milestone, release_funds
   - **Duration:** 8 hours (Day 1)

2. **[PRD-Epic2-Database-API-Integration.md](./planning/PRD-Epic2-Database-API-Integration.md)**
   - PostgreSQL setup and schema
   - Next.js API routes (projects, milestones)
   - Blockchain bridge utilities
   - **Duration:** 6.5 hours (Day 1-2)

3. **[PRD-Epic3-Admin-Ministry-Dashboard.md](./planning/PRD-Epic3-Admin-Ministry-Dashboard.md)**
   - NextAuth (Google OAuth)
   - Solana wallet adapter (Phantom/Solflare)
   - Admin UI for project creation and publishing
   - **Duration:** 7 hours (Day 2-3)

4. **[PRD-Epic4-Public-Citizen-Dashboard.md](./planning/PRD-Epic4-Public-Citizen-Dashboard.md)**
   - Public homepage with project list
   - Project detail pages
   - Solana Explorer verification links
   - **Duration:** 4 hours (Day 3)

5. **[PRD-Epic5-Deployment-Demo.md](./planning/PRD-Epic5-Deployment-Demo.md)**
   - VPS deployment (rectorspace.com)
   - Demo data creation
   - Demo video production
   - Hackathon submission
   - **Duration:** 7 hours (Day 4)

### Execution Plans (Progress Tracking)
1. **[EXECUTION-Epic1-Blockchain-Infrastructure.md](./execution/EXECUTION-Epic1-Blockchain-Infrastructure.md)**
   - Task tracker with status, dependencies, blockers
   - 15 tasks across 5 stories
   - Completion checklist

2. **[EXECUTION-Epic2-Database-API-Integration.md](./execution/EXECUTION-Epic2-Database-API-Integration.md)**
   - 11 tasks across 5 stories
   - Dependencies on Epic 1
   - API endpoint checklist

3. **[EXECUTION-Epic3-Admin-Ministry-Dashboard.md](./execution/EXECUTION-Epic3-Admin-Ministry-Dashboard.md)**
   - 12 tasks across 5 stories
   - OAuth and wallet integration steps
   - Testing checklist

4. **[EXECUTION-Epic4-Public-Citizen-Dashboard.md](./execution/EXECUTION-Epic4-Public-Citizen-Dashboard.md)**
   - 5 tasks across 2 stories
   - Performance testing checklist
   - Responsiveness validation

5. **[EXECUTION-Epic5-Deployment-Demo.md](./execution/EXECUTION-Epic5-Deployment-Demo.md)**
   - 12 tasks across 5 stories
   - Deployment steps
   - Hackathon submission checklist

---

## Epic Overview Summary

| Epic | Focus | Key Deliverables | Duration | Dependencies |
|------|-------|------------------|----------|--------------|
| **Epic 1** | Blockchain | Solana program deployed to devnet | 8h (Day 1) | None |
| **Epic 2** | Backend | Database + API routes functional | 6.5h (Day 1-2) | Epic 1 |
| **Epic 3** | Admin UI | Ministry dashboard with wallet | 7h (Day 2-3) | Epic 2 |
| **Epic 4** | Public UI | Citizen dashboard for verification | 4h (Day 3) | Epic 3 |
| **Epic 5** | Deploy | Production deployment + demo | 7h (Day 4) | Epic 4 |
| **TOTAL** | - | MVP ready for hackathon | **32.5h** | Sequential |

---

## Project Architecture (Quick Reference)

### Technology Stack
```
Blockchain Layer (Source of Truth)
├── Solana Devnet
├── Anchor 0.29.0 (Rust)
└── Program ID: [To be deployed]

Backend Layer (Performance)
├── PostgreSQL (data storage)
├── Next.js 14 API Routes (bridge)
└── Solana Web3.js (blockchain client)

Frontend Layer (User Experience)
├── Next.js 14 App Router
├── Tailwind CSS
├── NextAuth (Google OAuth)
└── Solana Wallet Adapter
```

### Data Flow
```
1. Draft: Ministry creates project → PostgreSQL (status=draft)
2. Publish: Ministry signs tx → Solana blockchain → Update PostgreSQL (status=published, tx hash)
3. Release: Ministry releases milestone → Solana → Update PostgreSQL (released_at, tx hash)
4. Verify: Citizen views project → PostgreSQL (fast query) → Click verify → Solana Explorer (proof)
```

---

## Critical Paths

### Epic Dependencies
```
Epic 1 (Blockchain) → Epic 2 (Database/API) → Epic 3 (Admin UI) → Epic 4 (Public UI) → Epic 5 (Deploy)
```
**Cannot parallelize** - Each epic depends on the previous one.

### Intra-Epic Parallelization Opportunities
- **Epic 1:** Stories 1.1 (accounts) and 1.2 (platform init) can overlap
- **Epic 2:** Stories 2.1 (DB setup) and 2.4 (Solana utils) can run in parallel
- **Epic 3:** Stories 3.1 (auth) and 3.2 (wallet) can overlap after initial setup
- **Epic 4:** Minimal tasks, mostly sequential
- **Epic 5:** Stories 5.3 (video) and 5.4 (GitHub) can overlap

---

## Daily Breakdown (Suggested Schedule)

### Day 1: Foundation (14.5 hours)
**Morning (8h):**
- ✅ Epic 1: Blockchain Infrastructure (complete)
- Deliverable: Solana program deployed, Program ID synced

**Afternoon (6.5h):**
- ✅ Epic 2: Database & API Integration (complete)
- Deliverable: All API routes functional, tested with curl

**End of Day:**
- Solana program on devnet
- Database schema applied
- 7 API endpoints working

---

### Day 2: Admin Features (7 hours)
**Full Day:**
- ✅ Epic 3: Admin Ministry Dashboard (complete)
- Deliverable: Ministry can login, publish projects to blockchain

**End of Day:**
- NextAuth working
- Wallet connection functional
- 2+ demo projects published to blockchain

---

### Day 3: Public Access (4 hours)
**Morning (4h):**
- ✅ Epic 4: Public Citizen Dashboard (complete)
- Deliverable: Citizens can browse and verify projects

**Afternoon:**
- Buffer time for bug fixes
- Cross-browser testing
- Mobile responsive checks

**End of Day:**
- Full application functional locally
- Ready for deployment

---

### Day 4: Launch (7 hours)
**Morning (4h):**
- ✅ Epic 5.1: VPS Deployment
- ✅ Epic 5.2: Create Demo Data
- Deliverable: Live at openbudget.rectorspace.com

**Afternoon (3h):**
- ✅ Epic 5.3: Demo Video
- ✅ Epic 5.4: Polish GitHub
- ✅ Epic 5.5: Performance Optimization
- Deliverable: Hackathon submission complete

**Evening:**
- Final testing
- Submit to hackathon

---

## Task Count Summary

| Epic | Stories | Tasks | Estimated Hours | Complexity |
|------|---------|-------|-----------------|------------|
| Epic 1 | 5 | 15 | 8h | 🔴 High (Blockchain) |
| Epic 2 | 5 | 11 | 6.5h | 🟡 Medium (Integration) |
| Epic 3 | 5 | 12 | 7h | 🟡 Medium (Auth + Wallet) |
| Epic 4 | 2 | 5 | 4h | 🟢 Low (UI) |
| Epic 5 | 5 | 12 | 7h | 🟡 Medium (DevOps) |
| **TOTAL** | **22** | **55** | **32.5h** | - |

**With 20% buffer:** ~40 hours = **4 working days** @ 10h/day

---

## Key Files to Reference

### Implementation Guides
- `docs/guides/IMPLEMENTATION-PLAN.md` - Full technical specification
- `docs/guides/QUICK-START.md` - Setup instructions
- `docs/guides/TIMELINE.md` - Original timeline
- `docs/guides/SUBMISSION-CHECKLIST.md` - Hackathon submission requirements
- `CLAUDE.md` (project root) - Current status and architecture

### Schemas
- `database/schema.sql` - PostgreSQL schema
- `solana-program/openbudget/programs/openbudget/src/state.rs` - On-chain accounts

### Configuration
- `frontend/.env.local` - Environment variables (not in git)
- `solana-program/openbudget/Anchor.toml` - Solana config
- `~/.ssh/config` - VPS access

---

## Progress Tracking

### How to Use Execution Plans
1. Open relevant `EXECUTION-Epic{N}-*.md` file
2. Check "Epic Progress Dashboard" for overall status
3. Review "Prerequisites Check" before starting
4. Work through tasks sequentially (unless noted as parallel)
5. Update task status in the file:
   - 🔴 Not Started
   - 🟡 In Progress
   - 🟢 Completed
   - 🔵 Blocked
   - ⚠️ At Risk
6. Note actual time taken vs estimated
7. Document blockers in "Blockers & Issues" section
8. Review "Completion Criteria" before marking story done

### Updating Progress
**Option 1: Manual** - Edit markdown files directly
**Option 2: Script** - Create update script (future improvement)

---

## Risk Management

### High-Impact Risks (Across All Epics)
1. **Program ID Mismatch** (Epic 1)
   - Impact: 🔴 High - Transactions fail
   - Mitigation: Verify 3-location sync (Anchor.toml, lib.rs, .env.local)

2. **PDA Derivation Errors** (Epic 1-2)
   - Impact: 🔴 High - Account not found
   - Mitigation: Unit test PDA helpers, compare Rust ↔ TypeScript

3. **Wallet Integration Issues** (Epic 3)
   - Impact: 🟡 Medium - Cannot sign transactions
   - Mitigation: Test with both Phantom and Solflare

4. **VPS Deployment Failures** (Epic 5)
   - Impact: 🟡 Medium - Cannot demo
   - Mitigation: Deploy early Day 4, keep localhost fallback

### Mitigation Strategy
- Start each epic with prerequisite checks
- Test critical paths early (blockchain publish flow)
- Keep local environment as fallback
- Buffer 20% time for unexpected issues

---

## Success Metrics (Hackathon Judging)

### Technical Excellence
- [ ] Solana program deployed with verified transactions
- [ ] Hybrid architecture (DB + Blockchain) functional
- [ ] Wallet integration seamless
- [ ] Performance: < 2s page loads
- [ ] Security: Input validation, error handling

### Social Impact
- [ ] Clear value proposition (fight corruption)
- [ ] Accessible to non-technical citizens
- [ ] Scalable to all Indonesian ministries
- [ ] Real-world applicability demonstrated

### Presentation
- [ ] Live demo works flawlessly
- [ ] Demo video professional (3-5 min)
- [ ] GitHub repository polished
- [ ] Documentation comprehensive

---

## Quick Commands Reference

### Epic 1 (Blockchain)
```bash
cd solana-program/openbudget
anchor build
anchor test
anchor deploy --provider.cluster devnet
anchor keys list  # Get Program ID
```

### Epic 2 (Database)
```bash
createdb openbudget
psql -d openbudget -f database/schema.sql
cd frontend && npm install
node -e "/* test DB connection */"
```

### Epic 3-4 (Frontend)
```bash
cd frontend
npm run dev
# Visit http://localhost:3000
```

### Epic 5 (Deployment)
```bash
ssh rectorspace-vps
rsync -avz frontend/ rectorspace-vps:~/openbudget/
pm2 start npm --name openbudget -- start
sudo certbot --nginx -d openbudget.rectorspace.com
```

---

## Document Maintenance

### When to Update PRDs
- Requirements change (rare during hackathon)
- New stories/tasks identified
- Technical approach pivots

### When to Update Execution Plans
- Task status changes (🔴 → 🟡 → 🟢)
- Actual time differs significantly from estimate
- Blockers identified
- Dependencies discovered

### End-of-Epic Reviews
After completing each epic:
1. Update CLAUDE.md with current status
2. Fill "Retrospective" section in Execution Plan
3. Document lessons learned
4. Update risks for next epic

---

## Contact & Resources

### Project Context
- **Hackathon:** Garuda Spark 2025 (October)
- **Category:** Social Impact / Blockchain
- **Target Users:** Indonesian citizens + ministry officials
- **Demo Site:** openbudget.rectorspace.com (to be deployed)

### Technical Support
- Solana Docs: https://docs.solana.com
- Anchor Docs: https://www.anchor-lang.com
- Next.js Docs: https://nextjs.org/docs

### Owner
- **RECTOR** (rz) - Senior Developer
- GitHub: rz1989s / RECTOR-LABS
- Domain: rectorspace.com

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-26 | Initial PRD and Execution Plans created | RECTOR |
| 1.1 | TBD | Updates after Epic 1 completion | RECTOR |

---

**📌 NEXT STEPS:**

1. **Start Epic 1** - Open `EXECUTION-Epic1-Blockchain-Infrastructure.md`
2. **Prerequisites:** Ensure Solana CLI, Anchor, and Rust installed
3. **First Task:** Task 1.1.1 - Create `state.rs` with PlatformState
4. **Goal:** By end of Day 1, have Solana program deployed to devnet

**May Allah grant you tawfeeq and ease in this project! 🤲**

---

*Last Updated: 2025-10-26*
*Document Status: ✅ Complete*
