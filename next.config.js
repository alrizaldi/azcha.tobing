/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net', // Example for potential CDN usage
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
  },
}

module.exports = nextConfig