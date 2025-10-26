# Quick Start Guide - OpenBudget.ID

**Get up and running in 30 minutes!**

---

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Rust installed (`rustc --version`)
- [ ] Solana CLI installed (`solana --version`)
- [ ] Anchor CLI 0.29+ installed (`anchor --version`)
- [ ] PostgreSQL running locally OR Supabase account
- [ ] Git initialized (`git init` if needed)

---

## Step 1: Install Solana & Anchor (if not already)

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Add to PATH (add to ~/.zshrc or ~/.bashrc)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Verify
solana --version

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked --force

# Verify
anchor --version
```

---

## Step 2: Set Up Solana Devnet Wallet

```bash
# Create a devnet wallet (or use existing)
solana-keygen new -o ~/.config/solana/devnet-wallet.json

# Set CLI to use devnet
solana config set --url devnet

# Airdrop SOL for testing
solana airdrop 2

# Check balance
solana balance
```

---

## Step 3: Build & Deploy Solana Program

```bash
cd ~/local-dev/openbudget-garuda-spark/solana-program

# Build the program
anchor build

# Get Program ID
solana address -k target/deploy/openbudget-keypair.json

# Copy the Program ID, you'll need it for frontend env

# Run tests (optional)
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Save the deployment output!
```

**Important:** Copy the Program ID from the output. You'll use it in `.env.local` for the frontend.

---

## Step 4: Set Up Database

### Option A: Local PostgreSQL

```bash
# Create database
createdb openbudget

# Run migrations
psql -U postgres -d openbudget -f database/schema.sql

# Verify tables created
psql -U postgres -d openbudget -c "\dt"
```

### Option B: Supabase (Recommended for quick setup)

1. Go to https://supabase.com
2. Create new project: `openbudget`
3. Wait for provisioning (~2 minutes)
4. Go to SQL Editor
5. Copy contents of `database/schema.sql`
6. Paste and run
7. Copy connection string from Settings → Database

---

## Step 5: Configure Frontend

```bash
cd ~/local-dev/openbudget-garuda-spark/frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local
nano .env.local
```

**Fill in these values:**

```env
# Database - from Supabase or local PostgreSQL
DATABASE_URL=postgresql://user:password@host:5432/openbudget

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run: openssl rand -base64 32

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Solana (from Step 3)
NEXT_PUBLIC_SOLANA_PROGRAM_ID=<your-program-id>
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

---

## Step 6: Set Up Google OAuth

1. Go to https://console.cloud.google.com
2. Create new project: "OpenBudget"
3. Enable APIs: "Google+ API"
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://openbudget.rectorspace.com/api/auth/callback/google` (for production)
7. Copy Client ID and Client Secret to `.env.local`

---

## Step 7: Run Development Server

```bash
cd ~/local-dev/openbudget-garuda-spark/frontend

# Start dev server
npm run dev

# Open browser
open http://localhost:3000
```

**You should see:**
- Homepage with "OpenBudget.ID" title
- "View Projects" and "Ministry Login" buttons

---

## Step 8: Test Admin Flow

1. Click "Ministry Login"
2. Sign in with Google
3. (First time) Complete ministry setup
4. Create a test project:
   - Title: "Ekraf Creative Grant 2025"
   - Recipient: "PT Kreatif Nusantara"
   - Amount: 500000000 (500M IDR in smallest unit)
5. Click "Publish to Blockchain"
6. Connect Phantom/Solflare wallet
7. Sign transaction
8. ✅ Project created on-chain!

---

## Step 9: Verify On-Chain

```bash
# View project account
anchor account project <PROJECT_PDA_ADDRESS> --provider.cluster devnet

# Or use Solana Explorer
# Go to: https://explorer.solana.com/?cluster=devnet
# Paste transaction signature
```

---

## Troubleshooting

### "Anchor command not found"

```bash
# Add to PATH
export PATH="$HOME/.cargo/bin:$PATH"
source ~/.zshrc  # or ~/.bashrc
```

### "Program deploy failed: Insufficient funds"

```bash
# Airdrop more SOL
solana airdrop 2

# Check balance
solana balance
```

### "Database connection refused"

```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL
brew services restart postgresql@14  # macOS
sudo systemctl restart postgresql    # Linux
```

### "Next.js won't start"

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### "Wallet connection issues"

- Ensure Phantom wallet is installed
- Set wallet to Devnet (Settings → Developer Settings)
- Refresh page after connecting

---

## Next Steps

**Day 1 Complete? ✅**
- [ ] Solana program deployed
- [ ] Database set up
- [ ] Frontend running
- [ ] Can create project on-chain

**Ready for Day 2:**
- Build out admin dashboard
- Implement milestone release
- Create public project view

See `docs/TIMELINE.md` for detailed daily tasks!

---

## Quick Reference

**Key Commands:**

```bash
# Rebuild Solana program
cd solana-program && anchor build

# Redeploy
anchor deploy --provider.cluster devnet

# Run frontend
cd frontend && npm run dev

# Check Solana balance
solana balance

# View logs
anchor test --skip-build
```

**Key URLs:**
- Local dev: http://localhost:3000
- Solana Explorer: https://explorer.solana.com/?cluster=devnet
- Supabase Dashboard: https://app.supabase.com

---

**Alhamdulillah! You're ready to build! 🚀**

Need help? Check:
- `docs/IMPLEMENTATION-PLAN.md` - Technical details
- `docs/TIMELINE.md` - Daily sprint plan
- `README.md` - Full project overview
