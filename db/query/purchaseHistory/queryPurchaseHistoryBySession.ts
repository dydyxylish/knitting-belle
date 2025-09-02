import dayjs from "dayjs";

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
					expireAt: {
						// ダウンロードするまでの時間を確保するため、expireAt署名付きURLの期限が切れる10分前まで
						ge: dayjs().add(10, "minutes").toISOString(),
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
