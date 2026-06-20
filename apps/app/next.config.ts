import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers: async () => [
    {
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
      source: "/(.*)",
    },
  ],
  redirects: async () => [
    {
      destination: "/openworkbook",
      permanent: true,
      source: "/spreadsheets",
    },
  ],
  transpilePackages: ["@components-kit/react"],
};

export default nextConfig;
