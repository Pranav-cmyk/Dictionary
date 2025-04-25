/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    webpack: (config) => {
      config.resolve.fallback = {
        "encoding": false,
        "bufferutil": false,
        "utf-8-validate": false,
      };
      return config;
    }
  }
  
  module.exports = nextConfig