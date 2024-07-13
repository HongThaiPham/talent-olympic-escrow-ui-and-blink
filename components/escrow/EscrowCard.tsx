import { BN, ProgramAccount } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ellipsify } from "@/lib/utils";
import {
  ArrowUpDown,
  CircleUser,
  RedoDot,
  RefreshCcw,
  UndoDot,
} from "lucide-react";
import { Separator } from "../ui/separator";
import ExplorerLink from "../ExplorerLink";

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

const EscrowCard: React.FC<Props> = ({ data }) => {
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
            <span className="text-primary/70 text-sm">
              {ellipsify(data.account.maker.toString(), 8)}
            </span>
          </ExplorerLink>
        </div>
        <h2 className="font-semibold">Exchange</h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <RedoDot className="w-4 h-4" />
            From Token:{" "}
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
            To Token:{" "}
          </div>
          <ExplorerLink type="address" value={data.account.mintB.toString()}>
            <span className="text-primary/70 text-sm">
              {ellipsify(data.account.mintB.toString(), 8)}
            </span>
          </ExplorerLink>
        </div>
      </CardContent>
    </Card>
  );
};

export default EscrowCard;
