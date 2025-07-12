import MurmurHash3 from "imurmurhash";

import { ComponentNameType } from "../types";

export const generateComponentHash = (
  publicKey: string,
  componentName: ComponentNameType,
  variantName: string,
  latestUpdatedAt?: number
) => {
  if (!latestUpdatedAt) return "";
  const input = `${publicKey}:${componentName}:${variantName}:${latestUpdatedAt}`;
  const hashNum = new MurmurHash3(input).result();
  return hashNum.toString(36);
};
