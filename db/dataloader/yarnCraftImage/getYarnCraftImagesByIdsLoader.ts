import DataLoader from "dataloader";
import { groupBy, sortBy } from "es-toolkit";
import { cache } from "react";

import { queryYarnCraftImagesBySlugs } from "@/db/query/yarnCraftImage/queryYarnCraftImagesBySlugs";

export const getYarnCraftImagesBySlugsLoader = cache(
	() =>
		new DataLoader(async (knittingPatternSlugs: readonly string[]) => {
			const yarnCraftImages =
				await queryYarnCraftImagesBySlugs(knittingPatternSlugs);
			const yarnCraftImagesMap = groupBy(
				yarnCraftImages,
				(item) => item.knittingPatternSlug,
			);
			return knittingPatternSlugs.map(
				(knittingPatternSlug) =>
					sortBy(yarnCraftImagesMap[knittingPatternSlug], ["sortOrder"]) ||
					new Error(
						`knittingPatternSlug: ${knittingPatternSlug}に該当するyarnCraftImageが存在しません`,
					),
			);
		}),
);
