# Submission Requirements Checklist

**Hackathon:** Garuda Spark - STIndo × Komdigi × Ekraf
**Deadline:** ~2025-10-31 (4.9 days from start)
**Dual Submission Required:** Superteam Earn + Cypherpunk Colosseum

---

## 🎯 Mandatory Deliverables

### ✅ 1. Project Title & Description

**Required:**
- [x] Clear project name: **OpenBudget.ID**
- [x] Concise tagline
- [ ] Problem statement (2-3 sentences)
- [ ] Solution summary (2-3 sentences)
- [ ] Blockchain technology explanation (1-2 sentences)

**Draft Content:**

**Title:** OpenBudget.ID

**Tagline:** Making every public fund traceable, auditable, and transparent — powered by Solana.

**Description:**
> Indonesian citizens cannot track how government funds are spent, leading to corruption and eroded public trust. OpenBudget.ID records every ministry spending milestone on Solana blockchain, creating an immutable, public audit trail. Citizens can verify in real-time that allocated funds reach intended recipients and are used properly. By using blockchain as an invisible trust layer—not a user-facing complexity—we make transparency accessible to every Indonesian, rebuilding confidence in public governance.

---

### ✅ 2. MVP / Project Website

**Requirements:**
- [ ] **Live, publicly accessible URL**
- [ ] Working application (not localhost)
- [ ] Demonstrates core functionality
- [ ] No authentication barriers for public view
- [ ] Loads within 5 seconds

