# PRD: Epic 1 - Blockchain Infrastructure

**Epic ID:** EPIC-01
**Epic Owner:** RECTOR
**Target Timeline:** Day 1 (8 hours)
**Dependencies:** None (foundational epic)
**Status:** Not Started

---

## Epic Overview

Build the core Solana blockchain infrastructure that serves as the immutable source of truth for OpenBudget.ID. This includes defining on-chain data structures (Project and Milestone accounts), implementing Anchor instructions for initialization, milestone management, and fund release, and ensuring robust validation and error handling.

**Success Criteria:**
- All Solana accounts (Project, Milestone, PlatformState) defined with correct data layouts
- All 4 core instructions implemented and tested (`initialize_platform`, `initialize_project`, `add_milestone`, `release_funds`)
- Anchor tests pass with 100% coverage of happy paths and critical edge cases
- Program deployed to Solana devnet with stable Program ID

**Technical Foundation:**
- Anchor Framework 0.29.0
- Rust (latest stable)
- Solana devnet

---

## Story 1.1: Define On-Chain Account Structures

**Story ID:** STORY-1.1
**Priority:** Critical
**Estimated Effort:** 2 hours

### Description
Define the Rust structs for all on-chain accounts (Project, Milestone, PlatformState) with proper serialization, space allocation, and PDA seed patterns. These accounts form the immutable ledger of spending records.

### Acceptance Criteria
- [ ] `PlatformState` account defined with `admin` pubkey and `project_count` counter
- [ ] `Project` account defined with all fields (id, title, ministry, budget, milestones, timestamps, authority)
- [ ] `Milestone` account defined with fields (description, amount, release status, timestamps, proof URL, transaction hash)
- [ ] All accounts use `#[account]` macro with proper space calculations
- [ ] PDA seeds documented for each account type (`[b"platform"]`, `[b"project", id.as_bytes()]`)
- [ ] Account space calculations include discriminator (8 bytes) + all field sizes
- [ ] Serialization/deserialization works correctly (validate with unit tests)

### Tasks

#### Task 1.1.1: Create `state.rs` with PlatformState account
**Technical Details:**
```rust
// solana-program/openbudget/programs/openbudget/src/state.rs

use anchor_lang::prelude::*;

#[account]
pub struct PlatformState {
    pub admin: Pubkey,           // 32 bytes
    pub project_count: u64,      // 8 bytes
}

impl PlatformState {
    pub const LEN: usize = 8 + 32 + 8; // discriminator + pubkey + u64
}
```
**Acceptance:**
- Struct compiles without errors
- Space calculation correct (48 bytes)
- PDA seed pattern: `[b"platform"]`

---

#### Task 1.1.2: Define Project account structure
**Technical Details:**
```rust
#[account]
pub struct Project {
    pub id: String,              // 4 + 32 = 36 bytes (String max 32 chars)
    pub title: String,           // 4 + 100 = 104 bytes
    pub ministry: String,        // 4 + 50 = 54 bytes
    pub total_budget: u64,       // 8 bytes
    pub total_released: u64,     // 8 bytes
    pub milestone_count: u8,     // 1 byte
    pub created_at: i64,         // 8 bytes (Unix timestamp)
    pub authority: Pubkey,       // 32 bytes (ministry wallet)
}

impl Project {
    pub const LEN: usize = 8 + 36 + 104 + 54 + 8 + 8 + 1 + 8 + 32; // 259 bytes
}
```
**Acceptance:**
- All fields align with database schema
- PDA seed pattern: `[b"project", id.as_bytes()]`
- Authority field enables access control

---

