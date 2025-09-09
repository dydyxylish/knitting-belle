import { createLoaders } from "@/db/dataloader/createLoaders";

export const getKnittingPattern = async (slug: string) => {
	const loader = createLoaders();
	return await loader.knittingPatterns.load(slug);
};
