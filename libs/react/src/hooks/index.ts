import { useContext } from "react";
import useSWR from "swr";

import { InternalComponentsKitContext } from "../providers";
import { ComponentNameType } from "../types";
import { fetcher, generateComponentHash } from "../utils";

const useComponentsKitInternal = () => {
  const ctx = useContext(InternalComponentsKitContext);
  if (!ctx)
    throw new Error(
      "useComponentsKitInternal must be used within <ComponentsKitProvider>"
    );
  return ctx;
};

export const useComponentCSS = (
  componentName: ComponentNameType,
  variantName: string
) => {
  const { latestUpdatedAt, publicKey } = useComponentsKitInternal();

  const hash = generateComponentHash(
    publicKey,
    componentName,
    variantName,
    latestUpdatedAt
  );

  const key =
    hash !== ""
      ? `components-kit:${componentName}:${variantName}:${hash}`
      : null;

  const swr = useSWR(
    key,
    (swrKey: string) => {
      const [, componentName, , hash] = swrKey.split(":");
      return fetcher(
        `http://localhost:8080/v1/public/component/${encodeURIComponent(
          componentName
        )}/${encodeURIComponent(hash)}.css`
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

  return swr;
};
