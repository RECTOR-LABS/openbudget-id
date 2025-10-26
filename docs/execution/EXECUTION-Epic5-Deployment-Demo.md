# EXECUTION PLAN: Epic 5 - Deployment & Demo

**Epic ID:** EPIC-05
**Last Updated:** 2025-10-26
**Overall Status:** 🔴 Not Started (Blocked by EPIC-04)
**Completion:** 0% (0/10 tasks completed)

---

## Epic Progress Dashboard

| Story | Status | Progress | Tasks Completed | Estimated | Actual | Blocker |
|-------|--------|----------|-----------------|-----------|--------|---------|
| 5.1: VPS Deployment | 🔴 Not Started | 0% | 0/5 | 3h | - | - |
| 5.2: Create Demo Data | 🔴 Not Started | 0% | 0/1 | 1h | - | Needs 5.1 |
| 5.3: Demo Video | 🔴 Not Started | 0% | 0/3 | 1.5h | - | Needs 5.2 |
| 5.4: Polish GitHub | 🔴 Not Started | 0% | 0/2 | 1h | - | Needs 5.3 |
| 5.5: Performance Optimization | 🔴 Not Started | 0% | 0/1 | 30m | - | Needs 5.1 |
| **TOTAL** | 🔴 | **0%** | **0/12** | **7h** | **-** | - |

---

## Prerequisites Check

| Prerequisite | Required From | Status | Notes |
|-------------|---------------|--------|-------|
| Application fully functional | EPIC-04 | 🔴 | Both dashboards working |
| Sample projects tested locally | EPIC-03/04 | 🔴 | At least 2 projects |
| VPS access configured | - | ❓ | Check ~/.ssh/config |
| Domain DNS set up | - | ❓ | openbudget.rectorspace.com |
| Google OAuth prod credentials | - | 🔴 | Need new redirect URI |
| Screen recording software | - | ❓ | OBS or Loom installed |

---

## Story 5.1: VPS Deployment

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/5 tasks)
**Target Completion:** Day 4, Hour 3

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 5.1.1 | Prepare VPS environment | 🔴 | RECTOR | 45m | - | None | Install dependencies |
| 5.1.2 | Setup PostgreSQL on VPS | 🔴 | RECTOR | 30m | - | 5.1.1 | Create DB + schema |
| 5.1.3 | Deploy Next.js app | 🔴 | RECTOR | 45m | - | 5.1.2 | Build + PM2 |
| 5.1.4 | Configure Nginx + SSL | 🔴 | RECTOR | 45m | - | 5.1.3 | Certbot |
| 5.1.5 | Configure firewall | 🔴 | RECTOR | 15m | - | 5.1.4 | UFW setup |

### Task Details

#### ✅ **Task 5.1.1: Prepare VPS**
- **Check SSH Config:**
  ```bash
  cat ~/.ssh/config | grep rectorspace
  ```
- **SSH and Install:**
  ```bash
  ssh rectorspace-vps
  sudo apt update && sudo apt upgrade -y
  # Install Node.js, PostgreSQL, PM2, Nginx, Certbot (see PRD)
  ```
- **Validation:**
  - [ ] SSH connection works
  - [ ] Node.js 18+ installed: `node --version`
  - [ ] PostgreSQL running: `sudo systemctl status postgresql`
  - [ ] PM2 installed: `pm2 --version`
  - [ ] Nginx installed: `nginx -v`

---

#### ✅ **Task 5.1.2: Setup PostgreSQL**
- **Commands:**
  ```bash
  sudo -u postgres psql
  CREATE DATABASE openbudget;
  CREATE USER openbudget_user WITH PASSWORD 'secure_password';
  GRANT ALL PRIVILEGES ON DATABASE openbudget TO openbudget_user;
  \q

  # Transfer and apply schema
  scp database/schema.sql rectorspace-vps:/tmp/
  ssh rectorspace-vps "psql -U openbudget_user -d openbudget -f /tmp/schema.sql"
  ```
- **Validation:**
  - [ ] Database created: `psql -U openbudget_user -d openbudget -c "\dt"`
  - [ ] Tables exist: users, projects, milestones
  - [ ] Indexes created: `\di`

---

#### ✅ **Task 5.1.3: Deploy Next.js**
- **Build Locally:**
  ```bash
  cd frontend
  npm run build
  ```
- **Transfer to VPS:**
  ```bash
  ssh rectorspace-vps "mkdir -p ~/openbudget"
  rsync -avz --exclude node_modules frontend/ rectorspace-vps:~/openbudget/
  ssh rectorspace-vps "cd ~/openbudget && npm install --production"
  ```
- **Setup .env.local on VPS** (see PRD)
- **Start with PM2:**
  ```bash
  ssh rectorspace-vps "cd ~/openbudget && pm2 start npm --name openbudget -- start"
  ssh rectorspace-vps "pm2 save && pm2 startup"
  ```
- **Validation:**
  - [ ] PM2 shows process running: `pm2 status`
  - [ ] App accessible: `curl http://localhost:3000`

