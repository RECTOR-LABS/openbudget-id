use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("3UuSu7oTs2Z6YuPnSuYcvr65nkV3PqDzF1qzxeiZVnjJ");

#[program]
pub mod openbudget {
    use super::*;

    pub fn initialize_platform(ctx: Context<InitializePlatform>) -> Result<()> {
        instructions::initialize_platform::handler(ctx)
    }

    pub fn initialize_project(
        ctx: Context<InitializeProject>,
        project_id: String,
        title: String,
        ministry: String,
        total_budget: u64,
    ) -> Result<()> {
        instructions::initialize_project::handler(ctx, project_id, title, ministry, total_budget)
    }

    pub fn add_milestone(
        ctx: Context<AddMilestone>,
        project_id: String,
        index: u8,
        description: String,
        amount: u64,
    ) -> Result<()> {
        instructions::add_milestone::handler(ctx, project_id, index, description, amount)
    }

    pub fn release_funds(
        ctx: Context<ReleaseFunds>,
        project_id: String,
        index: u8,
        proof_url: String,
    ) -> Result<()> {
        instructions::release_funds::handler(ctx, project_id, index, proof_url)
    }
}

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
