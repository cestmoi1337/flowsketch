/** @type {import('next').NextConfig} */
const repo = "flowsketch"; // fallback if BASE_PATH not provided
const isProd = process.env.NODE_ENV === "production";
const base = isProd ? process.env.BASE_PATH || `/${repo}` : "";
const assetPrefix = base ? `${base}/` : undefined;

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
