import { dbClient } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const queryKnittingPatternsByIds = async (ids: readonly string[]) => {
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
							or: ids.map((id) => ({
								id: { eq: id },
							})),
						},
					],
				},
			});
		log.info({ knittingPatterns }, "編み図（ID別）データを取得しました");
		return knittingPatterns;
	} catch (e) {
		log.error({ e }, "編み図(ID別)データ取得に失敗しました");

		throw new Error(`編み図(ID別)データ取得に失敗しました`);
	}
};
