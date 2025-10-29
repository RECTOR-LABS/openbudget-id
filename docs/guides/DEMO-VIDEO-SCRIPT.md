# Demo Video Script & Mock Data

**Target Duration**: 3-5 minutes

**Demo URL**: <https://openbudget.rectorspace.com>

---

## Pre-Recording Checklist

- [ ] Login to admin panel with Google OAuth
- [ ] Connect Phantom wallet (ensure sufficient devnet SOL)
- [ ] Clear browser cache for clean demo
- [ ] Test screen recording software
- [ ] Prepare tab with Solana Explorer open

---

## Demo Flow

### 1. Introduction (30 seconds)

**Talking Points:**

- "OpenBudget.ID adalah platform transparansi anggaran pemerintah berbasis blockchain Solana"
- "Kementerian mencatat milestone spending secara immutable, masyarakat bisa verifikasi real-time"
- "Saya akan demo sebagai admin Kementerian Kesehatan"

### 2. Admin Login & Dashboard (20 seconds)

**Actions:**

1. Navigate to <https://openbudget.rectorspace.com>
2. Click "Login untuk Admin Kementerian"
3. Login with Google OAuth
4. Show admin dashboard overview

**Talking Points:**

- "Dashboard menampilkan statistik proyek dan recent activity"
- "Saya akan membuat proyek baru untuk aplikasi E-Kesehatan"

### 3. Create New Project (60 seconds)

**Navigate to**: Admin Panel → Projects → Create New Project

**Copy-paste data:**

```
Title:
Pembangunan Aplikasi E-Kesehatan Nasional

Description:
Pengembangan platform digital terintegrasi untuk layanan kesehatan masyarakat, mencakup rekam medis elektronik, sistem antrian online, telemedicine, dan tracking distribusi obat. Platform ini akan meningkatkan efisiensi pelayanan kesehatan dan aksesibilitas bagi 270 juta penduduk Indonesia.

Ministry:
Kementerian Kesehatan

Total Budget:
85000000000

Category:
Teknologi Informasi
```

**Talking Points:**

- "Proyek ini untuk membangun platform E-Kesehatan dengan budget Rp 85 miliar"
- "Setelah draft dibuat, saya publish ke blockchain untuk transparansi"

### 4. Publish to Blockchain (40 seconds)

**Actions:**

1. Click "Publish to Blockchain"
2. Connect Phantom wallet if not connected
3. Approve transaction in Phantom
4. Wait for confirmation
5. Show transaction signature

**Talking Points:**

- "Dengan publish ke Solana blockchain, data proyek ini menjadi immutable"
- "Transaction signature ini adalah bukti bahwa data tersimpan permanent di blockchain"
- "Mari kita breakdown budget menjadi beberapa milestone"

### 5. Add Milestones (90 seconds)

**Navigate to**: Project Detail → Add Milestone

**Milestone 1:**

```
Description:
Analisis Kebutuhan dan Desain Sistem - Survey kebutuhan user, arsitektur sistem, dan UI/UX design

Amount:
15000000000

Target Date:
2025-12-31
```

**Milestone 2:**

```
Description:
Pengembangan Backend API dan Database - Infrastruktur server, REST API, dan integrasi dengan sistem rumah sakit existing

Amount:
25000000000

Target Date:
2026-03-31
```

**Milestone 3:**

```
Description:
Pengembangan Frontend Mobile & Web App - Aplikasi mobile (iOS/Android) dan dashboard web untuk pasien dan tenaga medis

Amount:
20000000000

Target Date:
2026-06-30
```

**Milestone 4:**

```
Description:
Testing, Security Audit, dan Deployment Nasional - Penetration testing, sertifikasi ISO 27001, training, dan rollout bertahap

Amount:
25000000000

Target Date:
2026-09-30
```

**Talking Points:**

- "Budget Rp 85 miliar saya breakdown menjadi 4 milestone sesuai tahapan development"
- "Milestone 1: Analisis dan desain - Rp 15 miliar"
- "Milestone 2: Backend development - Rp 25 miliar"
- "Milestone 3: Frontend mobile & web - Rp 20 miliar"
- "Milestone 4: Testing dan deployment nasional - Rp 25 miliar"
- "Setiap milestone butuh approval blockchain sebelum dana bisa dicairkan"

### 6. Release First Milestone (60 seconds)

**Actions:**

1. Click "Release Funds" on Milestone 1
2. Enter proof document URL
3. Sign transaction with wallet
4. Show confirmation

**Proof Document URL:**

