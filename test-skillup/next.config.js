/**
 * @type {import('next').NextConfig}
 */

const isDevelopment = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

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

  assetPrefix: isProd ? `https://${CDN_URL}/skillup/` : '',

  basePath: '/skillup',

  images: {
    domains: ['hrcdn.net'],
  },

  pageExtensions: ['page.tsx', 'page.ts'],

  poweredByHeader: false, // remove x-powered-by header

  i18n,

  publicRuntimeConfig: {
    BACKEND_URL: process.env.BACKEND_URL,
    CDN_URL: process.env.CDN_URL,
  },

  async redirects() {
    return [
      {
        // Until we have a product page for SkillUp
        source: '/',
        destination: '/overview',
        permanent: true,
      },
      {
        // Matches query params as well
        source: '/talent',
        destination: '/employees',
        permanent: true,
      },
      {
        // Matches every sub-route of talent/
        source: '/talent/:id*',
        destination: '/employees/:id*',
        permanent: true,
      },
      {
        // Employee view hidden till launch
        source: '/skills',
        destination: '/overview',
        permanent: false,
      },
      {
        // Employee view hidden till launch
        source: '/home',
        destination: '/404',
        permanent: false,
      },
      {
        // Employee view hidden till launch
        source: '/assignments',
        destination: '/404',
        permanent: false,
      },
      {
        // Employee view hidden till launch
        source: '/welcome',
        destination: '/overview',
        permanent: false,
      },
    ];
  },
};

module.exports = isProd ? nextConfig : withBundleAnalyzer(nextConfig);
