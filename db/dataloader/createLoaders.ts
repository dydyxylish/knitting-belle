import "server-only";
import DataLoader from "dataloader";

import { getKnittingPatternsByIds } from "@/db/dataloader/getKnittingPatternsByIds";

export const createLoaders = () => {
	return {
		knittingPatterns: new DataLoader((ids: readonly string[]) =>
			getKnittingPatternsByIds(ids),
		),
		// yarnCraftImages: new DataLoader((ids) => getYarnCraftImages(ids)),
		// purchaseHistories: new DataLoader((userIds) =>
		// 	getPurchaseHistories(userIds),
		// ),
	};
};
