import { dbClient } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const queryKnittingPatternsBySlugs = async (
	slugs: readonly string[],
) => {
	try {
		const { data: knittingPatterns } =
			await dbClient.models.KnittingPattern.list({
				filter: {
					and: [
						{
							isPublished: {
								eq: true,
							},
						},
						{
							or: slugs.map((slug) => ({
								slug: { eq: slug },
							})),
						},
					],
				},
			});
		log.info({ knittingPatterns }, "編み図（slug別）データを取得しました");
		return knittingPatterns;
	} catch (e) {
		log.error({ e }, "編み図(slug別)データ取得に失敗しました");

		throw new Error(`編み図(slug別)データ取得に失敗しました`);
	}
};
