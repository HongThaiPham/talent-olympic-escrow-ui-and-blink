"use client";
import useEscrowProgram from "@/hooks/useEscrowProgram";
import React from "react";
import EscrowCard from "./EscrowCard";
import SkeletonWapper from "../SkeletonWapper";

type Props = {};

const EscrowGrid: React.FC<Props> = ({}) => {
  const { getEscrowAccounts } = useEscrowProgram();
  if (getEscrowAccounts.data?.length === 0) {
    return (
      <div className="text-center my-10">
        <h2 className="text-2xl font-semibold">No escrows found</h2>
      </div>
    );
  }
  return (
    <SkeletonWapper isLoading={getEscrowAccounts.isLoading}>
      <div className="grid grid-cols-1 md:grid-cols-3 my-10 gap-8">
        {getEscrowAccounts.data?.map((escrow) => (
          <EscrowCard key={escrow.publicKey.toString()} data={escrow} />
        ))}
      </div>
    </SkeletonWapper>
  );
};

export default EscrowGrid;