#### Task 1.1.3: Define Milestone account structure
**Technical Details:**
```rust
#[account]
pub struct Milestone {
    pub project_id: String,      // 4 + 32 = 36 bytes
    pub index: u8,               // 1 byte (milestone number within project)
    pub description: String,     // 4 + 200 = 204 bytes
    pub amount: u64,             // 8 bytes
    pub is_released: bool,       // 1 byte
    pub released_at: Option<i64>, // 1 + 8 = 9 bytes
    pub proof_url: String,       // 4 + 200 = 204 bytes (IPFS or cloud URL)
}

impl Milestone {
    pub const LEN: usize = 8 + 36 + 1 + 204 + 8 + 1 + 9 + 204; // 471 bytes
}
```
**Acceptance:**
- PDA seed pattern: `[b"milestone", project_id.as_bytes(), &[index]]`
- `is_released` flag prevents double-spending
- Timestamps capture release history

---

## Story 1.2: Implement Platform Initialization

**Story ID:** STORY-1.2
**Priority:** Critical
**Estimated Effort:** 1 hour

### Description
Create the `initialize_platform` instruction that sets up the global PlatformState account. This is a one-time setup executed by the program admin.

### Acceptance Criteria
- [ ] Instruction initializes PlatformState PDA with admin pubkey
- [ ] Only callable once (subsequent calls fail)
- [ ] Project count starts at 0
- [ ] Anchor test validates initialization and re-initialization failure

### Tasks

#### Task 1.2.1: Create `initialize_platform` instruction
**Technical Details:**
```rust
// solana-program/openbudget/programs/openbudget/src/instructions/initialize_platform.rs

use anchor_lang::prelude::*;
use crate::state::PlatformState;

#[derive(Accounts)]
pub struct InitializePlatform<'info> {
    #[account(
        init,
        payer = admin,
        space = PlatformState::LEN,
        seeds = [b"platform"],
        bump
    )]
    pub platform_state: Account<'info, PlatformState>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializePlatform>) -> Result<()> {
    let platform_state = &mut ctx.accounts.platform_state;
    platform_state.admin = ctx.accounts.admin.key();
    platform_state.project_count = 0;

    msg!("Platform initialized by admin: {}", platform_state.admin);
    Ok(())
}
```
**Acceptance:**
- `init` constraint prevents re-initialization
- Admin pays rent for account
- Event log emitted

---

#### Task 1.2.2: Wire instruction into lib.rs
**Technical Details:**
```rust
// solana-program/openbudget/programs/openbudget/src/lib.rs

pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("YOUR_PROGRAM_ID_HERE"); // Update after first deploy

#[program]
pub mod openbudget {
    use super::*;

    pub fn initialize_platform(ctx: Context<InitializePlatform>) -> Result<()> {
        instructions::initialize_platform::handler(ctx)
    }
}
```
**Acceptance:**
- Instruction callable via Anchor client
- Program compiles successfully

---

#### Task 1.2.3: Write Anchor test for platform initialization
**Technical Details:**
```typescript
// solana-program/openbudget/tests/openbudget.ts

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Openbudget } from "../target/types/openbudget";
import { expect } from "chai";

describe("Platform Initialization", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Openbudget as Program<Openbudget>;

  it("Initializes platform state", async () => {
    const [platformPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );

    await program.methods
      .initializePlatform()
      .accounts({
        platformState: platformPda,
        admin: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const platformState = await program.account.platformState.fetch(platformPda);
    expect(platformState.admin.toString()).to.equal(provider.wallet.publicKey.toString());
    expect(platformState.projectCount.toNumber()).to.equal(0);
  });

  it("Fails to re-initialize platform", async () => {
    const [platformPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      program.programId
    );

    try {
      await program.methods.initializePlatform()
        .accounts({ platformState: platformPda })
        .rpc();
      expect.fail("Should have thrown error");
    } catch (err) {
      expect(err.message).to.include("already in use");
    }
  });
});
```
**Acceptance:**
- Both tests pass
- Coverage for happy path and error case

---

## Story 1.3: Implement Project Creation

**Story ID:** STORY-1.3
**Priority:** Critical
**Estimated Effort:** 2 hours

