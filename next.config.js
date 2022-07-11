const { truncate } = require('fs/promises');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: truncate,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