```
https://drive.google.com/file/d/analisis-kebutuhan-ekesehatan-2025
```

**Talking Points:**

- "Milestone pertama sudah selesai, saya upload bukti laporan dan release dana"
- "Setiap release funds harus disertai proof document untuk accountability"
- "Transaksi ini juga tercatat permanent di blockchain"

### 7. Public Verification (40 seconds)

**Actions:**

1. Navigate to Public Homepage (logout or new incognito tab)
2. Search for "E-Kesehatan"
3. Click project card
4. Show project details with milestones
5. Click "View on Solana Explorer" for one transaction
6. Show Explorer page with transaction details

**Talking Points:**

- "Masyarakat bisa browse semua proyek tanpa login"
- "Setiap transaksi punya link ke Solana Explorer untuk verifikasi independen"
- "Data di blockchain tidak bisa diubah atau dihapus, ensuring full transparency"

### 8. Analytics Dashboard (30 seconds)

**Navigate to**: /analytics

**Talking Points:**

- "Platform juga menyediakan analytics untuk monitoring spending trends"
- "Leaderboard menampilkan ranking proyek berdasarkan trust score dan performance"
- "Anomaly detection otomatis mendeteksi suspicious spending patterns"

### 9. Closing (20 seconds)

**Talking Points:**

- "OpenBudget.ID membuktikan bahwa blockchain bisa meningkatkan transparansi pemerintah"
- "Platform ini built untuk Garuda Spark hackathon menggunakan Solana Agave 3.0"
- "Source code tersedia di GitHub, terima kasih!"

---

## Quick Reference - Budget Breakdown

| Milestone | Amount (Rp) | Percentage | Status |
|-----------|-------------|------------|--------|
| Milestone 1: Analisis & Desain | 15,000,000,000 | 17.6% | Ready to release |
| Milestone 2: Backend Development | 25,000,000,000 | 29.4% | Pending |
| Milestone 3: Frontend Development | 20,000,000,000 | 23.5% | Pending |
| Milestone 4: Testing & Deployment | 25,000,000,000 | 29.4% | Pending |
| **TOTAL** | **85,000,000,000** | **100%** | - |

---

## Technical Details (For Q&A)

**Tech Stack:**

- Blockchain: Solana Agave 3.0.7 (Rust 1.90.0 + Anchor 0.32.1)
- Frontend: Next.js 14 App Router + TypeScript
- Database: PostgreSQL 17.6
- Styling: Tailwind CSS
- Auth: NextAuth with Google OAuth
- Wallet: Phantom/Solflare via @solana/wallet-adapter

**Program ID:**

```
RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY
```

**Explorer Link:**

```
https://explorer.solana.com/address/RECtBgp43nvj5inPVW7qo1YN95RwXaYDxLX4dvuJXFY?cluster=devnet
```

**Network:** Solana Devnet

**Deployment:** Docker + VPS (rectorspace.com)

---

## Recording Tips

1. **Screen Resolution**: 1920x1080 for clarity
2. **Browser Zoom**: 100% or 110% for readability
3. **Close Unnecessary Tabs**: Keep only demo tabs open
4. **Disable Notifications**: Focus mode during recording
5. **Pre-fill Forms**: Have this document open on second monitor
6. **Practice Run**: Do 1-2 dry runs before final recording
7. **Wallet Ready**: Ensure 2-3 SOL in devnet wallet for transactions
8. **Audio Check**: Test microphone levels
9. **Background Music**: Optional soft background track
10. **Edit Points**: Natural breaks at each section for easier editing

---

## Backup Proof Document URLs

If you need variations for multiple releases:

```
https://drive.google.com/file/d/analisis-kebutuhan-ekesehatan-2025
https://drive.google.com/file/d/backend-api-development-q1-2026
https://drive.google.com/file/d/frontend-app-milestone-june2026
https://drive.google.com/file/d/deployment-security-audit-2026
```

---

## Post-Recording Checklist

- [ ] Export video in 1080p MP4
- [ ] Add title card with project name and tech stack
- [ ] Add captions/subtitles for accessibility
- [ ] Include GitHub repo link in description
- [ ] Upload to YouTube/platform
- [ ] Share link in hackathon submission

**Target Platforms:**

- Garuda Spark submission portal
- YouTube (public/unlisted)
- GitHub README
- LinkedIn showcase

---

**Last Updated**: 2025-10-29

**Demo Project**: OpenBudget.ID - Blockchain Transparency Platform

**Hackathon**: Garuda Spark 2025
