import { BN, Program } from "@coral-xyz/anchor";
import useAnchorProvider from "./useAnchorProvider";
import { AnchorEscrow } from "@/artifacts/anchor_escrow";
import idl from "@/artifacts/anchor_escrow.json";
import { useMutation, useQuery } from "@tanstack/react-query";
import { randomBytes } from "crypto";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
export default function useEscrowProgram() {
  const provider = useAnchorProvider();
  const { publicKey } = useWallet();
  const program = new Program<AnchorEscrow>(idl as AnchorEscrow, provider);
  const tokenProgram = TOKEN_PROGRAM_ID; //TOKEN_2022_PROGRAM_ID;

  const getEscrowAccounts = useQuery({
    queryKey: ["get-escrow-accounts"],
    queryFn: async () => {
      const responces = await program.account.escrow.all();

      return responces.sort((a, b) => a.account.seed.cmp(b.account.seed));
    },
  });

  const makeNewEscrow = useMutation({
    mutationKey: ["make-new-escrow"],
    mutationFn: async (params: {
      mint_a: string;
      mint_b: string;
      deposit: number;
      receive: number;
    }) => {
      if (!publicKey) return;
      const seed = new BN(randomBytes(8));
      const { mint_a, mint_b, deposit, receive } = params;

      const makerAtaA = getAssociatedTokenAddressSync(
        new PublicKey(mint_a),
        publicKey,
        false,
        tokenProgram
      );

      const [escrow] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("escrow"),
          publicKey.toBuffer(),
          seed.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(mint_a),
        escrow,
        true,
        tokenProgram
      );

      return program.methods
        .make(seed, new BN(deposit), new BN(receive))
        .accounts({
          maker: publicKey,
          mintA: new PublicKey(mint_a),
          mintB: new PublicKey(mint_b),
          makerAtaA,
          vault,
          tokenProgram,
        })
        .rpc();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { program, makeNewEscrow, getEscrowAccounts };
}
