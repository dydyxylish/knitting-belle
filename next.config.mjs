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
			if (
				process.env.AMPLIFY_PRODUCTION === "true" &&
				outputs.custom?.cdnDomain
			) {
				imageHostname = outputs.custom.cdnDomain;
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
};
