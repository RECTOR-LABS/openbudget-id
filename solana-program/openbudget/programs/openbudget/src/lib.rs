use anchor_lang::prelude::*;

declare_id!("3UuSu7oTs2Z6YuPnSuYcvr65nkV3PqDzF1qzxeiZVnjJ");

#[program]
pub mod openbudget {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
