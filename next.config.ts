import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://195.26.245.118:8080/api/:path*",
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
