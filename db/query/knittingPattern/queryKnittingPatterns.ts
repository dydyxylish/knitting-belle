import { dbClient } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const queryKnittingPatternList = async () => {
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
					],
				},
				selectionSet: ["id"],
			});
		log.info({ knittingPatterns }, "編み図（全体）データを取得しました");

		return knittingPatterns;
	} catch (e) {
		log.error({ e }, "編み図(全体)データ取得に失敗しました");

		throw new Error(`編み図（全体）データ取得に失敗しました`);
	}
};
