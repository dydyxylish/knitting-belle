import { dbClientWithAuth } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const queryKnittingPatternWithAuth = async (slug: string) => {
	try {
		const { data: knittingPattern } =
			await dbClientWithAuth.models.KnittingPattern.get({ slug });
		log.info({ knittingPattern }, "編み図データを取得しました");
		return knittingPattern;
	} catch (e) {
		log.error({ e }, "編み図データ取得に失敗しました");

		throw new Error(`編み図データ取得に失敗しました`);
	}
};
