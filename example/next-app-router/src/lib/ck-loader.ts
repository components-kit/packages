import { initCKLoader } from "@components-kit/loader-nextjs";

export const ckLoader = initCKLoader({
  host: process.env.NEXT_PUBLIC_CK_API_HOST || "http://localhost:8080",
});
