"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { MakeNewEscrowSchema, MakeNewEscrowSchemaType } from "@/schemas/escrow";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import useEscrowProgram from "@/hooks/useEscrowProgram";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCanvasClient } from "@/hooks/useCanvasClient";
import { CanvasInterface } from "@dscvr-one/canvas-client-sdk";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import { buildTransaction } from "@/lib/utils";
type Props = {
  trigger: React.ReactNode;
};

const MakeNewEscrowDialog: React.FC<Props> = ({ trigger }) => {
  const { client, connection } = useCanvasClient();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { getMakeNewEscrowInstruction } = useEscrowProgram();
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
      const makeNewEscrowInstructionResponse =
        await getMakeNewEscrowInstruction({ ...values });
      const response = await client?.connectWalletAndSendTransaction(
        "solana:103",
        async (connectResponse: CanvasInterface.User.ConnectWalletResponse) => {
          if (!connectResponse.untrusted.success) return undefined;
          const address = new PublicKey(connectResponse.untrusted.address);

          if (!makeNewEscrowInstructionResponse.methodBuilder) return;
          const instruction =
            await makeNewEscrowInstructionResponse.methodBuilder.instruction();
          const transaction = await buildTransaction({
            connection,
            payer: address,
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
          blink: `${
            process.env.NEXT_PUBLIC_DOMAIN
          }/api/actions/take-escrow/${makeNewEscrowInstructionResponse.escrow.toString()}`,
          dscvr: `${
            process.env.NEXT_PUBLIC_DOMAIN
          }/take-escrow/${makeNewEscrowInstructionResponse.escrow.toString()}`,
        };
        console.log(result);

        form.reset();
        queryClient.invalidateQueries({
          queryKey: ["get-escrow-accounts"],
        });
      }
      setLoading(false);
    },
    [client, connection, form, getMakeNewEscrowInstruction, queryClient]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make a new Escrow</DialogTitle>
          <DialogDescription>
            This will create a new escrow account for you to trade tokens.
          </DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant={"secondary"}
              type="button"
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading && <Loader2 className="ml-2 animate-spin" />}
            Make Escrow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MakeNewEscrowDialog;
