import { BN, ProgramAccount } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ellipsify } from "@/lib/utils";
import { CircleUser, Coins, RedoDot, RefreshCcw, UndoDot } from "lucide-react";
import { Separator } from "../ui/separator";
import ExplorerLink from "../ExplorerLink";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import useTokenBalance from "@/hooks/useTokenBalance";
import DisplayTokenAmount from "../DisplayTokenAmount";
import TakeEscrowButton from "./TakeEscrowButton";

type Props = {
  data: ProgramAccount<{
    seed: BN;
    maker: PublicKey;
    mintA: PublicKey;
    mintB: PublicKey;
    receive: BN;
    bump: number;
  }>;
};

const tokenProgram = TOKEN_PROGRAM_ID;

const EscrowCard: React.FC<Props> = ({ data }) => {
  const vaultAccount = useMemo(() => {
    return getAssociatedTokenAddressSync(
      data.account.mintA,
      data.publicKey,
      true,
      tokenProgram
    );
  }, [data.account.mintA, data.publicKey]);

  const { data: tokenBalance } = useTokenBalance(vaultAccount);
  console.log(tokenBalance);

  return (
    <Card className="group cursor-pointer">
      <CardHeader>
        <CardTitle className="flex items-center">
          <RefreshCcw className="text-primary/70 mr-2 group-hover:animate-spin" />
          Escrow
        </CardTitle>
        <CardDescription>
          Seed:
          <span className="text-primary/70 ml-2">
            {ellipsify(data.account.seed.toString())}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Separator />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CircleUser className="w-4 h-4" />
            Maker:{" "}
          </div>
          <ExplorerLink type="address" value={data.account.maker.toString()}>
            <Avatar className="group-hover:animate-bounce">
              <AvatarFallback>
                {ellipsify(data.account.maker.toString(), 1)}
              </AvatarFallback>
            </Avatar>
            {/* <span className="text-primary/70 text-sm">
              {ellipsify(data.account.maker.toString(), 8)}
            </span> */}
          </ExplorerLink>
        </div>
        <h2 className="font-semibold">Exchange</h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RedoDot className="w-4 h-4" />
            From Token (A):{" "}
          </div>
          <ExplorerLink type="address" value={data.account.mintA.toString()}>
            <span className="text-primary/70 text-sm">
              {ellipsify(data.account.mintA.toString(), 8)}
            </span>
          </ExplorerLink>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UndoDot className="w-4 h-4" />
            To Token (B):{" "}
          </div>
          <ExplorerLink type="address" value={data.account.mintB.toString()}>
            <span className="text-primary/70 text-sm">
              {ellipsify(data.account.mintB.toString(), 8)}
            </span>
          </ExplorerLink>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4" />
            Maker will receive:{" "}
          </div>

          <div className="text-primary/70 text-sm flex items-center gap-2">
            <DisplayTokenAmount
              amount={data.account.receive.toString()}
              decimals={9}
            />

            <span className="font-bold text-yellow-500">B token</span>
          </div>
        </div>
        <Separator />
        <TakeEscrowButton
          receive={data.account.receive}
          escrow={data.publicKey}
        />
      </CardContent>
    </Card>
  );
};

export default EscrowCard;
