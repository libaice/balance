use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("vixF6x1vJt5X3BhFCtUiWxrTpJhmRsvFaJWyqKU1Hmh");

#[program]
pub mod balance {
    use super::*;

    pub fn send_sol(ctx: Context<SendSol>, amount: u64) -> Result<()> {
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.recipient.to_account_info(),
            },
        );

        let res = system_program::transfer(cpi_context, amount);
        if res.is_ok() {
            Ok(())
        } else {
            Err(Errors::TransferFailed.into())
        }
    }

    pub fn split_sol<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, SplitSol<'info>>,
        amount: u64,
    ) -> Result<()> {
        let amount_each_gets = amount / ctx.remaining_accounts.len() as u64;
        let system_program = &ctx.accounts.system_program;

        for recipient in ctx.remaining_accounts {
            let cpi_context = system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: recipient.to_account_info(),
            };

            let cpi_program = system_program.to_account_info();
            let cpi_context = CpiContext::new(cpi_program, cpi_context);

            let res = system_program::transfer(cpi_context, amount_each_gets);

            if !res.is_ok() {
                return Err(Errors::TransferFailed.into());
            }
        }

        Ok(())
    }
}

#[error_code]
pub enum Errors {
    #[msg("tranfer failed")]
    TransferFailed,
}

#[derive(Accounts)]
pub struct SendSol<'info> {
    /// CHECK: we do not read or write the data of this account
    #[account(mut)]
    recipient: UncheckedAccount<'info>,
    system_program: Program<'info, System>,

    #[account(mut)]
    signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct SplitSol<'info> {
    #[account(mut)]
    signer: Signer<'info>,

    system_program: Program<'info, System>,
}
