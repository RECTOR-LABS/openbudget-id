# PRD: Epic 5 - Deployment & Demo

**Epic ID:** EPIC-05
**Epic Owner:** RECTOR
**Target Timeline:** Day 4 (6 hours)
**Dependencies:** EPIC-04 (requires complete application ready for production)
**Status:** Not Started

---

## Epic Overview

Deploy OpenBudget.ID to production VPS (openbudget.rectorspace.com), create demo data for hackathon judges, record demo video, and prepare submission materials for Garuda Spark hackathon.

**Success Criteria:**
- Application deployed to https://openbudget.rectorspace.com
- PostgreSQL and Next.js running on VPS
- SSL certificate configured
- 3+ demo projects with complete milestone data on devnet
- Demo video (3-5 minutes) showcasing key features
- GitHub repository polished (README, screenshots)
- Hackathon submission form completed
- Performance optimized (Lighthouse score > 80)

**Critical for Hackathon Judging:**
- Live demo accessible by judges
- Blockchain transactions verifiable on Solana Explorer
- Demo scenario ready (ministry login → publish → citizen verify)
- Clear value proposition for Indonesian transparency

---

## Story 5.1: Deploy to Production VPS

**Story ID:** STORY-5.1
**Priority:** Critical
**Estimated Effort:** 3 hours

### Description
Deploy full stack to VPS at openbudget.rectorspace.com with PostgreSQL, Next.js, and Nginx reverse proxy. Configure SSL and environment variables for production.

### Acceptance Criteria
- [ ] VPS accessible via SSH (check ~/.ssh/config)
- [ ] PostgreSQL installed and running on VPS
- [ ] Database schema applied with production data
- [ ] Next.js app built and running (PM2 for process management)
- [ ] Nginx configured with reverse proxy
- [ ] SSL certificate from Let's Encrypt
- [ ] Domain openbudget.rectorspace.com resolves correctly
- [ ] Environment variables set for production
- [ ] Firewall configured (ports 80, 443, 5432)

### Tasks

#### Task 5.1.1: Prepare VPS environment
**SSH Config Check:**
```bash
cat ~/.ssh/config | grep -A 5 rectorspace
# Should show host configuration for VPS
```

**SSH into VPS:**
```bash
ssh rectorspace-vps  # Use configured alias
```

**Install Dependencies:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot (for SSL)
sudo apt install -y certbot python3-certbot-nginx
```

---

#### Task 5.1.2: Setup PostgreSQL on VPS
**Commands:**
```bash
# Switch to postgres user
sudo -u postgres psql

-- Create database and user
CREATE DATABASE openbudget;
CREATE USER openbudget_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE openbudget TO openbudget_user;
\q

# Apply schema
scp database/schema.sql rectorspace-vps:/tmp/
ssh rectorspace-vps
psql -U openbudget_user -d openbudget -f /tmp/schema.sql
```

---

#### Task 5.1.3: Deploy Next.js application
**Local Build:**
```bash
cd frontend
npm run build
```

**Transfer to VPS:**
```bash
# Create directory on VPS
ssh rectorspace-vps "mkdir -p ~/openbudget"

# Transfer built app
rsync -avz --exclude node_modules frontend/ rectorspace-vps:~/openbudget/

# Install dependencies on VPS
ssh rectorspace-vps "cd ~/openbudget && npm install --production"
```

**Setup Environment Variables on VPS:**
```bash
# Create .env.local on VPS
ssh rectorspace-vps

cat > ~/openbudget/.env.local <<EOF
DATABASE_URL=postgresql://openbudget_user:secure_password@localhost:5432/openbudget
NEXTAUTH_URL=https://openbudget.rectorspace.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_secret
NEXT_PUBLIC_SOLANA_PROGRAM_ID=your_program_id
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
EOF
```

**Start with PM2:**
```bash
cd ~/openbudget
pm2 start npm --name "openbudget" -- start
pm2 save
pm2 startup  # Enable auto-restart on reboot
```

---

#### Task 5.1.4: Configure Nginx and SSL
**Nginx Configuration:**
```bash
sudo nano /etc/nginx/sites-available/openbudget

