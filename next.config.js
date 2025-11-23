/** @type {import('next').NextConfig} */
const repo = "flowsketch"; // fallback if BASE_PATH not provided
const isProd = process.env.NODE_ENV === "production";
const base = process.env.BASE_PATH ?? (isProd ? `/${repo}` : "");
const assetPrefix = base || undefined;

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
