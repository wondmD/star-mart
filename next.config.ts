import type { NextConfig } from 'next';
import path from 'path';

import { getSecurityHeaders } from './src/lib/security-headers';

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
  async headers() {
    const securityHeaders = getSecurityHeaders();

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
