import DataLoader from "dataloader";
import { keyBy } from "es-toolkit";
import { cache } from "react";

import { queryKnittingPatternsBySlugs } from "@/db/query/knittingPattern/queryKnittingPatternBySlugs";

export const getKnittingPatternsBySlugsLoader = cache(
	() =>
		new DataLoader(async (slugs: readonly string[]) => {
			const knittingPatterns = await queryKnittingPatternsBySlugs(slugs);
			const knittingPatternMap = keyBy(knittingPatterns, (item) => item.slug);
			return slugs.map(
				(slug) =>
					knittingPatternMap[slug] ||
					new Error(`slug: ${slug}に該当するslugが存在しません`),
			);
		}),
);
