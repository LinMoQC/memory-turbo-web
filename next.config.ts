import type { NextConfig } from "next";
import path from "path";
import fs from 'fs';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  env: {
    INITIALIZED: String(fs.existsSync(path.resolve(process.cwd(), 'memory.lock'))) // 判断是否初始化
  },
  async redirects() {
    return [
      {
        source: "/proxy/templates",
        destination: "/proxy/templates/list",
        permanent: true,
      },
      {
        source: "/proxy/users",
        destination: "/proxy/users/list",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
