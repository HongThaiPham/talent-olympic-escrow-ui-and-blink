"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Replace, BicepsFlexed, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { BN } from "@coral-xyz/anchor";
import { toast } from "sonner";
import useEscrowProgram from "@/hooks/useEscrowProgram";
import { PublicKey } from "@solana/web3.js";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  receive: BN;
  escrow: PublicKey;
};

const TakeEscrowButton: React.FC<Props> = ({ receive, escrow }) => {
  const queryClient = useQueryClient();
  const { takeAEscrow } = useEscrowProgram();
  const handleTake = async () => {
    toast.promise(takeAEscrow.mutateAsync({ escrow }), {
      loading: "Taking escrow...",
      success: "Escrow taken",
      error: "Failed to take escrow",
      finally() {
        queryClient.invalidateQueries({
          queryKey: ["get-escrow-accounts"],
        });
      },
    });
  };
  return (
    <AlertDialog>
      <Button asChild className="w-full">
        <AlertDialogTrigger disabled={takeAEscrow.isPending}>
          {takeAEscrow.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Replace className="w-4 h-4 mr-2" />
          )}
          Take it
        </AlertDialogTrigger>
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will take the escrow and send{" "}
            {receive.toString()} your token B to maker
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleTake}>
            {takeAEscrow.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <BicepsFlexed className="w-4 h-4 mr-2" />
            )}
            I am sure
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TakeEscrowButton;
