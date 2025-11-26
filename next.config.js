/** @type {import('next').NextConfig} */
const repo = "flowsketch";
const isProd = process.env.NODE_ENV === "production";
// Force basePath/assetPrefix for GitHub Pages so the latest build is always served from /flowsketch
const base = isProd ? `/${repo}` : "";
const assetPrefix = isProd ? `/${repo}` : undefined;

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
