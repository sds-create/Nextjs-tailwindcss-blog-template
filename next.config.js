/** @type {import('next').NextConfig} */
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // Enable standalone output for Docker
  output: "standalone",
};
