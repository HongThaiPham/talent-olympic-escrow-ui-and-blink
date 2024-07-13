"use client";
import { PublicKey } from "@solana/web3.js";
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
import { Button } from "../ui/button";
import { BicepsFlexed, RefreshCwOff } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import useEscrowProgram from "@/hooks/useEscrowProgram";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  escrow: PublicKey;
};
const RefundEscrowButton: React.FC<Props> = ({ escrow }) => {
  const queryClient = useQueryClient();
  const { refundEscrow } = useEscrowProgram();
  const handleRefund = useCallback(() => {
    toast.promise(refundEscrow.mutateAsync({ escrow }), {
      loading: "Refunding escrow...",
      success: "Escrow refunded",
      error: "Failed to refund escrow",
      finally() {
        queryClient.invalidateQueries({
          queryKey: ["get-escrow-accounts"],
        });
      },
    });
  }, [escrow, queryClient, refundEscrow]);
  return (
    <AlertDialog>
      <Button asChild className="w-full" variant={"destructive"}>
        <AlertDialogTrigger>
          <RefreshCwOff className="w-4 h-4 mr-2" />
          Refund Escrow
        </AlertDialogTrigger>
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will clean the escrow and refund
            the tokens to the maker
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRefund}>
            <BicepsFlexed className="w-4 h-4 mr-2" />I am sure
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RefundEscrowButton;
