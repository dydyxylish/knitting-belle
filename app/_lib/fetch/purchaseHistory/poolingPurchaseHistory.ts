import "server-only";
import pRetry from "p-retry";

import { getPurchasedHistoryBySession } from "@/db/repository/purchaseHistory/getPurchaseHIstoryBySession";
import { getLogger } from "@/lib/logger";
import { loginAdmin } from "../../loginAdmin";

const log = getLogger(import.meta.url);

async function getPurchaseHistory(sessionId: string) {
	// DBから購入履歴を取得（なければエラーを投げる）
	await loginAdmin();
	const result = await getPurchasedHistoryBySession({ sessionId });
	if (result.length !== 1)
		throw new Error("該当Sessionの購入履歴がみつかりません");
	return result[0];
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
