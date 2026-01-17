import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    qualities: [100, 75],
  },
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
}

const withMDX = createMDX();

export default withMDX(nextConfig);
