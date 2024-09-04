import {
  AnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { AnchorProvider } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
const MockWallet = {
  signTransaction: () => Promise.reject(),
  signAllTransactions: () => Promise.reject(),
  publicKey: Keypair.generate().publicKey,
};
export default function useAnchorProvider(mock: boolean = false) {
  const { connection } = useConnection();
  const wallet = useWallet();

  return new AnchorProvider(
    connection,
    mock ? MockWallet : (wallet as AnchorWallet),
    {
      commitment: "confirmed",
    }
  );
}
