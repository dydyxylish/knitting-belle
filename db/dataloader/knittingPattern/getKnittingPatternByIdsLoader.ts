import DataLoader from "dataloader";
import { keyBy } from "es-toolkit";
import { cache } from "react";

import { queryKnittingPatternsByIds } from "@/db/query/knittingPattern/queryKnittingPatternByIds";

export const getKnittingPatternsByIdsLoader = cache(
	() =>
		new DataLoader(async (ids: readonly string[]) => {
			const knittingPatterns = await queryKnittingPatternsByIds(ids);
			const knittingPatternMap = keyBy(knittingPatterns, (item) => item.id);
			return ids.map(
				(id) =>
					knittingPatternMap[id] ||
					new Error(`id: ${id}に該当するknittingPatternIdが存在しません`),
			);
		}),
);
