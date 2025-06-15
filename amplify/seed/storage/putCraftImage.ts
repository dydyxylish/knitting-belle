import { list } from "aws-amplify/storage";
import { copyFile } from "./util/copyObject";
import { getLogger } from "../../../lib/logger";

const log = getLogger(import.meta.url);

export const putCraftImage = async () => {
	const result = await list({
		path: "seed-assets/image/",
		options: {
			bucket: "seedBucket",
			listAll: true,
		},
	});
	log.info(result);

	const promises = result.items
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
	await Promise.all(promises);
};
