/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Local product/hero images live under /public/images — no remote hosts needed.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
