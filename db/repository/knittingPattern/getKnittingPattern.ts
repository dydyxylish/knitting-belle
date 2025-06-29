import { createLoaders } from "@/db/dataloader/createLoaders";

export const getKnittingPattern = (slug: string) => {
	const loader = createLoaders();
	return loader.knittingPatterns.load(slug);
};
