import { getKnittingPatternWithAuthClient } from "@/db/repository/knittingPattern/getKnittingPatternWithAuth";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const checkKnittingPatternExists = async (slug: string) => async () => {
	if (await isPublishedKnittingPattern(slug)) return Promise.resolve();
	log.error({ slug }, `slug: ${slug}に該当する有効な編み図がありません`);
};

const isPublishedKnittingPattern = async (slug: string) => {
	const knittingPattern = await getKnittingPatternWithAuthClient(slug);
	return !(knittingPattern instanceof Error) && knittingPattern?.isPublished;
};
