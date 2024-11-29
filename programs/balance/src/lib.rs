use anchor_lang::prelude::*;
use std::mem::size_of;
declare_id!("vixF6x1vJt5X3BhFCtUiWxrTpJhmRsvFaJWyqKU1Hmh");

#[program]
pub mod balance {
    use super::*;

    pub fn initialize_keypair(ctx: Context<InitializeKeypair>) -> Result<()> {
        Ok(())
    }

    pub fn initialize_pda(ctx: Context<InitializePda>) -> Result<()> {
        Ok(())
    }
}
#[derive(Accounts)]
pub struct InitializeKeypair<'info> {
    #[account(init, payer = signer, space = 8)]
    keypair: Account<'info, Keypair>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializePda<'info> {
    #[account(init, payer = signer, space = 8, seeds = [], bump)]
    pda: Account<'info, Pda>,
    #[account(mut)]
    signer: Signer<'info>,
    system_program: Program<'info, System>,
}

#[account]
pub struct Keypair();

#[account]
pub struct Pda();
