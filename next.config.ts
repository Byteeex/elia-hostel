import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.GITHUB_ACTIONS ? "/elia-hostel" : "",
  },
  ...(process.env.GITHUB_ACTIONS
    ? {
        basePath: "/elia-hostel",
        assetPrefix: "/elia-hostel/",
      }
    : {}),
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
};

export default nextConfig;
