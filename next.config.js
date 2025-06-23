/** @type {import('next').NextConfig} */
const nextConfig = {
	serverExternalPackages: ["pino"],
	experimental: {
		ppr: "incremental",
	},
};

module.exports = nextConfig;
