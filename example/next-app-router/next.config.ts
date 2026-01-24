import type { NextConfig } from "next";

import { config } from "dotenv";
import { resolve } from "path";

// Load .env from parent example directory
config({ path: resolve(__dirname, "../.env") });

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@components-kit/react"],
};

export default nextConfig;
