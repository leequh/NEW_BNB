/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'loremflickr.com',
      },
      {
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        hostname: 'via.placeholder.com',
      },
      {
        hostname: 'images.unsplash.com',
      },
      {
        hostname: 'avatars.githubusercontent.com',
      },
      {
        hostname: 'cloudflare-ipfs.com',
      },
    ],
  },
  async rewrites() {
    return [
      // Remove auth rewrite to allow NextAuth to work
      // {
      //   source: '/api/auth/:path*',
      //   destination: 'http://localhost:5000/api/auth/:path*',
      // },
      {
        source: '/api/rooms/:path*',
        destination: 'http://localhost:5000/api/rooms/:path*',
      },
      {
        source: '/api/bookings/:path*',
        destination: 'http://localhost:5000/api/bookings/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:5000/api/users/:path*',
      },
      // Temporarily commented out until backend implements these
      // {
      //   source: '/api/comments/:path*',
      //   destination: 'http://localhost:5000/api/comments/:path*',
      // },
      // {
      //   source: '/api/likes/:path*',
      //   destination: 'http://localhost:5000/api/likes/:path*',
      // },
      // {
      //   source: '/api/faqs/:path*',
      //   destination: 'http://localhost:5000/api/faqs/:path*',
      // },
      // {
      //   source: '/api/payments/:path*',
      //   destination: 'http://localhost:5000/api/payments/:path*',
      // },
    ]
  },
  experimental: {
    // Remove font optimization
  },
  webpack: (config, { isServer }) => {
    // Reduce font request timeouts
    if (!isServer) {
      config.infrastructureLogging = {
        level: 'error',
      }
    }

    // Using Node.js transpilation for problematic packages
    config.resolve.alias = {
      ...config.resolve.alias,
      // Use native fetch instead of undici
      undici: false,
    }

    return config
  },
  // transpilePackages helps with packages that use modern syntax
  transpilePackages: ['undici', 'firebase', '@firebase/storage'],
  // env: {
  //   NEXT_PUBLIC_KAKAO_MAP_CLIENT:
  //     process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT ||
  //     '24c7f1186319a0c269374ad59d2299f9',
  // },
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
