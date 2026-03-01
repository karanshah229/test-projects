/**
 * @type {import('next').NextConfig}
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

let withBundleAnalyzer = () => {};
if (isDevelopment) {
  withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
  });
}

const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: false, // HRDS uses react-selectv3 and that uses older Context API which throws error when reactStrictMode is enabled

  eslint: {
    ignoreDuringBuilds: true,
  },

  swcMinify: true,

  transpilePackages: ['ui-icons', '@hackerrank/hrds-components'],

  // Use the CDN in production and localhost for development.
  // assetPrefix: isProd ? `https://${CDN_URL}/project_name/` : '',

  basePath: '',

  images: {
    domains: ['hrcdn.net'],
  },

  pageExtensions: ['page.tsx', 'page.ts'],

  poweredByHeader: false, // remove x-powered-by header

  i18n,
};

module.exports = isProd ? nextConfig : withBundleAnalyzer(nextConfig);
