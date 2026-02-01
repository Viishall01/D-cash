import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Force Next.js to re-process these old crypto libs
  transpilePackages: ['bip39', 'ed25519-hd-key', 'bs58'],

  // 2. Prevent the server-side build from crashing on Node-only modules
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        os: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;