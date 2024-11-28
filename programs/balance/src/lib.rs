use core::str;

use anchor_lang::prelude::*;

declare_id!("vixF6x1vJt5X3BhFCtUiWxrTpJhmRsvFaJWyqKU1Hmh");

#[program]
pub mod balance {
    use super::*;

    pub fn read_balance(ctx: Context<ReadBalance>) -> Result<()> {
        let balance = ctx.accounts.acct.to_account_info().lamports();
        //Program log: Balance: 499999994257141640
        msg!("Balance: {}", balance);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ReadBalance<'info> {
    ///CHECK: although we read this account's balance, we don't do anything with the information
    pub acct: UncheckedAccount<'info>,
}
