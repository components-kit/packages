import { CK_BUNDLE_URL } from "@/app/lib/api";

export function buildBundleUrl(
  primaryColor: string,
  grayScale: string,
  borderRadius: number | string,
) {
  const params = new URLSearchParams({
    borderRadius: String(parseInt(String(borderRadius), 10)),
    grayScale,
    primaryColor,
  });

  return `${CK_BUNDLE_URL}?${params.toString()}`;
}
