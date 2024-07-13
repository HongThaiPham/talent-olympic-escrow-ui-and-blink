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
import { Replace, BicepsFlexed } from "lucide-react";
import { Button } from "../ui/button";
import { BN } from "@coral-xyz/anchor";
import { toast } from "sonner";

type Props = {
  receive: BN;
};

const TakeEscrowButton: React.FC<Props> = ({ receive }) => {
  const handleTake = async () => {
    toast.success("Escrow taken!");
  };
  return (
    <AlertDialog>
      <Button asChild className="w-full">
        <AlertDialogTrigger>
          <Replace className="w-4 h-4 mr-2" />
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
            <BicepsFlexed className="w-4 h-4 mr-2" />I am sure
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TakeEscrowButton;