### Description
Create the `initialize_project` instruction that allows ministries to publish budget projects on-chain. This generates the immutable spending record that citizens can verify.

### Acceptance Criteria
- [ ] Instruction creates Project PDA with ministry-provided data
- [ ] Project ID uniqueness enforced (PDA constraint)
- [ ] Platform project counter incremented atomically
- [ ] Ministry wallet becomes project authority (only they can release funds)
- [ ] Input validation (title length, budget > 0, etc.)
- [ ] Anchor tests validate creation and duplicate prevention

### Tasks

#### Task 1.3.1: Create `initialize_project` instruction
**Technical Details:**
```rust
// solana-program/openbudget/programs/openbudget/src/instructions/initialize_project.rs

use anchor_lang::prelude::*;
use crate::state::{PlatformState, Project};

#[derive(Accounts)]
#[instruction(project_id: String)]
pub struct InitializeProject<'info> {
    #[account(
        init,
        payer = authority,
        space = Project::LEN,
        seeds = [b"project", project_id.as_bytes()],
        bump
    )]
    pub project: Account<'info, Project>,

    #[account(
        mut,
        seeds = [b"platform"],
        bump
    )]
    pub platform_state: Account<'info, PlatformState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<InitializeProject>,
    project_id: String,
    title: String,
    ministry: String,
    total_budget: u64,
) -> Result<()> {
    require!(project_id.len() <= 32, ErrorCode::ProjectIdTooLong);
    require!(title.len() > 0 && title.len() <= 100, ErrorCode::InvalidTitle);
    require!(total_budget > 0, ErrorCode::InvalidBudget);

    let project = &mut ctx.accounts.project;
    project.id = project_id;
    project.title = title;
    project.ministry = ministry;
    project.total_budget = total_budget;
    project.total_released = 0;
    project.milestone_count = 0;
    project.created_at = Clock::get()?.unix_timestamp;
    project.authority = ctx.accounts.authority.key();

    let platform_state = &mut ctx.accounts.platform_state;
    platform_state.project_count = platform_state.project_count.checked_add(1).unwrap();

    msg!("Project created: {} by {}", project.id, project.authority);
    Ok(())
}
```
**Acceptance:**
- All validations enforced
- Atomic counter increment
- Authority stored for access control

---

#### Task 1.3.2: Define error codes in lib.rs
**Technical Details:**
```rust
// In lib.rs

#[error_code]
pub enum ErrorCode {
    #[msg("Project ID must be 32 characters or less")]
    ProjectIdTooLong,

    #[msg("Title must be between 1 and 100 characters")]
    InvalidTitle,

    #[msg("Budget must be greater than 0")]
    InvalidBudget,

    #[msg("Milestone amount exceeds remaining budget")]
    InsufficientBudget,

    #[msg("Only project authority can perform this action")]
    UnauthorizedAccess,

    #[msg("Milestone already released")]
    MilestoneAlreadyReleased,
}
```
**Acceptance:**
- Error messages clear and actionable
- Cover all validation scenarios

---

#### Task 1.3.3: Write tests for project creation
**Technical Details:**
```typescript
describe("Project Creation", () => {
  it("Creates a project successfully", async () => {
    const projectId = "KEMENKES-2025-001";
    const [projectPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("project"), Buffer.from(projectId)],
      program.programId
    );

    await program.methods
      .initializeProject(
        projectId,
        "Rural Health Clinic Construction",
        "Ministry of Health",
        new anchor.BN(5_000_000_000) // 5 billion IDR
      )
      .accounts({
        project: projectPda,
        platformState: platformPda,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const project = await program.account.project.fetch(projectPda);
    expect(project.id).to.equal(projectId);
    expect(project.totalBudget.toNumber()).to.equal(5_000_000_000);
    expect(project.milestoneCount).to.equal(0);
  });

  it("Prevents duplicate project IDs", async () => {
    const projectId = "KEMENKES-2025-001"; // Already created above
    // Attempt to create again should fail due to PDA already initialized
  });

  it("Validates input constraints", async () => {
    // Test empty title, budget = 0, project_id > 32 chars
  });
});
```

