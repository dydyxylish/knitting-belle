import "server-only";

import { getKnittingPatternsByIdsLoader } from "@/db/dataloader/knittingPattern/getKnittingPatternByIdsLoader";
import { getYarnCraftImagesByIdsLoader } from "@/db/dataloader/yarnCraftImage/getYarnCraftImagesByIdsLoader";

export const createLoaders = () => {
	return {
		knittingPatterns: getKnittingPatternsByIdsLoader(),
		yarnCraftImages: getYarnCraftImagesByIdsLoader(),
	};
};
