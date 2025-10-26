use anchor_lang::prelude::*;
use crate::state::{PlatformState, Project};
use crate::ErrorCode;

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
    // Input validation
    require!(project_id.len() <= 32, ErrorCode::ProjectIdTooLong);
    require!(title.len() > 0 && title.len() <= 100, ErrorCode::InvalidTitle);
    require!(total_budget > 0, ErrorCode::InvalidBudget);

    let project = &mut ctx.accounts.project;
    project.id = project_id;
    project.title = title;
    project.ministry = ministry;
    project.total_budget = total_budget;
    project.total_allocated = 0;
    project.total_released = 0;
    project.milestone_count = 0;
    project.created_at = Clock::get()?.unix_timestamp;
    project.authority = ctx.accounts.authority.key();

    // Increment platform project counter
    let platform_state = &mut ctx.accounts.platform_state;
    platform_state.project_count = platform_state.project_count.checked_add(1).unwrap();

    msg!("Project created: {} by {}", project.id, project.authority);
    Ok(())
}
