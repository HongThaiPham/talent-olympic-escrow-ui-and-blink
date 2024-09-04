/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCanvasClient } from "@/hooks/useCanvasClient";
import useEscrowProgram from "@/hooks/useEscrowProgram";
import { buildTransaction } from "@/lib/utils";
import { MakeNewEscrowSchema, MakeNewEscrowSchemaType } from "@/schemas/escrow";
import { CanvasInterface } from "@dscvr-one/canvas-client-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, PartyPopper } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import bs58 from "bs58";
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { AnchorEscrow } from "@/artifacts/anchor_escrow";
import idl from "@/artifacts/anchor_escrow.json";
import { randomBytes } from "crypto";
import {
  getAssociatedTokenAddressSync,
  getMint,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
type Props = {};

const page: React.FC<Props> = ({}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [pda, setPda] = useState("");
  const { client, connection } = useCanvasClient();

  const [links, setLinks] = useState({
    blink: "",
    dscvr: "",
  });
  const form = useForm<MakeNewEscrowSchemaType>({
    resolver: zodResolver(MakeNewEscrowSchema),
    defaultValues: {
      mint_a: "",
      mint_b: "",
      deposit: 0,
      receive: 0,
    },
  });

  const onSubmit = useCallback(
    async (values: MakeNewEscrowSchemaType) => {
      setLoading(true);

      const response = await client?.connectWalletAndSendTransaction(
        "solana:103",
        async (connectResponse: CanvasInterface.User.ConnectWalletResponse) => {
          if (!connectResponse.untrusted.success) return undefined;
          const publicKey = new PublicKey(connectResponse.untrusted.address);
          // const provider = new AnchorProvider(
          //   connection,
          //   {
          //     publicKey,
          //     // signTransaction: () => Promise.reject(),
          //     // signAllTransactions: () => Promise.reject(),
          //   },
          //   {
          //     commitment: "confirmed",
          //   }
          // );
          const program = new Program<AnchorEscrow>(idl as AnchorEscrow, {
            connection,
          });
          const isToken2022 = async (mint: PublicKey) => {
            const mintInfo = await connection.getAccountInfo(mint);
            return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
          };

          const seed = new BN(randomBytes(8));
          const { mint_a, mint_b, deposit, receive } = values;
          const tokenProgram = (await isToken2022(new PublicKey(mint_a)))
            ? TOKEN_2022_PROGRAM_ID
            : TOKEN_PROGRAM_ID;

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

          setPda(escrow.toString());

          const vault = getAssociatedTokenAddressSync(
            new PublicKey(mint_a),
            escrow,
            true,
            tokenProgram
          );

          const getMintInfo = async (mint: PublicKey) => {
            const tokenProgram = (await isToken2022(mint))
              ? TOKEN_2022_PROGRAM_ID
              : TOKEN_PROGRAM_ID;

            return getMint(connection, mint, undefined, tokenProgram);
          };

          const mintAInfo = await getMintInfo(new PublicKey(mint_a));
          const mintAAmount = new BN(deposit).mul(
            new BN(10).pow(new BN(mintAInfo.decimals))
          );
          const mintBInfo = await getMintInfo(new PublicKey(mint_b));
          const mintBAmount = new BN(receive).mul(
            new BN(10).pow(new BN(mintBInfo.decimals))
          );

          const makeNewEscrowInstructionResponse = await program.methods
            .make(seed, mintAAmount, mintBAmount)
            .accounts({
              maker: publicKey,
              mintA: new PublicKey(mint_a),
              mintB: new PublicKey(mint_b),
              makerAtaA,
              vault,
              tokenProgram,
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
          blink: `${process.env.NEXT_PUBLIC_DOMAIN}/api/actions/take-escrow/${pda})}`,
          dscvr: `${process.env.NEXT_PUBLIC_DOMAIN}/take-escrow/${pda}`,
        };
        console.log(result);
        setLinks(result);

        form.reset();
        queryClient.invalidateQueries({
          queryKey: ["get-escrow-accounts"],
        });
      }
      setLoading(false);
    },
    [client, connection, form, pda, queryClient]
  );
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Make a new escrow account</CardTitle>
          <CardDescription>
            Create a new escrow account to trade tokens with other users.
            <br />
            <span className="text-rose-500 font-bold">Running on DEVNET</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="mint_a"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your token mint</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The mint of the token you own and want to trade.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount your token mint</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      The amount of token you want to trade.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mint_b"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Token mint you want to receive in exchange
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      The mint of the token you want to receive in exchange.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Amount of token mint you want to receive
                    </FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      The amount of token you want to receive in exchange.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormMessage />
            </form>
          </Form>

          <Alert>
            <PartyPopper className="h-4 w-4" />
            <AlertTitle>New escrow account created at: {pda}</AlertTitle>
            <AlertDescription>
              <div>
                <h3>Blink</h3>
                <Link href={links.blink} target="_blank">
                  {links.blink}
                </Link>
                <h3>DSCVR</h3>
                <Link href={links.dscvr} target="_blank">
                  {links.dscvr}
                </Link>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading && <Loader2 className="ml-2 animate-spin" />}
            Make Escrow
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
