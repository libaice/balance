import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Balance } from "../target/types/balance";

async function airdropSol(publicKey, amount) {
  let airdropTx = await anchor.getProvider().connection.requestAirdrop(publicKey, amount);
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


  it("Alice transfer points to Bob", async () => {
    // 1. generate account
    const alice = anchor.web3.Keypair.generate();
    const bob = anchor.web3.Keypair.generate();

    // 2. aidrop sol
    const airdrop_alice_tx = await anchor.getProvider().connection.requestAirdrop(alice.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    await confirmTransaction(airdrop_alice_tx);

    const airdrop_bob_tx = await anchor.getProvider().connection.requestAirdrop(bob.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);
    await confirmTransaction(airdrop_bob_tx);


    // 3. generate seeds
    let seeds_alice = [alice.publicKey.toBytes()];
    let seeds_bob = [bob.publicKey.toBytes()];

    // 4. create player
    const [playerAlice, _bumpA] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds_alice,
      program.programId
    );

    const [playerBob, _bumpB] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds_bob,
      program.programId
    );

    // 5. initialize account
    await program.methods.initialize().accounts({
      player: playerAlice,
      signer: alice.publicKey,
    }).signers([alice]).rpc();

    await program.methods.initialize().accounts({
      player: playerBob,
      signer: bob.publicKey,
    }).signers([bob]).rpc();

    // 6. transfer points
    await program.methods.transferPoints(5).accounts({
      from: playerAlice,
      to: playerBob,
      signer: alice.publicKey,
    }).signers([alice]).rpc();

    console.log("Alice balance: ", (await program.account.player.fetch(playerAlice)).points);
    console.log("Bob balance: ", (await program.account.player.fetch(playerBob)).points);

  });

});