/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a fully static site in ./out — perfect for Netlify.
  output: "export",
  images: { unoptimized: true },
  // Keep deploys frictionless; type-checking still runs.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
