use anchor_lang::prelude::*;

/// Global platform state - manages admin and project counter
/// PDA seed: [b"platform"]
#[account]
pub struct PlatformState {
    pub admin: Pubkey,           // 32 bytes - platform administrator
    pub project_count: u64,      // 8 bytes - total projects created
}

impl PlatformState {
    pub const LEN: usize = 8 + 32 + 8; // discriminator + admin + project_count = 48 bytes
}

/// Project account - represents a government spending project
/// PDA seed: [b"project", project_id.as_bytes()]
#[account]
pub struct Project {
    pub id: String,              // 4 + 32 = 36 bytes (max 32 chars)
    pub title: String,           // 4 + 100 = 104 bytes (max 100 chars)
    pub ministry: String,        // 4 + 50 = 54 bytes (max 50 chars)
    pub total_budget: u64,       // 8 bytes - total allocated budget
    pub total_allocated: u64,    // 8 bytes - total milestone amounts (regardless of release status)
    pub total_released: u64,     // 8 bytes - total funds actually released
    pub milestone_count: u8,     // 1 byte - number of milestones
    pub created_at: i64,         // 8 bytes - Unix timestamp
    pub authority: Pubkey,       // 32 bytes - ministry wallet (only they can release funds)
}

impl Project {
    pub const LEN: usize = 8 + 36 + 104 + 54 + 8 + 8 + 8 + 1 + 8 + 32; // 267 bytes
}

/// Milestone account - represents a spending milestone within a project
/// PDA seed: [b"milestone", project_id.as_bytes(), &[index]]
#[account]
pub struct Milestone {
    pub project_id: String,      // 4 + 32 = 36 bytes
    pub index: u8,               // 1 byte - milestone number (0, 1, 2, ...)
    pub description: String,     // 4 + 200 = 204 bytes (max 200 chars)
    pub amount: u64,             // 8 bytes - milestone budget amount
    pub is_released: bool,       // 1 byte - whether funds have been released
    pub released_at: Option<i64>, // 1 + 8 = 9 bytes - timestamp when released (None if not released)
    pub proof_url: String,       // 4 + 200 = 204 bytes - URL to proof document (IPFS or cloud)
}

impl Milestone {
    pub const LEN: usize = 8 + 36 + 1 + 204 + 8 + 1 + 9 + 204; // 471 bytes
}
