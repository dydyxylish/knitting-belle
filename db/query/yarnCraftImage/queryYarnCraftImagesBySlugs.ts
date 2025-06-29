import { dbClient } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const queryYarnCraftImagesBySlugs = async (
	knittingPatternSlugs: readonly string[],
) => {
	try {
		const { data: yarnCraftImages } = await dbClient.models.YarnCraftImage.list(
			{
				filter: {
					or: knittingPatternSlugs.map((slug) => ({
						knittingPatternSlug: { eq: slug },
					})),
				},
			},
		);
		log.info({ yarnCraftImages }, "毛糸作品画像データを取得しました");

		return yarnCraftImages;
	} catch (e) {
		log.error({ e }, "毛糸作品画像データ取得に失敗しました");

		throw new Error(`編毛糸作品画像データ取得に失敗しました`);
	}
};
