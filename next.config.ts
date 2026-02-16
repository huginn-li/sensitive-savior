import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 output: 'export' 以支持 API 路由
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
