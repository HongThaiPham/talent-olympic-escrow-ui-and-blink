import {
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 10) {
    return (
      str.substring(0, len) + ".." + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

/**
 * Helper function to build a signed transaction
 */
export async function buildTransaction({
  connection,
  payer,
  instructions,
}: {
  connection: Connection;
  payer: PublicKey;
  instructions: TransactionInstruction[];
}): Promise<VersionedTransaction> {
  let blockhash = await connection
    .getLatestBlockhash()
    .then((res) => res.blockhash);

  const messageV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();

  const tx = new VersionedTransaction(messageV0);

  return tx;
}

export const CLUSTER_TO_CHAINID: Record<string, string> = {
  devnet: "solana:103",
  "mainnet-beta": "solana:101",
};
