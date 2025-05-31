import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    domains: [
      'images.unsplash.com',
      // Add other domains if you use images from other external sites
      // 'placehold.co', // If you still want to allow placeholders, though they aren't used with Unsplash successfully fetching
    ],
  },
};

export default nextConfig;
