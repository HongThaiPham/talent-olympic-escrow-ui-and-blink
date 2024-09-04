"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { CanvasClient, CanvasInterface } from "@dscvr-one/canvas-client-sdk";
import { validateHostMessage } from "../lib/dscvr";
import { Cluster, clusterApiUrl, Connection } from "@solana/web3.js";

type CanvasState = {
  client: CanvasClient | undefined;
  user: CanvasInterface.Lifecycle.User | undefined;
  content: CanvasInterface.Lifecycle.Content | undefined;
  isReady: boolean;
  connection: Connection;
};

export function useCanvasClient() {
  const connection = useMemo(
    () =>
      new Connection(
        process.env.NODE_ENV === "production" &&
        process.env.NEXT_PUBLIC_NETWORK === "mainnet-beta"
          ? (process.env.NEXT_PUBLIC_CLUSTER_URL as string)
          : clusterApiUrl(process.env.NEXT_PUBLIC_NETWORK as Cluster)
      ),
    []
  );
  const [state, setState] = useState<CanvasState>({
    client: undefined,
    user: undefined,
    content: undefined,
    isReady: false,
    connection: connection,
  });
  const initializationStartedRef = useRef(false);

  useEffect(() => {
    if (initializationStartedRef.current) return;

    initializationStartedRef.current = true;

    async function initializeCanvas() {
      const client = new CanvasClient();

      try {
        const response = await client.ready();
        const isValidResponse = await validateHostMessage(response);
        if (isValidResponse) {
          setState({
            client,
            user: response.untrusted.user,
            content: response.untrusted.content,
            isReady: true,
            connection,
          });
        }
      } catch (error) {
        setState((prev) => ({ ...prev, isReady: true }));
      }
    }

    initializeCanvas();

    return () => {
      if (state.client) {
        state.client.destroy();
      }
    };
  }, []);

  return state;
}
