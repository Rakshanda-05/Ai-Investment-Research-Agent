/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keeping this minimal on purpose.
  // reactStrictMode helps catch bugs early during development
  // by rendering components twice in dev mode to surface side-effect issues.
  reactStrictMode: true,
};

module.exports = nextConfig;
