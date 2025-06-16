import { list } from "aws-amplify/storage";
import { copyFile } from "@/amplify/seed/storage/util/copyObject";

export const putCraftImage = async () => {
	const images = await list({
		path: "seed-assets/image/",
		options: {
			bucket: "seedBucket",
			listAll: true,
		},
	});

	const promises = images.items
		.filter((item) => item.path?.match(/\.jpg$/i))
		.map(async (image) => {
			await copyFile({
				source: {
					path: image.path,
					bucket: "seedBucket",
				},
				destination: {
					path: `yarnCraftImage/${image.path.split("/").slice(-2).join("/")}`,
					bucket: "knittingBelle",
				},
			});
		});
	return await Promise.all(promises);
};
