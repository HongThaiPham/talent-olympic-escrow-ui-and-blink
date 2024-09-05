/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { AnchorEscrow } from "@/artifacts/anchor_escrow";
import { useCanvasClient } from "@/hooks/useCanvasClient";
import { buildTransaction, ellipsify } from "@/lib/utils";
import { BN, Program } from "@coral-xyz/anchor";
import {
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import idl from "@/artifacts/anchor_escrow.json";
import { CanvasInterface } from "@dscvr-one/canvas-client-sdk";
import bs58 from "bs58";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DisplayTokenAmount from "@/components/DisplayTokenAmount";
import ExplorerLink from "@/components/ExplorerLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  RefreshCcw,
  CircleUser,
  RedoDot,
  UndoDot,
  Coins,
  Loader2,
  Info,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
type Props = {
  params: {
    pda: string;
  };
};

const TakeEscrowPage: React.FC<Props> = ({ params: { pda } }) => {
  const { client, connection } = useCanvasClient();
  const [loading, setLoading] = useState(false);
  const [escrowAccount, setEscrowAccount] = useState<{
    seed: BN;
    maker: PublicKey;
    mintA: PublicKey;
    mintB: PublicKey;
    receive: BN;
    bump: number;
  }>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [mintBInfo, setMintBInfo] = useState<any>(null);
  const queryClient = useQueryClient();
  const isToken2022 = useCallback(
    async (mint: PublicKey) => {
      const mintInfo = await connection.getAccountInfo(mint);
      return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
    },
    [connection]
  );
  const getMintInfo = useCallback(
    async (mint: PublicKey) => {
      const tokenProgram = (await isToken2022(mint))
        ? TOKEN_2022_PROGRAM_ID
        : TOKEN_PROGRAM_ID;

      return getMint(connection, mint, undefined, tokenProgram);
    },
    [connection, isToken2022]
  );

  const program = useMemo(
    () =>
      new Program<AnchorEscrow>(idl as AnchorEscrow, {
        connection,
      }),
    [connection]
  );

  useEffect(() => {
    program.account.escrow.fetch(new PublicKey(pda)).then((data) => {
      console.log(data);
      setEscrowAccount(data);
      getMintInfo(data.mintB).then((info) => {
        console.log(info);
        setMintBInfo(info);
      });
    });
  }, [getMintInfo, pda, program]);

  const handleTake = async () => {
    if (!client || !escrowAccount) return;
    const response = await client?.connectWalletAndSendTransaction(
      "solana:103",
      async (connectResponse: CanvasInterface.User.ConnectWalletResponse) => {
        if (!connectResponse.untrusted.success) return undefined;
        const publicKey = new PublicKey(connectResponse.untrusted.address);

        const program = new Program<AnchorEscrow>(idl as AnchorEscrow, {
          connection,
        });
        const escrow = new PublicKey(pda);
        const tokenProgram = (await isToken2022(escrowAccount.mintA))
          ? TOKEN_2022_PROGRAM_ID
          : TOKEN_PROGRAM_ID;
        const vault = getAssociatedTokenAddressSync(
          new PublicKey(escrowAccount.mintA),
          escrow,
          true,
          tokenProgram
        );

        const makerAtaB = getAssociatedTokenAddressSync(
          new PublicKey(escrowAccount.mintB),
          escrowAccount.maker,
          false,
          tokenProgram
        );

        const takerAtaA = getAssociatedTokenAddressSync(
          new PublicKey(escrowAccount.mintA),
          publicKey,
          false,
          tokenProgram
        );

        const takerAtaB = getAssociatedTokenAddressSync(
          new PublicKey(escrowAccount.mintB),
          publicKey,
          false,
          tokenProgram
        );

        const makeNewEscrowInstructionResponse = await program.methods
          .take()
          .accountsPartial({
            maker: escrowAccount.maker,
            taker: publicKey,
            mintA: new PublicKey(escrowAccount.mintA),
            mintB: new PublicKey(escrowAccount.mintB),
            makerAtaB,
            takerAtaA,
            takerAtaB,
            escrow,
            tokenProgram,
            vault,
          });

        const instruction =
          await makeNewEscrowInstructionResponse.instruction();
        console.log(instruction);
        const transaction = await buildTransaction({
          connection,
          payer: publicKey,
          instructions: [instruction],
        });
        return {
          unsignedTx: bs58.encode(transaction.serialize()),
        };
      }
    );

    if (response?.untrusted.success) {
      console.log("Transaction success");
      const result = {
        blink: `${process.env.NEXT_PUBLIC_DOMAIN}/api/actions/take-escrow/${pda}`,
        dscvr: `${process.env.NEXT_PUBLIC_DOMAIN}/take-escrow/${pda}`,
      };
      console.log(result);

      setIsSuccess(true);

      queryClient.invalidateQueries({
        queryKey: ["get-escrow-accounts"],
      });
    }
    setLoading(false);
  };

  if (!escrowAccount) {
    return (
      <Alert>
        <Info className="text-primary/70 h-4 w-4" />
        <AlertTitle>Escrow not exists</AlertTitle>
        <AlertDescription>
          This Escrow account does not exist or took by someone else.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="group cursor-pointer">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <RefreshCcw className="text-primary/70 group-hover:animate-spin" />
            Escrow
          </div>
        </CardTitle>
        <CardDescription className="space-y-2">
          <span className="block">
            Seed:
            <span className="text-primary/70 ml-2">
              {ellipsify(escrowAccount?.seed.toString())}
            </span>
          </span>
          <span className="block">
            Pda:
            <ExplorerLink type="address" value={pda}>
              <span className="text-primary/70 text-sm ml-2">
                {ellipsify(pda, 8)}
              </span>
            </ExplorerLink>
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
          <ExplorerLink type="address" value={escrowAccount?.maker.toString()}>
            <Avatar className="group-hover:animate-bounce">
              <AvatarFallback>
                {ellipsify(escrowAccount.maker.toString(), 1)}
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
          <ExplorerLink type="address" value={escrowAccount?.mintA.toString()}>
            <span className="text-primary/70 text-sm">
              {ellipsify(escrowAccount?.mintA.toString(), 8)}
            </span>
          </ExplorerLink>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <UndoDot className="w-4 h-4" />
            To Token (B):{" "}
          </div>
          <ExplorerLink type="address" value={escrowAccount?.mintB.toString()}>
            <span className="text-primary/70 text-sm">
              {ellipsify(escrowAccount?.mintB.toString(), 8)}
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
              amount={escrowAccount?.receive.toString()}
              decimals={mintBInfo?.decimals}
            />

            <span className="font-bold text-yellow-500">B token</span>
          </div>
        </div>
        <Separator />
        {escrowAccount && !isSuccess ? (
          <Button onClick={handleTake} disabled={loading}>
            {loading && <Loader2 className="mr-2 animate-spin" />}
            Take it
          </Button>
        ) : null}
        {isSuccess ? (
          <Alert>
            <AlertTitle>Transaction successful.</AlertTitle>
            <AlertDescription>
              You took the escrow successfully.
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default TakeEscrowPage;
