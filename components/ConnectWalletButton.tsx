"use client";
import dynamic from "next/dynamic";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function ConnectWalletButton() {
  return <WalletMultiButtonDynamic className={cn(buttonVariants())} />;
}
