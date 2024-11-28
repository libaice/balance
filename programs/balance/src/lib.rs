use anchor_lang::prelude::*;

declare_id!("vixF6x1vJt5X3BhFCtUiWxrTpJhmRsvFaJWyqKU1Hmh");

#[program]
pub mod balance {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
