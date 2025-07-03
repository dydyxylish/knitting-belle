import outputs from "@/amplify_outputs.json";
import { getYarnCraftImageCookie } from "@/db/repository/yarnCraftImage/getYarnCraftImageCookie";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

const imageBucket = outputs.storage.buckets.find(
	(bucket) => bucket.name === "yarnCraftImageBucket",
);

export const getImagePaths = async (knittingPatternSlug: string) => {
	const images = await getYarnCraftImageCookie(knittingPatternSlug);
	if (!imageBucket?.aws_region && !imageBucket?.bucket_name) {
		log.error({ imageBucket }, "バケット設定に不備があります");
		throw new Error("バケット設定に不備があります");
	}
	return images.map((img) =>
		generateUrl({
			region: imageBucket?.aws_region,
			bucketName: imageBucket?.bucket_name,
			path: img.imagePath,
		}),
	);
};

interface generateUrlArgs {
	region: string;
	bucketName: string;
	path: string;
}
const generateUrl = ({ region, bucketName, path }: generateUrlArgs) =>
	`https://${bucketName}.s3.${region}.amazonaws.com/${path}`;
