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
