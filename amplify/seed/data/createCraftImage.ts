import { readFileSync } from "node:fs";
import type { Client } from "aws-amplify/data";
import { parse } from "yaml";

import type { Schema } from "@/amplify/data/resource";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const createCraftImage = async (dbClient: Client<Schema>) => {
	try {
		const yamlFile = readFileSync(
			`${process.cwd()}/amplify/seed/data/asset/yarnCraftImage.yml`,
			"utf8",
		);
		const yarnCraftImages = parse(
			yamlFile,
		) as Schema["YarnCraftImage"]["type"][];

		// KnittingPatternテーブルから編み図一覧取得
		const { data: knittingPatterns } =
			await dbClient.models.KnittingPattern.list({
				filter: {
					isPublished: {
						eq: true,
					},
				},
			});

		// 編み図ごとにImagesから該当する画像をfilterしてcreate
		const result = knittingPatterns.map(async (knittingPattern) => {
			const fileName = knittingPattern.pdfPath.split("/").pop();
			const patternName = fileName?.split(".").shift();
			if (!patternName) return;
			const createTasks = yarnCraftImages
				.filter((yarnCraftImage) =>
					yarnCraftImage.imagePath.includes(patternName),
				)
				.map(async (yarnCraftImage) => {
					const response = await dbClient.models.YarnCraftImage.create({
						...yarnCraftImage,
						knittingPatternId: knittingPattern.id,
					});
					log.info({ response }, "successfully created YarnCraftImage:");
				});
			return await Promise.all(createTasks);
		});
		return await Promise.all(result);
	} catch (e) {
		log.error({ e }, "failed to create YarnCraftImage");
	}
};