---

## Story 1.4: Implement Milestone Management

**Story ID:** STORY-1.4
**Priority:** Critical
**Estimated Effort:** 2 hours

### Description
Create `add_milestone` and `release_funds` instructions to manage spending milestones within projects. This forms the core spending transparency mechanism.

### Acceptance Criteria
- [ ] `add_milestone` creates Milestone PDA linked to Project
- [ ] Milestone amounts validated against project budget
- [ ] Project milestone counter incremented
- [ ] `release_funds` marks milestone as released (one-way operation)
- [ ] Only project authority can add/release milestones
- [ ] Timestamps recorded for auditability
- [ ] Comprehensive tests for both instructions

### Tasks

#### Task 1.4.1: Implement `add_milestone` instruction
**Technical Details:**
```rust
// solana-program/openbudget/programs/openbudget/src/instructions/add_milestone.rs

use anchor_lang::prelude::*;
use crate::state::{Project, Milestone};

#[derive(Accounts)]
#[instruction(project_id: String, index: u8)]
pub struct AddMilestone<'info> {
    #[account(
        init,
        payer = authority,
        space = Milestone::LEN,
        seeds = [b"milestone", project_id.as_bytes(), &[index]],
        bump
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(
        mut,
        seeds = [b"project", project_id.as_bytes()],
        bump,
        constraint = project.authority == authority.key() @ ErrorCode::UnauthorizedAccess
    )]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<AddMilestone>,
    project_id: String,
    index: u8,
    description: String,
    amount: u64,
) -> Result<()> {
    require!(description.len() > 0, ErrorCode::InvalidTitle);
    require!(amount > 0, ErrorCode::InvalidBudget);

    let project = &mut ctx.accounts.project;
    let new_released = project.total_released.checked_add(amount).unwrap();
    require!(new_released <= project.total_budget, ErrorCode::InsufficientBudget);

    let milestone = &mut ctx.accounts.milestone;
    milestone.project_id = project_id;
    milestone.index = index;
    milestone.description = description;
    milestone.amount = amount;
    milestone.is_released = false;
    milestone.released_at = None;
    milestone.proof_url = String::new();

    project.milestone_count = project.milestone_count.checked_add(1).unwrap();

    msg!("Milestone {} added to project {}", index, milestone.project_id);
    Ok(())
}
```

---

#### Task 1.4.2: Implement `release_funds` instruction
**Technical Details:**
```rust
// solana-program/openbudget/programs/openbudget/src/instructions/release_funds.rs

use anchor_lang::prelude::*;
use crate::state::{Project, Milestone};

#[derive(Accounts)]
#[instruction(project_id: String, index: u8)]
pub struct ReleaseFunds<'info> {
    #[account(
        mut,
        seeds = [b"milestone", project_id.as_bytes(), &[index]],
        bump,
        constraint = !milestone.is_released @ ErrorCode::MilestoneAlreadyReleased
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(
        mut,
        seeds = [b"project", project_id.as_bytes()],
        bump,
        constraint = project.authority == authority.key() @ ErrorCode::UnauthorizedAccess
    )]
    pub project: Account<'info, Project>,

    pub authority: Signer<'info>,
}

pub fn handler(
    ctx: Context<ReleaseFunds>,
    _project_id: String,
    _index: u8,
    proof_url: String,
) -> Result<()> {
    let milestone = &mut ctx.accounts.milestone;
    let project = &mut ctx.accounts.project;

    milestone.is_released = true;
    milestone.released_at = Some(Clock::get()?.unix_timestamp);
    milestone.proof_url = proof_url;

    project.total_released = project.total_released.checked_add(milestone.amount).unwrap();

    msg!("Funds released for milestone {} of project {}", milestone.index, milestone.project_id);
    Ok(())
}
```

