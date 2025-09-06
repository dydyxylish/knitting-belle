import pRetry from "p-retry";

import { getLogger } from "@/lib/logger";
import { getPurchaseHistoryBySessionId } from "./getPurchaseHistoryBySessionId";

const log = getLogger(import.meta.url);

async function getPurchaseHistory(sessionId: string) {
	// DBから購入履歴を取得（なければエラーを投げる）
	const result = await getPurchaseHistoryBySessionId({ sessionId });
	if (!result) throw new Error("該当Sessionの購入履歴がみつかりません");
	return result;
}

export const poolingPurchaseHistory = async (sessionId: string) =>
	await pRetry(() => getPurchaseHistory(sessionId), {
		retries: 5,
		minTimeout: 1000, // 1秒ごと
		onFailedAttempt: (error) => {
			log.warn(
				{ error },
				`リトライ中: ${error.attemptNumber}回目、残り${error.retriesLeft}回`,
			);
		},
	});