# Add configuration:
server {
    listen 80;
    server_name openbudget.rectorspace.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/openbudget /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d openbudget.rectorspace.com
```

---

#### Task 5.1.5: Configure firewall
**Commands:**
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## Story 5.2: Create Demo Data

**Story ID:** STORY-5.2
**Priority:** Critical
**Estimated Effort:** 1 hour

### Description
Populate production database with realistic demo projects showcasing Indonesian ministry budgets. Publish all to Solana devnet for judge verification.

### Acceptance Criteria
- [ ] 3 demo projects created with realistic data
- [ ] Each project has 3-5 milestones
- [ ] At least 2 milestones released per project
- [ ] All transactions published to Solana devnet
- [ ] Transaction hashes stored in database
- [ ] Projects visible on public dashboard

### Tasks

#### Task 5.2.1: Create demo projects via admin dashboard
**Demo Projects:**

1. **Project: Pembangunan Klinik Desa Terpencil**
   - Ministry: Kementerian Kesehatan
   - Budget: Rp 5,000,000,000 (5 billion IDR)
   - Milestones:
     1. Pengadaan Lahan (1B) - Released
     2. Konstruksi Bangunan (2B) - Released
     3. Pengadaan Peralatan Medis (1.5B) - Pending
     4. Pelatihan Tenaga Kesehatan (500M) - Pending

2. **Project: Digitalisasi Sekolah Dasar**
   - Ministry: Kementerian Pendidikan
   - Budget: Rp 3,000,000,000
   - Milestones:
     1. Pengadaan Laptop (1B) - Released
     2. Instalasi Internet (800M) - Released
     3. Pelatihan Guru (700M) - Pending
     4. Pengembangan Platform (500M) - Pending

3. **Project: Perbaikan Jalan Nasional Trans-Sumatra**
   - Ministry: Kementerian Perhubungan
   - Budget: Rp 10,000,000,000
   - Milestones:
     1. Survei dan Desain (1B) - Released
     2. Pembebasan Lahan (2B) - Released
     3. Konstruksi Fase 1 (4B) - Released
     4. Konstruksi Fase 2 (3B) - Pending

**Process:**
1. Login to admin dashboard at https://openbudget.rectorspace.com/admin
2. Create each project as draft
3. Connect wallet
4. Publish to blockchain (sign transactions)
5. Add milestones
6. Release milestones with proof URLs (use placeholder documents)
7. Verify on Solana Explorer

---

## Story 5.3: Create Demo Video

**Story ID:** STORY-5.3
**Priority:** High
**Estimated Effort:** 1.5 hours

### Description
Record 3-5 minute demo video showcasing OpenBudget.ID features, value proposition, and blockchain verification flow for hackathon submission.

### Acceptance Criteria
- [ ] Video duration: 3-5 minutes
- [ ] Quality: 1080p, clear audio
- [ ] Covers all key features (admin + public dashboards)
- [ ] Shows blockchain verification on Solana Explorer
- [ ] Explains social impact (transparency for Indonesia)
- [ ] Professional presentation (script prepared)
- [ ] Uploaded to YouTube (unlisted)

### Tasks

#### Task 5.3.1: Prepare demo script
**Script Outline:**
1. **Introduction (30s):**
   - Problem: Korupsi anggaran pemerintah
   - Solution: Blockchain-powered transparency

2. **Admin Dashboard Demo (1m):**
   - Ministry login
   - Create project
   - Publish to Solana blockchain
   - Add milestones
   - Release funds with proof

3. **Public Dashboard Demo (1m):**
   - Browse projects
   - View project details
   - See milestone progression
   - Click "Verify on Solana Explorer"
   - Show immutable transaction on blockchain

4. **Technical Architecture (30s):**
   - Hybrid: PostgreSQL (fast queries) + Solana (immutable truth)
   - How verification works

5. **Impact & Closing (1m):**
   - Potential to transform Indonesian governance
   - Citizen empowerment
   - Scalable to all ministries
   - Call to action

---

#### Task 5.3.2: Record and edit video
**Tools:**
- Screen recording: OBS Studio or Loom
- Video editing: iMovie or DaVinci Resolve
- Audio: Clear microphone, quiet environment

**Checklist:**
- [ ] Record full demo flow without errors
- [ ] Add intro/outro graphics
- [ ] Add background music (copyright-free)
- [ ] Add subtitles (English + Bahasa Indonesia)
- [ ] Export 1080p MP4

---

#### Task 5.3.3: Upload to YouTube
- [ ] Create unlisted YouTube video
- [ ] Title: "OpenBudget.ID - Blockchain Budget Transparency for Indonesia | Garuda Spark 2025"
- [ ] Description with links to live demo and GitHub
- [ ] Thumbnail with OpenBudget.ID logo

---

## Story 5.4: Polish GitHub Repository

**Story ID:** STORY-5.4
**Priority:** High
**Estimated Effort:** 1 hour

### Description
Update README with screenshots, deployment instructions, and project description for hackathon judges.

### Acceptance Criteria
- [ ] README.md updated with:
  - Project description and value proposition
  - Architecture diagram
  - Screenshots of admin and public dashboards
  - Setup instructions (local + production)
  - Demo video link
  - Hackathon submission links
- [ ] LICENSE file added (MIT or Apache 2.0)
- [ ] CONTRIBUTING.md (optional)
- [ ] All sensitive data removed (.env files gitignored)
- [ ] Repository set to public

### Tasks

#### Task 5.4.1: Update README.md
**Template:**
```markdown
# OpenBudget.ID - Blockchain Budget Transparency

Indonesian government budget transparency platform powered by Solana blockchain.

## Problem
Corruption and lack of transparency in government spending erodes public trust.

## Solution
OpenBudget.ID records ministry budget milestones on Solana blockchain, enabling citizens to verify spending in real-time.

## Architecture
- **On-Chain:** Immutable spending records on Solana devnet
- **Off-Chain:** PostgreSQL for fast queries, Next.js for UI
- **Bridge:** Hybrid pattern ensures speed + trustlessness

## Features
✅ Ministry dashboard for budget publishing
✅ Wallet integration (Phantom/Solflare)
✅ Public dashboard for citizen verification
✅ Solana Explorer links for on-chain proof
✅ Responsive design

## Demo
🎥 [Watch Demo Video](YouTube_Link)
🌐 [Live Demo](https://openbudget.rectorspace.com)

## Tech Stack
- Solana (Rust/Anchor 0.29.0)
- Next.js 14 (App Router)
- PostgreSQL
- Tailwind CSS

## Screenshots
[Add screenshots of admin dashboard, public dashboard, Solana Explorer verification]

## Local Development
[Setup instructions from QUICK-START.md]

## Deployment
[Production deployment steps]

## Hackathon
Built for Garuda Spark 2025 - Social Impact Track
```

---

#### Task 5.4.2: Take screenshots
**Required Screenshots:**
1. Homepage with project list
2. Project detail page with milestones
3. Admin dashboard
4. Wallet connection modal
5. Solana Explorer showing transaction

**Tools:** macOS Screenshot (Cmd+Shift+4) or browser DevTools device mode

---

## Story 5.5: Performance Optimization

**Story ID:** STORY-5.5
**Priority:** Medium
**Estimated Effort:** 30 minutes

### Description
Run Lighthouse audit and optimize for performance, accessibility, and SEO.

### Acceptance Criteria
- [ ] Lighthouse Performance score > 80
- [ ] Lighthouse Accessibility score > 90
- [ ] Lighthouse SEO score > 90
- [ ] Images optimized (use Next.js Image component)
- [ ] Fonts preloaded
- [ ] Meta tags for SEO

### Tasks

#### Task 5.5.1: Run Lighthouse and optimize
**Commands:**
```bash
npm install -g lighthouse
lighthouse https://openbudget.rectorspace.com --view
```

**Common Optimizations:**
- Use next/image for images
- Add meta tags in layout.tsx
- Preload fonts
- Enable compression in Nginx

---

## Technical Dependencies

**Required:**
- VPS access (rectorspace.com)
- Domain DNS configured
- Google OAuth credentials for production
- Solana wallet with devnet SOL
- OBS Studio or screen recording tool
- YouTube account

---

## Definition of Done

- [ ] Application live at https://openbudget.rectorspace.com
- [ ] 3 demo projects with blockchain transactions
- [ ] Demo video uploaded to YouTube
- [ ] README updated with screenshots and links
- [ ] Lighthouse score > 80
- [ ] GitHub repository public
- [ ] Hackathon submission form completed
- [ ] Application ready for judge evaluation
