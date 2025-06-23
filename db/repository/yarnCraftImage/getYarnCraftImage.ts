import { createLoaders } from "@/db/dataloader/createLoaders";

export const getYarnCraftImage = (knittingPatternId: string) => {
	const loader = createLoaders();
	return loader.yarnCraftImages.load(knittingPatternId);
};
