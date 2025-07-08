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

			return [
				{
					protocol: "https",
					hostname: `${imageBucket.bucket_name}.s3.${imageBucket.aws_region}.amazonaws.com`,
				},
				{
					protocol: "https",
					hostname: "lh3.googleusercontent.com",
				},
			];
		})(),
	},
};