---

#### ✅ **Task 5.1.4: Nginx + SSL**
- **Create Nginx config** (see PRD)
- **Enable and test:**
  ```bash
  sudo ln -s /etc/nginx/sites-available/openbudget /etc/nginx/sites-enabled/
  sudo nginx -t
  sudo systemctl reload nginx
  ```
- **Get SSL:**
  ```bash
  sudo certbot --nginx -d openbudget.rectorspace.com
  ```
- **Validation:**
  - [ ] Visit http://openbudget.rectorspace.com (redirects to HTTPS)
  - [ ] Visit https://openbudget.rectorspace.com (loads app)
  - [ ] SSL certificate valid (check browser lock icon)

---

#### ✅ **Task 5.1.5: Firewall**
- **Commands:**
  ```bash
  sudo ufw allow OpenSSH
  sudo ufw allow 'Nginx Full'
  sudo ufw enable
  sudo ufw status
  ```
- **Validation:**
  - [ ] Firewall active
  - [ ] Ports 22, 80, 443 open
  - [ ] SSH still works

---

### Story 5.1 Completion Criteria
- [ ] Application live at https://openbudget.rectorspace.com
- [ ] SSL working
- [ ] PM2 auto-restart configured
- [ ] Firewall secured

---

## Story 5.2: Create Demo Data

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/1 task)
**Target Completion:** Day 4, Hour 4

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 5.2.1 | Create 3 demo projects via admin | 🔴 | RECTOR | 60m | - | 5.1.4 | Realistic data |

### Task Details

#### ✅ **Task 5.2.1: Create demo projects**
- **Login:** https://openbudget.rectorspace.com/admin (Google OAuth)
- **Create Projects:** (see PRD for 3 project templates)
  1. Pembangunan Klinik Desa Terpencil (Kemenkes, 5B IDR)
  2. Digitalisasi Sekolah Dasar (Kemendikbud, 3B IDR)
  3. Perbaikan Jalan Trans-Sumatra (Kemenhub, 10B IDR)
- **For Each Project:**
  - [ ] Create as draft
  - [ ] Connect wallet
  - [ ] Publish to blockchain (sign transaction)
  - [ ] Add 3-5 milestones
  - [ ] Release 2+ milestones with proof URLs
  - [ ] Verify transaction on Solana Explorer
- **Validation:**
  - [ ] All 3 projects visible on public dashboard
  - [ ] Transaction hashes stored in DB
  - [ ] Explorer links work

---

### Story 5.2 Completion Criteria
- [ ] 3 realistic demo projects published
- [ ] Blockchain verification working

---

## Story 5.3: Demo Video

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/3 tasks)
**Target Completion:** Day 4, Hour 5.5

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 5.3.1 | Prepare demo script | 🔴 | RECTOR | 30m | - | 5.2.1 | Outline key points |
| 5.3.2 | Record and edit video | 🔴 | RECTOR | 45m | - | 5.3.1 | OBS Studio |
| 5.3.3 | Upload to YouTube | 🔴 | RECTOR | 15m | - | 5.3.2 | Unlisted link |

### Task Details

#### ✅ **Task 5.3.1: Script**
- **Outline:** (see PRD for full script structure)
  1. Intro (30s) - Problem & Solution
  2. Admin demo (1m) - Publish project
  3. Public demo (1m) - Verify on blockchain
  4. Architecture (30s) - Hybrid approach
  5. Impact (1m) - Social value
- **Validation:**
  - [ ] Script written and rehearsed
  - [ ] Timing fits 3-5 minute target

---

#### ✅ **Task 5.3.2: Record**
- **Tools:**
  - OBS Studio or Loom
  - iMovie for editing
  - Clear audio
- **Process:**
  1. Record screen demo
  2. Add intro/outro graphics
  3. Add subtitles (English + Bahasa)
  4. Export 1080p MP4
- **Validation:**
  - [ ] Video duration 3-5 minutes
  - [ ] Audio clear, no background noise
  - [ ] All features shown
  - [ ] Professional quality

---

#### ✅ **Task 5.3.3: Upload**
- **YouTube:**
  - Title: "OpenBudget.ID - Blockchain Budget Transparency | Garuda Spark 2025"
  - Description with links
  - Unlisted visibility
  - Thumbnail with logo
- **Validation:**
  - [ ] Video uploaded
  - [ ] Link accessible without login
  - [ ] Added to README

---

### Story 5.3 Completion Criteria
- [ ] Demo video complete and uploaded
- [ ] Link shared in README and submission

---

## Story 5.4: Polish GitHub

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/2 tasks)
**Target Completion:** Day 4, Hour 6.5

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 5.4.1 | Update README | 🔴 | RECTOR | 45m | - | 5.3.3 | Add video link |
| 5.4.2 | Take screenshots | 🔴 | RECTOR | 15m | - | 5.2.1 | 5 key screenshots |

### Task Details

#### ✅ **Task 5.4.1: README**
- **File:** `README.md`
- **Sections:** (see PRD template)
  - Project description
  - Problem/Solution
  - Architecture
  - Features
  - Demo links
  - Screenshots
  - Setup instructions
  - Tech stack
