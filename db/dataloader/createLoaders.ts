import "server-only";

import { getKnittingPatternsBySlugsLoader } from "./knittingPattern/getKnittingPatternByIdsLoader";
import { getYarnCraftImagesBySlugsLoader } from "./yarnCraftImage/getYarnCraftImagesByIdsLoader";

export const createLoaders = () => {
	return {
		knittingPatterns: getKnittingPatternsBySlugsLoader(),
		yarnCraftImages: getYarnCraftImagesBySlugsLoader(),
	};
};
