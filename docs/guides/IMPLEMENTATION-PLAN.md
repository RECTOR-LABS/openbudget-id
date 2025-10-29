# Technical Implementation Plan

**Project:** OpenBudget.ID
**Timeline:** 4 days
**Complexity:** Medium (MVP scope)
**Risk Level:** Low-Medium

---

## 🎯 MVP Scope Definition

### MUST HAVE (Core Demo)

✅ **Solana Program:**

- `initialize_project()` instruction
- `release_funds()` instruction
- Project and Milestone account structures
- Basic authority validation

✅ **Admin Dashboard:**

- Google OAuth login
- Create project form
- Wallet connection (one-time)
- Publish project to blockchain
- Release milestone button
- Transaction confirmation UI

✅ **Public Dashboard:**

- Homepage with key stats
- Projects list (grid view)
- Project detail page
- Milestone timeline
- "View on Solana Explorer" links
- Mobile responsive

✅ **Data Layer:**

- PostgreSQL schema
- API routes for CRUD
- Solana account reading
- Transaction signing flow

### NICE TO HAVE (If Time Permits)

- Analytics page with charts
- Advanced search/filters
- Ministry logos and branding
- Proof document upload (IPFS)
- Email notifications
- Activity log

### OUT OF SCOPE (Post-MVP)

- ❌ Recipient portal
- ❌ Auditor verification
- ❌ recSOL staking
- ❌ AI anomaly detection
- ❌ Multi-language support
- ❌ Advanced analytics

---

## 📐 Solana Program Architecture

### Program Structure

```
solana-program/
├── Anchor.toml
├── Cargo.toml
├── programs/
│   └── openbudget/
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs           (entry point)
│           ├── state.rs         (account structures)
│           ├── instructions/
│           │   ├── mod.rs
│           │   ├── initialize_project.rs
│           │   ├── add_milestone.rs
│           │   └── release_funds.rs
│           └── errors.rs        (custom errors)
└── tests/
    └── openbudget.ts
```

### Account Structures

```rust
// state.rs

#[account]
pub struct Project {
    pub authority: Pubkey,        // Ministry wallet
    pub id: String,               // UUID from frontend
    pub recipient: Pubkey,        // Recipient wallet (can be dummy for MVP)
    pub recipient_name: String,   // Human-readable name
    pub total_amount: u64,        // Total allocation in lamports
    pub status: ProjectStatus,    // Active, Completed, Cancelled
    pub milestone_count: u8,      // Number of milestones
    pub created_at: i64,          // Unix timestamp
    pub bump: u8,                 // PDA bump seed
}

impl Project {
    pub const MAX_ID_LEN: usize = 36;
    pub const MAX_NAME_LEN: usize = 100;

    pub const LEN: usize = 8 + // discriminator
        32 +                    // authority
        (4 + Self::MAX_ID_LEN) + // id
        32 +                    // recipient
        (4 + Self::MAX_NAME_LEN) + // recipient_name
        8 +                     // total_amount
        1 +                     // status
        1 +                     // milestone_count
        8 +                     // created_at
        1;                      // bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ProjectStatus {
    Draft,
    Active,
    Completed,
    Cancelled,
}

#[account]
pub struct Milestone {
    pub project: Pubkey,          // Parent project PDA
    pub index: u8,                // Milestone number (0-based)
    pub description: String,      // What this milestone is for
    pub amount: u64,              // Milestone amount in lamports
    pub is_released: bool,        // Has funds been released?
    pub release_tx: String,       // Transaction signature (set on release)
    pub proof_uri: String,        // IPFS or URL (set on release)
    pub released_at: i64,         // Release timestamp
    pub bump: u8,                 // PDA bump seed
}

impl Milestone {
    pub const MAX_DESC_LEN: usize = 200;
    pub const MAX_TX_LEN: usize = 88;
    pub const MAX_URI_LEN: usize = 200;

    pub const LEN: usize = 8 + // discriminator
        32 +                    // project
        1 +                     // index
        (4 + Self::MAX_DESC_LEN) + // description
        8 +                     // amount
        1 +                     // is_released
        (4 + Self::MAX_TX_LEN) + // release_tx
        (4 + Self::MAX_URI_LEN) + // proof_uri
        8 +                     // released_at
        1;                      // bump
}
```

