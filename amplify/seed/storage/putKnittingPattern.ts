import { list } from "aws-amplify/storage";

import { copyFile } from "@/amplify/seed/storage/util/copyObject";

export const putKnittingPattern = async () => {
	const pdfFiles = await list({
		path: "seed-assets/pdf/",
		options: {
			bucket: "seedBucket",
			listAll: true,
		},
	});

	const promises = pdfFiles.items
		.filter((item) => item.path?.match(/\.pdf$/i))
		.map(async (knittingPattern) => {
			await copyFile({
				source: {
					path: knittingPattern.path,
					bucket: "seedBucket",
				},
				destination: {
					path: `knittingPattern/${knittingPattern.path.split("/").pop()}`,
					bucket: "knittingPatternBucket",
				},
			});
		});
	return await Promise.all(promises);
};
