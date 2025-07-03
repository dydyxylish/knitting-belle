import { cookieBasedClient } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const queryKnittingPatternsCookie = async (slug: string) => {
	try {
		const { data: knittingPatterns } =
			await cookieBasedClient.models.KnittingPattern.get({
				slug,
			});
		log.info({ knittingPatterns }, "編み図（cookie）データを取得しました");
		return knittingPatterns;
	} catch (e) {
		log.error({ e }, "編み図(cookie)データ取得に失敗しました");

		throw new Error(`編み図(cookie)データ取得に失敗しました`);
	}
};
