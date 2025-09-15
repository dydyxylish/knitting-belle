import outputs from "@/amplify_outputs.json";
import { env } from "@/lib/env";
import type { AmplifyOutputsWithCustom } from "@/lib/type";

const imageBucket = outputs.storage.buckets.find(
	(bucket) => bucket.name === "yarnCraftImageBucket",
);
if (!imageBucket?.aws_region && !imageBucket?.bucket_name) {
	console.error({ imageBucket }, "バケット設定に不備があります");
	throw new Error("バケット設定に不備があります");
}

export const getImageOrigin = () => {
	const typedOutputs = outputs as AmplifyOutputsWithCustom;
	if (env.AMPLIFY_PRODUCTION && typedOutputs.custom?.cdnDomain) {
		return typedOutputs.custom.cdnDomain;
	}
	return `${imageBucket.bucket_name}.s3.${imageBucket.aws_region}.amazonaws.com`;
};
