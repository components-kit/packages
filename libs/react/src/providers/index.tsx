"use client";

import { createContext, ReactNode, useMemo } from "react";
import useSWR from "swr";

import { fetcher } from "../utils";

export interface ComponentsKitContextValue {
  latestUpdatedAt?: number;
  publicKey: string;
}

export const InternalComponentsKitContext =
  createContext<ComponentsKitContextValue | null>(null);

export const PublicComponentsKitContext = createContext<Pick<
  ComponentsKitContextValue,
  "publicKey"
> | null>(null);

interface ComponentsKitProviderProps {
  children: ReactNode;
  publicKey: string;
}

export const ComponentsKitProvider = ({
  children,
  publicKey,
}: ComponentsKitProviderProps) => {
  const key = publicKey ? `components-kit:timestamp:${publicKey}` : null;

  const { data: latestUpdatedAt } = useSWR(
    key,
    (swrKey: string) => {
      const [, , keyPublic] = swrKey.split(":");
      return fetcher(
        `http://localhost:8080/v1/public/project/${encodeURIComponent(
          keyPublic
        )}/latest_timestamp.txt`
      );
    },
    {
      dedupingInterval: 60 * 1000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      staleTime: 60 * 1000,
    }
  );

  const internalContextValue: ComponentsKitContextValue = useMemo(() => {
    return {
      latestUpdatedAt: latestUpdatedAt
        ? parseInt(latestUpdatedAt, 10)
        : undefined,
      publicKey,
    };
  }, [latestUpdatedAt, publicKey]);

  const publicContextValue = useMemo(() => {
    return {
      publicKey,
    };
  }, [publicKey]);

  return (
    <InternalComponentsKitContext.Provider value={internalContextValue}>
      <PublicComponentsKitContext.Provider value={publicContextValue}>
        {children}
      </PublicComponentsKitContext.Provider>
    </InternalComponentsKitContext.Provider>
  );
};

// // Public hook for users
// export const useComponentsKit = () => {
//   const ctx = useContext(PublicComponentsKitContext);
//   if (!ctx)
//     throw new Error(
//       "useComponentsKit must be used within <ComponentsKitProvider>"
//     );
//   return ctx;
// };
