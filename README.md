# OpenBudget.ID

**Making every public fund traceable, auditable, and transparent — powered by Solana.**

![Award](https://img.shields.io/badge/🥈_Garuda_Spark-2nd_Place-gold.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solana](https://img.shields.io/badge/Solana-Devnet-purple.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)

---

## 🏆 Hackathon Winner

**🥈 2nd Place - Garuda Spark Hackathon**
**Prize:** 1,500 USDC

**Hackathon:** Garuda Spark - Blockchain for Good
**Track:** Civic Tech & Governance
**Organizers:** Superteam Indonesia × Ministry of Communication and Digital Affairs × Ministry of Creative Economy
**Date:** October 2025

---

## 📖 Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Features](#features)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🌟 Overview

OpenBudget.ID is a blockchain-based transparency platform that enables Indonesian ministries to record government spending milestones on-chain, allowing citizens to verify in real-time how public funds are allocated and used.

By leveraging Solana's fast, low-cost blockchain as an **immutable public ledger**, we create a trust layer that rebuilds confidence between government and citizens—without the complexity of typical crypto applications.

**Key Principle:** Blockchain as infrastructure, not interface. Citizens get transparency, ministries get familiar tools.

---

## 🔴 The Problem

### Lack of Public Spending Transparency

Indonesian citizens face significant challenges in tracking how their tax money is spent:

- **Opacity:** Government budget allocation and disbursement are not publicly accessible in real-time
- **Trust Deficit:** Corruption scandals and lack of transparency erode public confidence in institutions
- **No Verification:** Citizens cannot independently verify if allocated funds reached intended recipients
- **Manual Systems:** Current tracking relies on periodic reports that can be altered or delayed

**Impact:** This lack of transparency perpetuates corruption, wastes public resources, and damages the social contract between government and citizens.

---

## ✅ Our Solution

### Blockchain-Powered Budget Transparency

OpenBudget.ID uses **Solana blockchain** as an open, immutable ledger to record every government spending milestone:

1. **Ministry Records Spending:** Government officials publish project details and fund releases on-chain
2. **Permanent & Public:** Once recorded, data cannot be altered—even by the government
3. **Citizen Verification:** Any Indonesian can verify spending in real-time via blockchain explorer
4. **Minimal Web3 Friction:** Ministry staff use familiar Google login; blockchain is invisible infrastructure

**Value Proposition:**
- **For Citizens:** Unprecedented transparency into public fund usage
- **For Government:** Demonstrates accountability, rebuilds public trust
- **For Society:** Reduces corruption through radical transparency

---

## 🔄 How It Works

### User Flows

#### 1️⃣ Ministry Workflow

```
Ministry Staff → Login (Google OAuth)
              ↓
         Create Project (web form: recipient, amount, milestones)
              ↓
         Click "Publish to Blockchain"
              ↓
         Connect Wallet (one-time setup)
              ↓
         Sign Transaction
              ↓
         ✅ Project Recorded On-Chain (immutable, public)
              ↓
         Release Milestone Funds
              ↓
         Upload Proof Documents (reports, invoices)
              ↓
         Sign Transaction
              ↓
         ✅ Milestone Release Recorded On-Chain
```

#### 2️⃣ Citizen Workflow

```
Citizen → Visit openbudget.id (no login required)
       ↓
   Browse All Government Projects
       ↓
   Filter by Ministry (e.g., Ekraf, Kominfo)
       ↓
   Click Project: "Creative Economy Grant 2025"
       ↓
   View Milestones: 2/3 Released
       ↓
   Click Transaction Hash
       ↓
   ✅ Verify on Solana Explorer (blockchain proof)
       ↓
   Download Proof Documents (IPFS links)
       ↓
   Trust Confirmed: Funds were actually released
```

---

## 🛠 Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (optional)
- **State Management:** React Context + SWR

### Blockchain
- **Network:** Solana (Devnet for demo, Mainnet-ready)
- **Program Framework:** Anchor
- **Language:** Rust
- **Wallet Adapter:** @solana/wallet-adapter-react

### Backend & Database
- **API:** Next.js API Routes
- **Database:** PostgreSQL (via Supabase) or local
- **Authentication:** NextAuth.js (Google OAuth)
- **Storage:** Local VPS or IPFS (nft.storage)

### Deployment
- **Frontend:** VPS (Nginx + PM2) or Vercel
- **Domain:** openbudget.rectorspace.com
- **SSL:** Let's Encrypt (HTTPS)
- **Monitoring:** PM2, Sentry (optional)

---

## 🏗 Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC USERS                          │
│            (Citizens, Journalists, Auditors)             │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS FRONTEND (Public View)             │
│  ┌──────────┬──────────┬──────────┬─────────────────┐  │
│  │ Homepage │ Projects │  Detail  │    Analytics    │  │
│  │   (/)    │ (/proj.) │ (/proj/) │   (/analytics)  │  │
│  └──────────┴──────────┴──────────┴─────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ├─→ Read Database (metadata)
                      └─→ Read Solana (on-chain data)

┌─────────────────────────────────────────────────────────┐
│                 MINISTRY USERS (Admin)                   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│           NEXT.JS FRONTEND (Admin Dashboard)            │
│  ┌──────────┬──────────┬──────────┬─────────────────┐  │
│  │  Login   │Dashboard │  Create  │     Manage      │  │
│  │ (OAuth)  │ (Overview)│ Project  │   Milestones    │  │
│  └──────────┴──────────┴──────────┴─────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ├─→ NextAuth.js (Google OAuth)
                      ├─→ API Routes (CRUD operations)
                      └─→ Wallet Adapter (sign transactions)

┌─────────────────────────────────────────────────────────┐
│                   BACKEND LAYER                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │       Next.js API Routes (/api/*)               │   │
│  │  - POST /api/projects/create                    │   │
│  │  - POST /api/projects/[id]/milestones           │   │
│  │  - POST /api/projects/[id]/release              │   │
│  │  - GET  /api/projects (public)                  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ├─→ PostgreSQL/Supabase (off-chain metadata)
                      └─→ Solana Program (on-chain data)

┌─────────────────────────────────────────────────────────┐
│              SOLANA BLOCKCHAIN (Devnet)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Anchor Program: openbudget                   │   │
│  │    Instructions:                                │   │
│  │    - initialize_project()                       │   │
│  │    - add_milestone()                            │   │
│  │    - release_funds()                            │   │
│  │                                                  │   │
│  │    Accounts:                                    │   │
│  │    - Project (ministry, recipient, amount)      │   │
│  │    - Milestone (description, amount, tx, proof) │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│             STORAGE & VERIFICATION                       │
│  - PostgreSQL: Project metadata, user accounts          │
│  - IPFS / VPS: Proof documents (PDFs, images)           │
│  - Solana Explorer: Public blockchain verification      │
└─────────────────────────────────────────────────────────┘
```

### Data Model

#### Solana Program (On-Chain)

```rust
pub struct Project {
    pub id: String,              // Unique project ID
    pub ministry: Pubkey,        // Ministry authority
    pub recipient: Pubkey,       // Fund recipient
    pub total_amount: u64,       // Total allocated (lamports)
    pub status: ProjectStatus,   // Active, Completed, Cancelled
    pub created_at: i64,         // Unix timestamp
    pub bump: u8,                // PDA bump seed
}

pub struct Milestone {
    pub project: Pubkey,         // Parent project
    pub index: u8,               // Milestone number
    pub description: String,     // What this milestone is for
    pub amount: u64,             // Milestone amount (lamports)
    pub is_released: bool,       // Has funds been released?
    pub release_tx: String,      // Transaction signature
    pub proof_uri: String,       // IPFS or URL to proof doc
    pub released_at: i64,        // Release timestamp
}
```

#### Database (Off-Chain Metadata)

```sql
-- Ministry accounts (Google OAuth users)
CREATE TABLE ministry_accounts (
    id UUID PRIMARY KEY,
    google_id VARCHAR UNIQUE NOT NULL,
    email VARCHAR NOT NULL,
    ministry_name VARCHAR NOT NULL,
    wallet_address VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Projects (metadata + on-chain reference)
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    ministry_id UUID REFERENCES ministry_accounts(id),
    title VARCHAR NOT NULL,
    description TEXT,
    recipient_name VARCHAR NOT NULL,
    recipient_type VARCHAR,
    total_amount BIGINT NOT NULL,
    status VARCHAR DEFAULT 'draft',
    solana_account VARCHAR,        -- On-chain PDA address
    creation_tx VARCHAR,            -- Transaction hash
    created_at TIMESTAMP DEFAULT NOW()
);

-- Milestones (metadata + on-chain reference)
CREATE TABLE milestones (
    id UUID PRIMARY KEY,
    project_id UUID REFERENCES projects(id),
    index INT NOT NULL,
    description TEXT,
    amount BIGINT NOT NULL,
    is_released BOOLEAN DEFAULT false,
    release_tx VARCHAR,             -- Transaction hash
    proof_url VARCHAR,
    released_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✨ Features

### Public Dashboard (No Login Required)

- ✅ **Homepage:** Key metrics, recent activity, featured ministries
- ✅ **Projects List:** Browse all government projects with filters
- ✅ **Project Detail:** View milestones, verify on-chain, download proofs
- ✅ **Analytics:** Visual charts showing funds by ministry, completion rates
- ✅ **On-Chain Verification:** One-click links to Solana Explorer
- ✅ **Mobile Responsive:** Works on all devices

### Ministry Dashboard (Google OAuth)

- ✅ **Google Login:** Familiar authentication, no crypto knowledge needed
- ✅ **Create Projects:** Web form to define project, recipient, milestones
- ✅ **Publish to Blockchain:** One-time wallet connection, sign transactions
- ✅ **Release Milestones:** Upload proofs, release funds on-chain
- ✅ **Project Management:** Track all your ministry's projects
- ✅ **Transaction History:** View all blockchain actions

### Blockchain Integration

- ✅ **Solana Devnet:** Fast, cheap transactions (~$0.00025 each)
- ✅ **Immutable Records:** Cannot be altered after publishing
- ✅ **Public Verification:** Anyone can verify data on Solana Explorer
- ✅ **Anchor Framework:** Secure, auditable Rust smart contracts
- ✅ **Event Logging:** On-chain events for indexing/analytics

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Rust and Cargo (for Solana program)
- Solana CLI (for deployment)
- Anchor CLI 0.32+
- PostgreSQL (local or Supabase)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/[USERNAME]/openbudget-garuda-spark.git
cd openbudget-garuda-spark
```

#### 2. Set Up Solana Program

```bash
cd solana-program
anchor build
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Note the Program ID from output
```

#### 3. Set Up Frontend

```bash
cd ../frontend
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values:
# - DATABASE_URL (PostgreSQL connection)
# - NEXTAUTH_SECRET (random string)
# - GOOGLE_CLIENT_ID (OAuth)
# - GOOGLE_CLIENT_SECRET (OAuth)
# - NEXT_PUBLIC_SOLANA_PROGRAM_ID (from step 2)
# - NEXT_PUBLIC_SOLANA_RPC_URL
```

#### 4. Set Up Database

```bash
# Run migrations
npm run db:migrate

# Or manually execute
psql -U postgres -d openbudget < ../database/schema.sql
```

#### 5. Run Development Server

```bash
npm run dev

# Open http://localhost:3000
```

### Demo Credentials

For testing the admin dashboard:

- **Email:** demo@ekraf.go.id (use any Google account in dev mode)
- **Wallet:** Connect Phantom/Solflare wallet (devnet)

---

## 📦 Deployment

### VPS Deployment (Recommended for Hackathon)

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Install dependencies
sudo apt update
sudo apt install -y nodejs npm postgresql nginx certbot

# Clone repository
git clone https://github.com/[USERNAME]/openbudget-garuda-spark.git
cd openbudget-garuda-spark/frontend

# Install and build
npm install
npm run build

# Set up PM2 for process management
npm install -g pm2
pm2 start npm --name "openbudget" -- start
pm2 save
pm2 startup

# Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/openbudget

# Add SSL with Let's Encrypt
sudo certbot --nginx -d openbudget.rectorspace.com
```

### Environment Variables (Production)

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/openbudget

# NextAuth
NEXTAUTH_URL=https://openbudget.rectorspace.com
NEXTAUTH_SECRET=[generate with: openssl rand -base64 32]

# Google OAuth
GOOGLE_CLIENT_ID=[from Google Cloud Console]
GOOGLE_CLIENT_SECRET=[from Google Cloud Console]

# Solana
NEXT_PUBLIC_SOLANA_PROGRAM_ID=[your deployed program ID]
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

---

## 🎥 Demo

**Live MVP:** [https://openbudget.rectorspace.com](https://openbudget.rectorspace.com)

**Demo Video:** [YouTube Link](https://youtu.be/[VIDEO_ID])

**Pitch Deck:** [Google Slides](https://docs.google.com/presentation/d/[DECK_ID])

### Sample Projects on Devnet

Try verifying these real projects:

1. **Ekraf Creative Grant 2025**
   - Recipient: PT Kreatif Nusantara
   - Amount: Rp 500,000,000
   - [View Project](https://openbudget.rectorspace.com/projects/[ID])

2. **Kominfo Digital Infrastructure**
   - Recipient: CV Tech Solutions
   - Amount: Rp 1,200,000,000
   - [View Project](https://openbudget.rectorspace.com/projects/[ID])

---

## 🤝 Contributing

We welcome contributions! This project is open source to benefit Indonesia's civic tech community.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- TypeScript for frontend (strict mode)
- Rust for Solana programs
- ESLint + Prettier for code formatting
- Meaningful commit messages
- Tests for critical functionality

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Why MIT?**
- Encourages government adoption (no restrictions)
- Allows other Indonesian ministries to use freely
- Supports civic tech community growth

---

## 📞 Contact

**Project Team:**
- RECTOR - Lead Developer
- [Add team members if applicable]

**Communication:**
- **Email:** [your-email]
- **Telegram:** [your-telegram]
- **GitHub Issues:** [Report bugs/feature requests](https://github.com/[USERNAME]/openbudget-garuda-spark/issues)

**Hackathon Organizers:**
- Superteam Indonesia
- Ministry of Communication and Digital Affairs (Komdigi)
- Ministry of Creative Economy (Ekraf)

---

## 🙏 Acknowledgments

- **Superteam Indonesia** for organizing Garuda Spark hackathon
- **Solana Foundation** for blockchain infrastructure
- **Indonesian Ministries** (Komdigi, Ekraf) for partnership and support
- **Open source community** for frameworks and tools

---

## 🌏 Impact Vision

**Short-term (2025):**
- Pilot with Ministry of Ekraf
- Track Rp 10B+ in government grants
- Onboard 5+ central ministries

**Mid-term (2026-2027):**
- Expand to provincial governments (Pemda)
- Integrate citizen feedback mechanisms
- Add AI-powered anomaly detection

**Long-term (2028+):**
- National standard for government transparency
- Support Digital Indonesia 2045 vision
- Export model to other Southeast Asian nations

---

**Built with ❤️ for Indonesian transparency and Digital Indonesia 2045**

**Blockchain for Good • Civic Tech • Open Government**
