/** @type {import('next').NextConfig} */
const repo = "flowsketch"; // fallback if BASE_PATH not provided
const isProd = process.env.NODE_ENV === "production";
// In production, keep the app under /flowsketch but emit relative asset URLs.
const base = isProd ? process.env.BASE_PATH || `/${repo}` : "";
const assetPrefix = isProd ? "." : undefined;

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
