const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["https://firebasestorage.googleapis.com"]
  }
}

module.exports = nextConfig
