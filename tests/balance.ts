import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Balance } from "../target/types/balance";

describe("balance", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Balance as Program<Balance>;
  let pubKey = new anchor.web3.PublicKey("6uGWyDVbi5vq76AyNEazXvBnwnvTxu7mLHEW2q5MtwJe");

  async function printAccountBalance(account) {
    const balance = await anchor.getProvider().connection.getBalance(account);
    console.log(`${account} has ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);
  }

  it("Send sol to recipient", async () => {

    const recipient = anchor.web3.Keypair.generate();

    await printAccountBalance(recipient.publicKey);

    let amount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

    await program.methods.sendSol(
      amount
    ).accounts({ recipient: recipient.publicKey }).rpc();

    await printAccountBalance(recipient.publicKey);

  });


  it("Send sol to multiple recipients", async () => {
    const recipient1 = anchor.web3.Keypair.generate();
    const recipient2 = anchor.web3.Keypair.generate();
    const recipient3 = anchor.web3.Keypair.generate();


    await printAccountBalance(recipient1.publicKey);
    await printAccountBalance(recipient2.publicKey);
    await printAccountBalance(recipient3.publicKey);

    const amountMeta1 = {pubkey: recipient1.publicKey, isWritable: true, isSigner: false};
    const amountMeta2 = {pubkey: recipient2.publicKey, isWritable: true, isSigner: false};
    const amountMeta3 = {pubkey: recipient3.publicKey, isWritable: true, isSigner: false};

    let amount = new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL);

    await program.methods.splitSol(amount).remainingAccounts([amountMeta1, amountMeta2, amountMeta3]).rpc();

    await printAccountBalance(recipient1.publicKey);
    await printAccountBalance(recipient2.publicKey);
    await printAccountBalance(recipient3.publicKey);
  })


});
