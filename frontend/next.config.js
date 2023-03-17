/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["https://firebasestorage.googleapis.com", "firebasestorage.googleapis.com"],
    unoptimized: true
  }
}

module.exports = nextConfig
