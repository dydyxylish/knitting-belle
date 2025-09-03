import { dbClientWithAuth } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export interface queryPurchaseHistoryBySessionProps {
	sessionId: string;
}

export const queryPurchaseHistoryBySession = async ({
	sessionId,
}: queryPurchaseHistoryBySessionProps) => {
	try {
		const { data: purchaseHistories, errors } =
			await dbClientWithAuth.models.PurchaseHistory.list({
				filter: {
					sessionId: {
						eq: sessionId,
					},
				},
			});
		if (errors) log.error({ errors }, "error");
		log.info({ purchaseHistories }, "購入履歴（Session）を取得しました");

		return purchaseHistories;
	} catch (e) {
		log.error({ e }, "購入履歴（Session）取得に失敗しました");
		throw new Error(`購入履歴（Session）取得に失敗しました`);
	}
};
