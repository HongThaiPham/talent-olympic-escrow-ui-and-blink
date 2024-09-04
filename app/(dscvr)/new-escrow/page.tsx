/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import MakeNewEscrowDialog from "@/components/escrow/MakeNewEscrowDialog";
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
import useEscrowProgram from "@/hooks/useEscrowProgram";
import { MakeNewEscrowSchema, MakeNewEscrowSchemaType } from "@/schemas/escrow";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Props = {};

const page: React.FC<Props> = ({}) => {
  const queryClient = useQueryClient();
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
        },
      });
    },
    [form, makeNewEscrow, queryClient]
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
        </CardContent>
        <CardFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={makeNewEscrow.isPending}
          >
            {makeNewEscrow.isPending && (
              <Loader2 className="ml-2 animate-spin" />
            )}
            Make Escrow
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