---

#### Task 1.4.3: Write comprehensive tests
**Technical Details:**
```typescript
describe("Milestone Management", () => {
  it("Adds milestone to project", async () => {
    // Test milestone creation with valid data
  });

  it("Prevents exceeding budget", async () => {
    // Add milestones totaling more than project budget
    // Should fail with InsufficientBudget error
  });

  it("Releases milestone funds", async () => {
    // Release a milestone with proof URL
    // Verify is_released = true, timestamp set
  });

  it("Prevents double-release", async () => {
    // Attempt to release same milestone twice
    // Should fail with MilestoneAlreadyReleased
  });

  it("Enforces authority check", async () => {
    // Try to release milestone with different wallet
    // Should fail with UnauthorizedAccess
  });
});
```

---

## Story 1.5: Deploy and Validate

**Story ID:** STORY-1.5
**Priority:** Critical
**Estimated Effort:** 1 hour

### Description
Deploy the program to Solana devnet, synchronize Program ID across codebase, and perform end-to-end validation.

### Acceptance Criteria
- [ ] Program deploys successfully to devnet
- [ ] Program ID updated in 3 locations (Anchor.toml, lib.rs, frontend .env)
- [ ] All Anchor tests pass on deployed program
- [ ] Solana Explorer shows program and test transactions
- [ ] Program upgrade authority configured

### Tasks

#### Task 1.5.1: Initial deployment to devnet
**Commands:**
```bash
cd solana-program/openbudget
anchor build
anchor deploy --provider.cluster devnet
```
**Acceptance:**
- Deployment succeeds without errors
- Note Program ID from output

---

#### Task 1.5.2: Synchronize Program ID across codebase
**File Updates:**
1. `solana-program/openbudget/Anchor.toml`:
   ```toml
   [programs.devnet]
   openbudget = "YOUR_PROGRAM_ID"
   ```

2. `solana-program/openbudget/programs/openbudget/src/lib.rs`:
   ```rust
   declare_id!("YOUR_PROGRAM_ID");
   ```

3. `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_SOLANA_PROGRAM_ID=YOUR_PROGRAM_ID
   ```

**After updates:**
```bash
anchor build  # Rebuild with new Program ID
anchor deploy --provider.cluster devnet  # Redeploy
```

---

#### Task 1.5.3: Run full test suite
**Commands:**
```bash
anchor test --skip-local-validator  # Use devnet
```
**Acceptance:**
- All tests pass
- View transactions in Solana Explorer (devnet)

---

## Technical Dependencies

**Tools Required:**
- Rust 1.75+ with wasm32 target
- Solana CLI 1.18+
- Anchor CLI 0.29.0
- Node.js 18+ (for TypeScript tests)

**Pre-requisites:**
- Solana wallet with devnet SOL (airdrop via `solana airdrop 2`)
- Anchor initialized project structure

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Program ID sync failure | High - transactions fail | Automated script to verify 3-location match |
| PDA seed mismatch (Rust vs TS) | High - account not found | Document seed patterns, unit test PDA derivation |
| Insufficient rent calculation | Medium - deployment fails | Use `anchor build` warnings, add 10% buffer |
| Devnet RPC rate limits | Low - test failures | Use local validator for rapid testing |

---

## Definition of Done

- [ ] All 5 stories completed with passing acceptance criteria
- [ ] 15+ Anchor tests passing (initialization, creation, milestones, errors)
- [ ] Program deployed to devnet with stable Program ID
- [ ] Program ID synchronized in Anchor.toml, lib.rs, frontend/.env.local
- [ ] Code reviewed for Solana best practices (CPI security, PDA seeds, rent exemption)
- [ ] Documentation updated with Program ID and deployment steps
- [ ] Ready for integration with Epic 2 (Database & API)
