import { dbClientWithAuth } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export interface mutateKnittingPatternArgs {
	slug: string;
	downloadCount: number;
}

export const mutateKnittingPattern = async ({
	slug,
	downloadCount,
}: mutateKnittingPatternArgs) => {
	try {
		const { data: knittingPatterns } =
			await dbClientWithAuth.models.KnittingPattern.update({
				slug,
				downloadCount,
			});
		log.info({ knittingPatterns }, "編み図データを更新しました");

		return knittingPatterns;
	} catch (e) {
		log.error({ e }, "編み図データを更新しました");

		throw new Error(`編み図データを更新しました`);
	}
};
