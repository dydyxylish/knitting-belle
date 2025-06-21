import { sortModel } from "@/db/sortModel";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const getKnittingPatternsByIds = async (ids: readonly string[]) => {
	try {
		const res = await fetch(
			`/api/knitting-pattern/by-ids?${ids.map((id) => "id=" + id).join("&")}`,
		);
		const knittingPatterns = await res.json();
		log.info({ knittingPatterns }, "編み図（ID別）データを取得しました");

		return sortModel(knittingPatterns, "id", ids);
	} catch (e) {
		log.error({ e }, "編み図(ID別)データ取得に失敗しました");

		return ids.map((id) => new Error(`データ取得に失敗しました ID:${id}`));
	}
};
