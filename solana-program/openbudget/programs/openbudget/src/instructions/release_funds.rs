use anchor_lang::prelude::*;
use crate::state::{Project, Milestone};
use crate::ErrorCode;

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

    // Mark milestone as released
    milestone.is_released = true;
    milestone.released_at = Some(Clock::get()?.unix_timestamp);
    milestone.proof_url = proof_url;

    // Update project's total released amount
    project.total_released = project.total_released.checked_add(milestone.amount).unwrap();

    msg!(
        "Funds released for milestone {} of project {} (amount: {})",
        milestone.index,
        milestone.project_id,
        milestone.amount
    );
    Ok(())
}
