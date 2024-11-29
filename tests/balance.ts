import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";

import { ChangeOwner } from "../target/types/change_owner";

import privateKey from '/Users/baice/.config/solana/id.json';


describe("change Owner test ", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ChangeOwner as Program<ChangeOwner>;

  it('initialize the pda account', async () => {
    const deployer = anchor.web3.Keypair.fromSecretKey(Uint8Array.from(privateKey));
    const seeds = []
    const [myStorage, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);
    console.log("the storage account address is", myStorage.toBase58());

    await program.methods.initialize().accounts({myStorage: myStorage}).rpc();
    await program.methods.changeOwner().accounts({myStorage: myStorage}).rpc();

    // after the ownership has been transferred
    // the account can still be initialized again
    await program.methods.initialize().accounts({myStorage: myStorage}).rpc();
  });

});