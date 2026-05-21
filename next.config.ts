import type { NextConfig } from 'next';
import path from 'path';

const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tanstack/react-query',
      'react-hot-toast',
    ],
  },
};

export default nextConfig;
