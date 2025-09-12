import outputs from "@/amplify_outputs.json";

const imageBucket = outputs.storage.buckets.find(
	(bucket) => bucket.name === "yarnCraftImageBucket",
);
if (!imageBucket?.aws_region && !imageBucket?.bucket_name) {
	console.error({ imageBucket }, "バケット設定に不備があります");
	throw new Error("バケット設定に不備があります");
}

export const getImageOrigin = () => {
	return `${imageBucket.bucket_name}.s3.${imageBucket.aws_region}.amazonaws.com`;
};
