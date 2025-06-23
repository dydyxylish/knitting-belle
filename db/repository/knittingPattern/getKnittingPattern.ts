import { createLoaders } from "@/db/dataloader/createLoaders";

export const getKnittingPattern = (id: string) => {
	const loader = createLoaders();
	return loader.knittingPatterns.load(id);
};
