import { createLoaders } from "@/db/dataloader/createLoaders";

export const getYarnCraftImage = (knittingPatternSlug: string) => {
	const loader = createLoaders();
	return loader.yarnCraftImages.load(knittingPatternSlug);
};
