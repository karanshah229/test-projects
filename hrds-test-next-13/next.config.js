/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		transpilePackages: ["ui-icons", "@hackerrank/hrds-components"],
	},
};

module.exports = nextConfig;
