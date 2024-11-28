import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Balance } from "../target/types/balance";

describe("balance", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Balance as Program<Balance>;
  let pubKey = new anchor.web3.PublicKey("6uGWyDVbi5vq76AyNEazXvBnwnvTxu7mLHEW2q5MtwJe");

  it("Is initialized!", async () => {

    // Program log: Balance: 499999994257141640
    const tx = await program.methods.readBalance().accounts({acct: pubKey}).rpc();
    console.log("send qeuery balance tx", tx);
   
  });
});
