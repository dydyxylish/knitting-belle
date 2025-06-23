import DataLoader from "dataloader";
import { groupBy, sortBy } from "es-toolkit";
import { cache } from "react";

import { queryYarnCraftImagesByIds } from "@/db/query/yarnCraftImage/queryYarnCraftImagesByIds";

export const getYarnCraftImagesByIdsLoader = cache(
	() =>
		new DataLoader(async (knittingPatternIds: readonly string[]) => {
			const yarnCraftImages =
				await queryYarnCraftImagesByIds(knittingPatternIds);
			const yarnCraftImagesMap = groupBy(
				yarnCraftImages,
				(item) => item.knittingPatternId,
			);
			return knittingPatternIds.map(
				(knittingPatternId) =>
					sortBy(yarnCraftImagesMap[knittingPatternId], ["sortOrder"]) ||
					new Error(
						`knittingPatternId: ${knittingPatternId}に該当するyarnCraftImageが存在しません`,
					),
			);
		}),
);
