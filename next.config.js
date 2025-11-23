/** @type {import('next').NextConfig} */
const repo = "flowsketch"; // fallback if BASE_PATH not provided
const base = process.env.BASE_PATH || `/${repo}`;

const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  basePath: base,
  assetPrefix: base
};

module.exports = nextConfig;