### Instructions

#### 1. Initialize Project

```rust
// instructions/initialize_project.rs

pub fn initialize_project(
    ctx: Context<InitializeProject>,
    id: String,
    recipient: Pubkey,
    recipient_name: String,
    total_amount: u64,
) -> Result<()> {
    require!(id.len() <= Project::MAX_ID_LEN, ErrorCode::IdTooLong);
    require!(recipient_name.len() <= Project::MAX_NAME_LEN, ErrorCode::NameTooLong);
    require!(total_amount > 0, ErrorCode::InvalidAmount);

    let project = &mut ctx.accounts.project;
    project.authority = ctx.accounts.authority.key();
    project.id = id;
    project.recipient = recipient;
    project.recipient_name = recipient_name;
    project.total_amount = total_amount;
    project.status = ProjectStatus::Active;
    project.milestone_count = 0;
    project.created_at = Clock::get()?.unix_timestamp;
    project.bump = *ctx.bumps.get("project").unwrap();

    emit!(ProjectInitializedEvent {
        project: project.key(),
        authority: project.authority,
        total_amount: project.total_amount,
        timestamp: project.created_at,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(id: String)]
pub struct InitializeProject<'info> {
    #[account(
        init,
        payer = authority,
        space = Project::LEN,
        seeds = [b"project", id.as_bytes()],
        bump
    )]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
```

#### 2. Add Milestone (Optional for MVP)

```rust
// instructions/add_milestone.rs

pub fn add_milestone(
    ctx: Context<AddMilestone>,
    index: u8,
    description: String,
    amount: u64,
) -> Result<()> {
    require!(description.len() <= Milestone::MAX_DESC_LEN, ErrorCode::DescTooLong);
    require!(amount > 0, ErrorCode::InvalidAmount);

    let project = &mut ctx.accounts.project;
    require!(index == project.milestone_count, ErrorCode::InvalidMilestoneIndex);

    let milestone = &mut ctx.accounts.milestone;
    milestone.project = project.key();
    milestone.index = index;
    milestone.description = description;
    milestone.amount = amount;
    milestone.is_released = false;
    milestone.release_tx = String::new();
    milestone.proof_uri = String::new();
    milestone.released_at = 0;
    milestone.bump = *ctx.bumps.get("milestone").unwrap();

    project.milestone_count += 1;

    emit!(MilestoneAddedEvent {
        project: project.key(),
        milestone: milestone.key(),
        index: milestone.index,
        amount: milestone.amount,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(index: u8)]
pub struct AddMilestone<'info> {
    #[account(
        mut,
        has_one = authority,
        constraint = project.status == ProjectStatus::Active @ ErrorCode::ProjectNotActive
    )]
    pub project: Account<'info, Project>,

    #[account(
        init,
        payer = authority,
        space = Milestone::LEN,
        seeds = [b"milestone", project.key().as_ref(), &[index]],
        bump
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
```

#### 3. Release Funds

```rust
// instructions/release_funds.rs

pub fn release_funds(
    ctx: Context<ReleaseFunds>,
    milestone_index: u8,
    proof_uri: String,
) -> Result<()> {
    require!(proof_uri.len() <= Milestone::MAX_URI_LEN, ErrorCode::UriTooLong);

    let milestone = &mut ctx.accounts.milestone;
    require!(!milestone.is_released, ErrorCode::AlreadyReleased);
    require!(milestone.index == milestone_index, ErrorCode::InvalidMilestoneIndex);

    let clock = Clock::get()?;
    milestone.is_released = true;
    milestone.proof_uri = proof_uri;
    milestone.released_at = clock.unix_timestamp;
    // Note: release_tx is set by frontend after confirmation

    emit!(FundsReleasedEvent {
        project: milestone.project,
        milestone: milestone.key(),
        amount: milestone.amount,
        proof_uri: milestone.proof_uri.clone(),
        timestamp: milestone.released_at,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(milestone_index: u8)]
pub struct ReleaseFunds<'info> {
    #[account(
        has_one = authority,
        constraint = project.status == ProjectStatus::Active @ ErrorCode::ProjectNotActive
    )]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [b"milestone", project.key().as_ref(), &[milestone_index]],
        bump = milestone.bump,
        constraint = milestone.project == project.key() @ ErrorCode::InvalidMilestone
    )]
    pub milestone: Account<'info, Milestone>,

    pub authority: Signer<'info>,
}
```

