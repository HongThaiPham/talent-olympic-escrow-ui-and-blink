import Link from "next/link";
import React, { PropsWithChildren } from "react";

type Props = {
  type: "tx" | "address";
  value: string;
} & PropsWithChildren;

const ExplorerLink: React.FC<Props> = ({ type = "tx", value, children }) => {
  if (!value) return "";
  return (
    <Link
      href={`https://explorer.solana.com/${type}/${value}?cluster=devnet`}
      target="_blank"
      rel="noreferrer"
      className="text-primary"
    >
      {children}
    </Link>
  );
};

export default ExplorerLink;
