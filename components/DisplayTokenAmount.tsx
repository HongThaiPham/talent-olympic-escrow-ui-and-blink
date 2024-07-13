import { cn } from "@/lib/utils";
import { BN } from "@coral-xyz/anchor";
import React, { useMemo } from "react";

type Props = {
  amount: number | BN | string;
  decimals: number | undefined;
  symbol?: string;
  className?: string;
};

const DisplayTokenAmount: React.FC<Props> = ({
  amount,
  decimals,
  symbol,
  className,
}) => {
  const amountString = useMemo(() => {
    return new BN(amount).div(new BN(10).pow(new BN(decimals || 0))).toString();
  }, [amount, decimals]);
  return (
    <span className={cn(className)}>
      {amountString} {symbol}
    </span>
  );
};

export default DisplayTokenAmount;
