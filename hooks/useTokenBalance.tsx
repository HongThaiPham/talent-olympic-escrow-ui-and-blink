import { useQuery } from "@tanstack/react-query";
import useAnchorProvider from "./useAnchorProvider";
import { PublicKey } from "@solana/web3.js";

export default function useTokenBalance(account: string | PublicKey) {
  const provider = useAnchorProvider();
  return useQuery({
    queryKey: ["token-balance", account],
    queryFn: async () => {
      return (
        await provider.connection.getTokenAccountBalance(new PublicKey(account))
      ).value;
    },
  });
}