**Implementation:**
- **URL Format:** `openbudget.rectorspace.com` or `openbudget-id.rectorspace.com`
- **Hosting:** Deploy on VPS
- **SSL:** Enable HTTPS (free Let's Encrypt)
- **Uptime:** Ensure 99% uptime during judging period

**Pre-Submission Testing:**
- [ ] Test from multiple devices (desktop, mobile, tablet)
- [ ] Test from incognito/private browsing
- [ ] Test on different networks (WiFi, mobile data)
- [ ] Verify all links work
- [ ] Check Solana Explorer links open correctly
- [ ] Ensure responsive design on mobile

---

### ✅ 3. Demo Video

**Specifications:**
- [ ] **Maximum length:** 3 minutes (180 seconds)
- [ ] **Minimum quality:** 1080p (1920×1080)
- [ ] **Format:** MP4, WebM, or YouTube/Loom link
- [ ] **Audio:** Clear narration (English or Bahasa Indonesia)
- [ ] **Content:** Demonstrates core MVP features

**Video Structure:**

```
Segment 1: Problem (0:00-0:20) - 20 seconds
├─ Show news headline about corruption/lack of transparency
├─ State the problem clearly
└─ Explain impact on Indonesian society

Segment 2: Solution Introduction (0:20-0:40) - 20 seconds
├─ Introduce OpenBudget.ID
├─ Explain blockchain as immutable ledger
└─ Show homepage overview

Segment 3: Ministry Demo (0:40-1:40) - 60 seconds
├─ Login to admin dashboard (Google OAuth)
├─ Create new project (Ekraf grant example)
├─ Fill in recipient, amount, milestones
├─ Click "Publish to Blockchain"
├─ Connect wallet and sign transaction
├─ Show success message + transaction hash
├─ Navigate to "Release Milestone"
├─ Upload proof document
└─ Release funds on-chain

Segment 4: Citizen Verification (1:40-2:20) - 40 seconds
├─ Switch to public dashboard view
├─ Browse projects list
├─ Click on Ekraf project
├─ Show milestone details
├─ Click transaction hash
├─ Open Solana Explorer (show live blockchain data)
├─ Verify amount, timestamp, ministry address
└─ Download proof document

Segment 5: Impact & Tech (2:20-2:50) - 30 seconds
├─ Explain technology stack (Solana, Next.js)
├─ Highlight hybrid architecture (Web2 UX + Web3 trust)
├─ Show mobile responsive view
└─ Explain scalability (all ministries can use this)

Segment 6: Closing (2:50-3:00) - 10 seconds
├─ Impact statement: "Rebuilding trust through transparency"
├─ Alignment with Digital Indonesia 2045
├─ Call to action: Visit openbudget.rectorspace.com
└─ End screen: OpenBudget.ID logo + contact
```

**Production Checklist:**
- [ ] Write full narration script
- [ ] Record voiceover OR use text overlays
- [ ] Record screen captures (use OBS Studio / Loom)
- [ ] Edit video (simple cuts, transitions)
- [ ] Add background music (optional, keep subtle)
- [ ] Export in 1080p MP4
- [ ] Upload to YouTube (unlisted) OR Loom
- [ ] Test playback on multiple devices
- [ ] Add subtitles/captions (optional but helpful)

**Tools:**
- **Screen recording:** OBS Studio (free), Loom, QuickTime
- **Video editing:** DaVinci Resolve (free), iMovie, Premiere Pro
- **Hosting:** YouTube (unlisted link), Loom, Vimeo

---

### ✅ 4. GitHub Repository

**Requirements:**
- [ ] **Public repository** (not private)
- [ ] Clean, organized code structure
- [ ] Comprehensive README.md
- [ ] Setup/installation instructions
- [ ] License file (MIT recommended)
- [ ] No sensitive keys/secrets committed

**Repository Structure:**

```
openbudget-garuda-spark/
├── README.md                    ⭐ Critical
├── LICENSE
├── .gitignore
├── docs/
│   ├── architecture.md
│   └── deployment.md
├── frontend/                    (Next.js app)
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── utils/
│   └── public/
├── solana-program/              (Anchor project)
│   ├── Anchor.toml
│   ├── Cargo.toml
│   ├── programs/
│   │   └── openbudget/
│   │       └── src/
│   └── tests/
└── database/
    └── schema.sql
```

**README.md Must Include:**
- [ ] Project title & description
- [ ] Problem statement
- [ ] Solution overview
- [ ] Technology stack
- [ ] Architecture diagram (optional but impressive)
- [ ] Setup instructions (step-by-step)
- [ ] Environment variables needed
- [ ] Deployment guide
- [ ] Demo credentials (if applicable)
- [ ] License
- [ ] Contact information
- [ ] Hackathon submission note

**Pre-Submission Checks:**
- [ ] Remove all `.env` files (use `.env.example` instead)
- [ ] Remove API keys, private keys, secrets
- [ ] Ensure `npm install` works from scratch
- [ ] Test setup instructions on fresh environment
- [ ] Add meaningful commit messages
- [ ] Tag release version (e.g., `v1.0.0-hackathon`)

---

### ✅ 5. Pitch Deck / Presentation

**Requirements:**
- [ ] **Format:** Google Slides, PowerPoint, or PDF
- [ ] **Publicly accessible link**
- [ ] Professional design
- [ ] Clear structure

**Slide Breakdown (10-12 slides):**

**Slide 1: Title**
- OpenBudget.ID logo
- Tagline: "Making every public fund traceable"
- Hackathon: Garuda Spark 2025
- Team name/members

**Slide 2: The Problem**
- Corruption statistics in Indonesia
- Citizens cannot track government spending
- Public trust in governance is low
- Current systems: opaque, manual, unverifiable

**Slide 3: Our Solution**
- Blockchain as immutable public ledger
- Real-time transparency for citizens
- Minimal Web3 friction for government users
- "Trust layer" not "crypto complexity"

**Slide 4: How It Works**
- Visual flow diagram:
  - Ministry creates project → On-chain
  - Ministry releases funds → On-chain
  - Citizens verify → Solana Explorer
- Simple, 3-step illustration

**Slide 5: User Experience**
- Screenshots: Admin dashboard
- Screenshots: Public project view
- Screenshots: On-chain verification
- Highlight: "Login with Google, verify on blockchain"

**Slide 6: Technology Stack**
- Frontend: Next.js, TypeScript, Tailwind CSS
- Blockchain: Solana, Anchor framework
- Auth: NextAuth (Google OAuth)
- Database: PostgreSQL/Supabase
- Deployment: VPS, HTTPS

**Slide 7: Architecture**
- Diagram showing:
  - Public dashboard (Next.js)
  - Ministry dashboard (Next.js + Auth)
  - Solana program (Anchor)
  - Database (off-chain metadata)
  - IPFS/Storage (proof documents)

**Slide 8: Impact Potential (35% of judging)**
- 270M+ Indonesians benefit
- Rebuilds trust in government
- Prevents corruption through transparency
- Aligns with Digital Indonesia 2045

**Slide 9: Business Model & Sustainability**
- Government SaaS subscription model
- OR public good funded by transparency initiatives
- Low operational costs (Solana fees ~$0.00025/tx)
- Scalable to all Indonesian ministries

**Slide 10: Roadmap**
- Phase 1 (MVP): Central government tracking ✅
- Phase 2: Provincial/city budgets
- Phase 3: Citizen voting on fund allocation
- Phase 4: AI-powered anomaly detection

**Slide 11: Team**
- Team members + roles
- Relevant experience
- Contact information

**Slide 12: Call to Action**
- Live demo: [URL]
- GitHub: [URL]
- Contact: [Email/Telegram]
- "Join us in rebuilding public trust through transparency"

**Design Tips:**
- Use Indonesia flag colors (red, white) + government blue
- Include ministry logos (Ekraf, Kominfo)
- High-quality screenshots
- Minimal text, strong visuals
- Professional fonts (Inter, Poppins, or similar)

---

### ✅ 6. Dual Submission Requirement

**Platform 1: Superteam Earn**
- [ ] Submit via https://earn.superteam.fun/listing/st-indo-x-komdigi-x-ekraf
- [ ] Fill all required fields
- [ ] Paste all URLs (MVP, video, GitHub, deck)
- [ ] Confirm submission received

**Platform 2: Cypherpunk Colosseum**
- [ ] Find submission portal (check hackathon page)
- [ ] Submit same materials
- [ ] Confirm submission received
- [ ] Note: Per hackathon rules, "Any of the submitters MUST submit to Colosseum Cyberpunk"

**Submission Timing:**
- [ ] **Aim to submit 6-12 hours before deadline** (buffer for issues)
- [ ] Test all links before submitting
- [ ] Save confirmation emails/screenshots

---

## 🎨 Additional Assets (Optional but Recommended)

### Logo & Branding
- [ ] OpenBudget.ID logo (SVG + PNG)
- [ ] Favicon for website
- [ ] Social media preview image (Open Graph)

### Screenshots for Pitch Deck
- [ ] Admin dashboard
- [ ] Create project page
- [ ] Public projects list
- [ ] Project detail view
- [ ] Solana Explorer verification
- [ ] Mobile responsive view

### Supporting Materials
- [ ] Architecture diagram (Figma/Draw.io)
- [ ] User flow diagram
- [ ] Data model diagram

---

## 🧪 Pre-Submission Testing Protocol

**Day Before Submission:**

**1. Functional Testing**
- [ ] Test complete user journey as ministry
- [ ] Test complete user journey as citizen
- [ ] Verify all Solana transactions on Explorer
- [ ] Test all links (no 404s, no broken links)
- [ ] Check mobile responsiveness

**2. Performance Testing**
- [ ] Test page load speeds (<3 seconds)
- [ ] Test with slow 3G connection
- [ ] Check for console errors
- [ ] Verify no memory leaks

**3. Content Review**
- [ ] Proofread all text (no typos)
- [ ] Check grammar in description/README
- [ ] Verify all amounts use Indonesian Rupiah (IDR)
- [ ] Ensure ministry names are spelled correctly

**4. Security Check**
- [ ] No private keys in GitHub
- [ ] No API secrets exposed
- [ ] Admin routes properly protected
- [ ] Rate limiting on API endpoints (if applicable)

**5. Accessibility**
- [ ] Test with screen reader (basic check)
- [ ] Verify color contrast (WCAG AA)
- [ ] Ensure keyboard navigation works

---

## 📋 Final Submission Checklist (Day 4 Evening)

**Before hitting "Submit":**

- [ ] ✅ MVP is live on public URL
- [ ] ✅ MVP works without errors
- [ ] ✅ Demo video uploaded & tested
- [ ] ✅ GitHub repo is public & clean
- [ ] ✅ README is comprehensive
- [ ] ✅ Pitch deck is accessible
- [ ] ✅ All links tested from incognito mode
- [ ] ✅ Mobile view tested
- [ ] ✅ Solana transactions verified
- [ ] ✅ Description proofread
- [ ] ✅ Contact info correct

**Submission Form Fields:**

```
Project Title: OpenBudget.ID

Tagline: Making every public fund traceable, auditable, and transparent

Problem: [2-3 sentences]

Solution: [2-3 sentences]

Blockchain Use: [1-2 sentences]

Live MVP: https://openbudget.rectorspace.com

Demo Video: https://youtu.be/[VIDEO_ID]

GitHub: https://github.com/[USERNAME]/openbudget-garuda-spark

Pitch Deck: https://docs.google.com/presentation/d/[DECK_ID]

Track: Civic Tech & Governance

Team Size: [1-5]

Team Members: [Names + roles]

Contact: [Email/Telegram]
```

---

## 🎉 Post-Submission

**Immediately After Submitting:**
- [ ] Take screenshot of confirmation page
- [ ] Save confirmation email
- [ ] Backup all assets (video, code, deck)
- [ ] Keep MVP running (don't shut down server!)

**During Judging Period:**
- [ ] Monitor server uptime
- [ ] Check for judge questions/comments
- [ ] Be responsive on Telegram
- [ ] Keep wallet funded (for demo if needed)

**After Results:**
- [ ] Thank organizers (win or lose)
- [ ] Share project on social media
- [ ] Continue development if interested
- [ ] Apply learnings to next project

---

## 🚨 Emergency Contacts

**Technical Issues:**
- VPS provider support
- Solana Discord (devnet issues)
- Superteam Indonesia Telegram

**Hackathon Questions:**
- Telegram: @Steven4293
- Superteam Earn support

**Deadline Extension:**
- Only contact if critical failure (server down, etc.)
- Have backup plan ready

---

**Remember: Quality > Perfection**

A complete, working submission beats a perfect but incomplete one. Focus on demonstrating core value clearly.

**Alhamdulillah, we can do this! Submit with confidence! 🚀**
