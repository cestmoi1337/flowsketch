/** @type {import('next').NextConfig} */
// Use relative asset prefix so static export works on GitHub Pages subpath.
const base = "";
const assetPrefix = ".";

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
