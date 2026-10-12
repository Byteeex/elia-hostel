import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  },
  ...(process.env.NEXT_PUBLIC_BASE_PATH
    ? {
        basePath: process.env.NEXT_PUBLIC_BASE_PATH,
        assetPrefix: `${process.env.NEXT_PUBLIC_BASE_PATH}/`,
      }
    : {}),
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
};

export default nextConfig;
