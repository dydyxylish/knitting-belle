import type { Schema } from "@/amplify/data/resource";
import { dbClientWithAuth } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export type mutationPurchaseHistoryProps = Pick<
	Schema["PurchaseHistory"]["type"],
	"user" | "knittingPatternSlug" | "purchasedAt" | "sessionId"
>;

export const mutationPurchaseHistory = async ({
	user,
	knittingPatternSlug,
	purchasedAt,
	sessionId,
}: mutationPurchaseHistoryProps) => {
	try {
		const { data: purchaseHistory, errors } =
			await dbClientWithAuth.models.PurchaseHistory.create({
				user,
				knittingPatternSlug,
				purchasedAt,
				sessionId,
			});
		if (errors) throw new Error(errors.map((error) => error.message).join(" "));

		log.info({ purchaseHistory }, "購入履歴データを作成しました");
		return purchaseHistory;
	} catch (e) {
		log.error({ e }, "購入履歴データの作成に失敗しました");

		throw new Error(`購入履歴データの作成に失敗しました`);
	}
};
