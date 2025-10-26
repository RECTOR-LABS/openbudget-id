use anchor_lang::prelude::*;
use crate::state::{Project, Milestone};
use crate::ErrorCode;

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

    // Check if total allocated + new milestone amount would exceed budget
    let new_allocated = project.total_allocated.checked_add(amount).unwrap();
    require!(new_allocated <= project.total_budget, ErrorCode::InsufficientBudget);

    let milestone = &mut ctx.accounts.milestone;
    milestone.project_id = project_id;
    milestone.index = index;
    milestone.description = description;
    milestone.amount = amount;
    milestone.is_released = false;
    milestone.released_at = None;
    milestone.proof_url = String::new();

    project.milestone_count = project.milestone_count.checked_add(1).unwrap();
    project.total_allocated = new_allocated;

    msg!("Milestone {} added to project {}", index, milestone.project_id);
    Ok(())
}
