import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pino", "thread-stream"],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, 
        net: false,
        tls: false,
        "thread-stream": false, 
      };
    }
    return config;
  },
};

export default nextConfig;
