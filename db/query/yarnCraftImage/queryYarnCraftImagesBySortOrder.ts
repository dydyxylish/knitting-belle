import { dbClient } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const queryYarnCraftImagesBySortOrder = async (sortOrder: number) => {
	try {
		const { data: yarnCraftImages } = await dbClient.models.YarnCraftImage.list(
			{
				filter: {
					sortOrder: {
						eq: sortOrder,
					},
				},
			},
		);
		log.debug(
			{ yarnCraftImages },
			"毛糸作品画像データ（SortOrder別）を取得しました",
		);

		return yarnCraftImages;
	} catch (e) {
		log.error({ e }, "毛糸作品画像データ（SortOrder別）取得に失敗しました");

		throw new Error(`編毛糸作品画像データ（SortOrder別）取得に失敗しました`);
	}
};