### Events

```rust
// lib.rs

#[event]
pub struct ProjectInitializedEvent {
    pub project: Pubkey,
    pub authority: Pubkey,
    pub total_amount: u64,
    pub timestamp: i64,
}

#[event]
pub struct MilestoneAddedEvent {
    pub project: Pubkey,
    pub milestone: Pubkey,
    pub index: u8,
    pub amount: u64,
}

#[event]
pub struct FundsReleasedEvent {
    pub project: Pubkey,
    pub milestone: Pubkey,
    pub amount: u64,
    pub proof_uri: String,
    pub timestamp: i64,
}
```

### Error Codes

```rust
// errors.rs

#[error_code]
pub enum ErrorCode {
    #[msg("Project ID is too long")]
    IdTooLong,

    #[msg("Recipient name is too long")]
    NameTooLong,

    #[msg("Description is too long")]
    DescTooLong,

    #[msg("URI is too long")]
    UriTooLong,

    #[msg("Amount must be greater than zero")]
    InvalidAmount,

    #[msg("Project is not active")]
    ProjectNotActive,

    #[msg("Milestone already released")]
    AlreadyReleased,

    #[msg("Invalid milestone index")]
    InvalidMilestoneIndex,

    #[msg("Invalid milestone")]
    InvalidMilestone,
}
```

---

## 🎨 Frontend Architecture

### Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              (public homepage)
│   │   ├── projects/
│   │   │   ├── page.tsx          (projects list)
│   │   │   └── [id]/
│   │   │       └── page.tsx      (project detail)
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx          (login)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── projects/
│   │   │       ├── new/
│   │   │       │   └── page.tsx
│   │   │       └── [id]/
│   │   │           └── edit/
│   │   │               └── page.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts
│   │       └── projects/
│   │           ├── route.ts
│   │           └── [id]/
│   │               ├── route.ts
│   │               └── milestones/
│   │                   └── route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── project/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   └── MilestoneTimeline.tsx
│   │   ├── admin/
│   │   │   ├── CreateProjectForm.tsx
│   │   │   ├── ReleaseMilestoneModal.tsx
│   │   │   └── WalletConnectPrompt.tsx
│   │   └── ui/ (shadcn components)
│   ├── lib/
│   │   ├── solana/
│   │   │   ├── program.ts        (Anchor client)
│   │   │   ├── utils.ts          (helpers)
│   │   │   └── types.ts          (TS types matching Rust)
│   │   ├── db/
│   │   │   └── client.ts         (Supabase or Prisma)
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── useProjects.ts
│   │   ├── useSolanaProgram.ts
│   │   └── useWallet.ts
│   └── types/
│       └── index.ts
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

### Key Components

#### Solana Program Client

