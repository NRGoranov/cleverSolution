/** @type {import('next').NextConfig} */
const nextConfig = {
  // Local product/hero images live under /public/images — no remote hosts needed.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
