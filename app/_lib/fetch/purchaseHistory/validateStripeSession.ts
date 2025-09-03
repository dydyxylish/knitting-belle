import { poolingPurchaseHistory } from "@/app/_lib/fetch/purchaseHistory/poolingPurchaseHistory";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export async function validateStripeSession(sessionId: string) {
	try {
		// DBに記録された購入情報を確認（Webhooksで保存したもの）
		return await poolingPurchaseHistory(sessionId);
	} catch (error) {
		log.error({ error }, "購入情報の確認に失敗しました");
		throw new Error("購入情報の確認に失敗しました");
	}
}
