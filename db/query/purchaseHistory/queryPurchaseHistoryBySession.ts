import dayjs from "dayjs";

import { dbClientWithAuth } from "@/db/serverSideClient";
import { env } from "@/lib/env";
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
					purchasedAt: {
						// 初めて生成されてからenv.SIGNED_URL_EXPIRE_HOUR時間のみ有効(Thanksページ表示期限)
						ge: dayjs()
							.subtract(env.SIGNED_URL_EXPIRE_HOUR, "hour")
							.toISOString(),
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
