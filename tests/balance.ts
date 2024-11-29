import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Balance } from "../target/types/balance";


async function airdropSol(publicKey, amount) {
  let airdropTx = await anchor.getProvider().connection.requestAirdrop(publicKey, amount * anchor.web3.LAMPORTS_PER_SOL);
  await confirmTransaction(airdropTx);
}

async function confirmTransaction(tx) {
  const latestBlockHash = await anchor.getProvider().connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: tx,
  });
}

describe("Balance Other weite", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Balance as Program<Balance>;

  it('initialize the pda account', async () => {
    const seeds = [];
    // const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);
    // console.log("the storage account address is ", myPda.toBase58());

    // const tx = await program.methods.initializePda().accounts({ myPda: myPda }).rpc();

    // console.log('tx', tx);

    // --------------------------------

    const newKeyPair = anchor.web3.Keypair.generate();
    const receiverWallet = anchor.web3.Keypair.generate();

    await airdropSol(newKeyPair.publicKey, 1);


    console.log("the new keypair is ", newKeyPair.publicKey.toBase58());

    const transferTx = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: newKeyPair.publicKey,
        toPubkey: receiverWallet.publicKey,
        lamports: anchor.web3.LAMPORTS_PER_SOL,
      })
    );

    await anchor.web3.sendAndConfirmTransaction(
      anchor.getProvider().connection, transferTx, [newKeyPair]
    )

    await program.methods.initializeKeypairAccount()
      .accounts({ myKeypairAccount: newKeyPair.publicKey })
      .signers([newKeyPair]) // the signer must be the keypair
      .rpc();

    console.log("initialized");
    // try to transfer again, this fails
    const transaction = new anchor.web3.Transaction().add(
      anchor.web3.SystemProgram.transfer({
        fromPubkey: newKeyPair.publicKey,
        toPubkey: receiverWallet.publicKey,
        lamports: 1 * anchor.web3.LAMPORTS_PER_SOL,
      }),
    );
    await anchor.web3.sendAndConfirmTransaction(anchor.getProvider().connection, transaction, [newKeyPair]);


  })

});