```typescript
// lib/solana/program.ts

import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { Openbudget } from './idl'
import idl from './idl.json'

const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID!)

export class OpenBudgetProgram {
  program: Program<Openbudget>
  connection: Connection

  constructor(wallet: anchor.Wallet) {
    this.connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
      'confirmed'
    )

    const provider = new anchor.AnchorProvider(
      this.connection,
      wallet,
      { commitment: 'confirmed' }
    )

    this.program = new Program<Openbudget>(
      idl as Openbudget,
      PROGRAM_ID,
      provider
    )
  }

  async initializeProject(
    id: string,
    recipient: PublicKey,
    recipientName: string,
    totalAmount: number
  ) {
    const [projectPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('project'), Buffer.from(id)],
      this.program.programId
    )

    const tx = await this.program.methods
      .initializeProject(id, recipient, recipientName, new anchor.BN(totalAmount))
      .accounts({
        project: projectPDA,
        authority: this.program.provider.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    return { signature: tx, projectPDA }
  }

  async releaseFunds(
    projectId: string,
    milestoneIndex: number,
    proofUri: string
  ) {
    const [projectPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('project'), Buffer.from(projectId)],
      this.program.programId
    )

    const [milestonePDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('milestone'), projectPDA.toBuffer(), Buffer.from([milestoneIndex])],
      this.program.programId
    )

    const tx = await this.program.methods
      .releaseFunds(milestoneIndex, proofUri)
      .accounts({
        project: projectPDA,
        milestone: milestonePDA,
        authority: this.program.provider.publicKey,
      })
      .rpc()

    return { signature: tx, milestonePDA }
  }

  async getProject(projectId: string) {
    const [projectPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from('project'), Buffer.from(projectId)],
      this.program.programId
    )

    return await this.program.account.project.fetch(projectPDA)
  }
}
```

#### Create Project Form

```typescript
// components/admin/CreateProjectForm.tsx

'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { OpenBudgetProgram } from '@/lib/solana/program'

export function CreateProjectForm() {
  const wallet = useWallet()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    recipientName: '',
    totalAmount: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!wallet.publicKey || !wallet.signTransaction) {
      alert('Please connect your wallet')
      return
    }

    setLoading(true)

    try {
      // 1. Save to database first (gets UUID)
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const { id: projectId } = await response.json()

      // 2. Publish to blockchain
      const program = new OpenBudgetProgram(wallet as any)
      const { signature, projectPDA } = await program.initializeProject(
        projectId,
        new PublicKey('11111111111111111111111111111111'), // Dummy for MVP
        formData.recipientName,
        parseFloat(formData.totalAmount) * 1_000_000_000 // Convert to lamports
      )

      // 3. Update database with blockchain references
      await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solana_account: projectPDA.toString(),
          creation_tx: signature,
          status: 'published',
        }),
      })

      alert('Project published to blockchain!')
      // Redirect to project detail

    } catch (error) {
      console.error(error)
      alert('Failed to create project: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form fields */}
    </form>
  )
}
```

---

## 🗄️ Database Schema

```sql
-- database/schema.sql

CREATE TABLE ministry_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    ministry_name VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(88),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ministry_id UUID REFERENCES ministry_accounts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    recipient_name VARCHAR(255) NOT NULL,
    recipient_type VARCHAR(50),
    total_amount BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    solana_account VARCHAR(88),
    creation_tx VARCHAR(88),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    index INT NOT NULL,
    description TEXT,
    amount BIGINT NOT NULL,
    is_released BOOLEAN DEFAULT FALSE,
    release_tx VARCHAR(88),
    proof_url TEXT,
    released_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, index)
);

CREATE INDEX idx_projects_ministry ON projects(ministry_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_milestones_project ON milestones(project_id);
```

---

## 🚀 Deployment Checklist

### Day 1 Evening

- [ ] Solana program compiled
- [ ] Program deployed to devnet
- [ ] Program ID saved
- [ ] Test transactions confirmed

### Day 2 Evening

- [ ] Database created
- [ ] NextAuth configured
- [ ] Admin dashboard functional
- [ ] Can create project on-chain

### Day 3 Evening

- [ ] Public dashboard live
- [ ] Can verify on Solana Explorer
- [ ] Responsive on mobile

### Day 4

- [ ] Deploy to VPS
- [ ] Configure domain
- [ ] SSL certificate
- [ ] Demo video recorded
- [ ] Submission completed

---

**This plan is aggressive but achievable. Focus on critical path, cut features if needed. Bismillah! 🚀**