- **Validation:**
  - [ ] README complete and well-formatted
  - [ ] All links work
  - [ ] No sensitive data exposed

---

#### ✅ **Task 5.4.2: Screenshots**
- **Required:**
  1. Homepage with projects
  2. Project detail page
  3. Admin dashboard
  4. Wallet connection
  5. Solana Explorer verification
- **Validation:**
  - [ ] All screenshots taken (1080p)
  - [ ] Added to README
  - [ ] Committed to repo

---

### Story 5.4 Completion Criteria
- [ ] README professional and complete
- [ ] Repository public and polished

---

## Story 5.5: Performance Optimization

**Story Status:** 🔴 Not Started
**Progress:** 0% (0/1 task)
**Target Completion:** Day 4, Hour 7

### Task Tracker

| Task ID | Task Name | Status | Assignee | Est | Actual | Dependencies | Notes |
|---------|-----------|--------|----------|-----|--------|--------------|-------|
| 5.5.1 | Run Lighthouse and optimize | 🔴 | RECTOR | 30m | - | 5.1.4 | Target >80 score |

### Task Details

#### ✅ **Task 5.5.1: Lighthouse**
- **Commands:**
  ```bash
  npm install -g lighthouse
  lighthouse https://openbudget.rectorspace.com --view
  ```
- **Common Issues:**
  - Images not optimized → use next/image
  - Missing meta tags → add to layout.tsx
  - Fonts not preloaded → add to head
  - No compression → enable in Nginx
- **Validation:**
  - [ ] Performance > 80
  - [ ] Accessibility > 90
  - [ ] SEO > 90
  - [ ] Best Practices > 90

---

### Story 5.5 Completion Criteria
- [ ] Lighthouse scores meet targets
- [ ] Performance optimizations applied

---

## Critical Path

```
5.1.1 → 5.1.2 → 5.1.3 → 5.1.4 (Deployment complete)
                            ↓
                         5.2.1 (Demo data)
                            ↓
                    5.3.1 → 5.3.2 → 5.3.3 (Video)
                                        ↓
                               5.4.1 → 5.4.2 (GitHub)
                                        ↓
                                     5.5.1 (Optimization)
```

**Critical Path Time:** 3h (deployment) + 1h (data) + 1.5h (video) + 1h (GitHub) + 30m (perf) = **7 hours**

---

## Final Checklist (Hackathon Submission)

### Technical Deliverables
- [ ] Live demo: https://openbudget.rectorspace.com
- [ ] Admin dashboard functional
- [ ] Public dashboard functional
- [ ] 3+ demo projects with blockchain transactions
- [ ] All Solana Explorer links working
- [ ] Performance optimized (Lighthouse > 80)

### Content Deliverables
- [ ] Demo video (3-5 min) on YouTube
- [ ] GitHub README with screenshots
- [ ] Architecture documentation
- [ ] Setup instructions

### Hackathon Submission Form
- [ ] Project title: OpenBudget.ID
- [ ] Category: Social Impact / Blockchain
- [ ] Live demo URL
- [ ] GitHub repository URL
- [ ] Demo video URL
- [ ] Team member info
- [ ] Project description (500 words)
- [ ] Tech stack details
- [ ] Social impact statement

---

## Risk Register

| Risk ID | Description | Impact | Probability | Mitigation | Owner |
|---------|-------------|--------|-------------|------------|-------|
| R17 | VPS deployment fails (port conflicts) | 🔴 High | Low | Test locally first, check ports | RECTOR |
| R18 | SSL certificate issuance delay | 🟡 Medium | Low | Use staging first, fallback to HTTP | RECTOR |
| R19 | Demo video recording issues | 🟡 Medium | Medium | Practice run, backup recording | RECTOR |
| R20 | Lighthouse score < 80 | 🟢 Low | Low | Optimize images, lazy loading | RECTOR |

---

## Blockers & Issues

| Blocker ID | Description | Story | Severity | Status | Resolution | Date |
|------------|-------------|-------|----------|--------|------------|------|
| B4 | Epic 5 blocked until app complete | All | 🔴 High | Active | Need Epic 4 | 2025-10-26 |

---

## Post-Deployment Monitoring

### Health Checks (Day 4 evening)
- [ ] Homepage loads without errors
- [ ] Admin login works
- [ ] Wallet connection functional
- [ ] Project publishing successful
- [ ] Public dashboard displays projects
- [ ] Database queries fast (< 100ms)
- [ ] No JavaScript errors in console
- [ ] Mobile responsive

### Hackathon Judging Prep (Morning of presentation)
- [ ] Demo account ready (Google + Wallet)
- [ ] Browser bookmarks for key pages
- [ ] Solana Explorer tabs preloaded
- [ ] Backup plan if internet fails (local recording)

---

**Last Updated:** 2025-10-26
**Next Review:** After Epic 4 completion (Day 3 evening)
**Final Review:** Day 4 evening before submission
