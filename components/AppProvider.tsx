import React, { PropsWithChildren, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  return <div>{children}</div>;
};

export default AppProvider;
