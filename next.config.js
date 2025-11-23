/** @type {import('next').NextConfig} */
const repo = "flowsketch"; // fallback if BASE_PATH not provided
const base = process.env.BASE_PATH || `/${repo}`;
const assetPrefix = base;

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: base,
  assetPrefix,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
