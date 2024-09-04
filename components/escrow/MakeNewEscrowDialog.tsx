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
import { AxeIcon, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  trigger: React.ReactNode;
};

const MakeNewEscrowDialog: React.FC<Props> = ({ trigger }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { makeNewEscrow } = useEscrowProgram();
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
      toast.promise(makeNewEscrow.mutateAsync({ ...values }), {
        loading: "Making new escrow account...",
        success: "Escrow account created!",
        error: "Failed to create escrow account!",
        finally() {
          form.reset();
          queryClient.invalidateQueries({
            queryKey: ["get-escrow-accounts"],
          });

          setOpen(false);
        },
      });
    },
    [form, makeNewEscrow, queryClient]
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
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={makeNewEscrow.isPending}
          >
            {makeNewEscrow.isPending && (
              <Loader2 className="ml-2 animate-spin" />
            )}
            Make Escrow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MakeNewEscrowDialog;
