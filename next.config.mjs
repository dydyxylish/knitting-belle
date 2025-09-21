import outputs from "./amplify_outputs.json" with { type: "json" };

/** @type {import('next').NextConfig} */
export default {
	serverExternalPackages: ["pino"],
	images: {
		remotePatterns: (() => {
			const imageBucket = outputs?.storage?.buckets?.find(
				(bucket) => bucket.name === "yarnCraftImageBucket",
			);

			if (!imageBucket?.aws_region || !imageBucket?.bucket_name) {
				throw new Error("バケット設定に不備があります");
			}

			let imageHostname;
			if (process.env.AMPLIFY_PRODUCTION === "true") {
				imageHostname = process.env.CDN_DOMAIN;
			} else {
				imageHostname = `${imageBucket.bucket_name}.s3.${imageBucket.aws_region}.amazonaws.com`;
			}

			return [
				{
					protocol: "https",
					hostname: imageHostname,
				},
				{
					protocol: "https",
					hostname: "lh3.googleusercontent.com",
				},
			];
		})(),
	},
	redirects: () => {
		if (process.env.ENABLE_TEST_API === "false") {
			return [
				{
					source: "/api/test/:path*",
					destination: "/",
					permanent: true,
				},
			];
		} else {
			return [];
		}
	},
	headers: async () => [
		{
			source: "/(.*)",
			headers: [
				{
					key: "X-Frame-Options",
					value: "DENY",
				},
				{
					key: "X-Content-Type-Options",
					value: "nosniff",
				},
			],
		},
		{
			source: "/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|css|js)",
			headers: [
				{
					key: "Cache-Control",
					value: "public, max-age=31536000, immutable",
				},
			],
		},
		{
			source: "/_next/static/(.*)",
			headers: [
				{
					key: "Cache-Control",
					value: "public, max-age=31536000, immutable",
				},
			],
		},
	],
};
