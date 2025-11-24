/** @type {import('next').NextConfig} */
const repo = "flowsketch"; // fallback if BASE_PATH not provided
const isProd = process.env.NODE_ENV === "production";
// Serve the app at "/" but load assets from the repo path in production.
const base = "";
const assetPrefix = isProd ? process.env.BASE_PATH || `/${repo}` : undefined;

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
