import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ensure server-side environment variables are not leaked to client
  serverExternalPackages: ['undici'],
  // Optimize for Vercel deployment
  output: 'standalone',
}

export default nextConfig
