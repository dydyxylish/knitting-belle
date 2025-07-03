import type { queryPurchaseHistoryByPaymentProps } from "@/db/query/purchaseHistory/queryPurchaseHistoryByPayment";
import { getPurchasedHistoryByPayment } from "@/db/repository/purchaseHistory/getPurchaseHIstoryByPayment";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const checkSamePurchaseHistory =
	async (args: queryPurchaseHistoryByPaymentProps) => async () => {
		if (await isExistsSamePurchaseHistory(args)) {
			log.error({ purchaseHistoryAttr: args }, "購入履歴が既に存在しています");
			return Promise.reject("購入履歴が既に存在しています");
		}
		return Promise.resolve();
	};

const isExistsSamePurchaseHistory = async (
	args: queryPurchaseHistoryByPaymentProps,
) => {
	const samePaymentPurchaseHistory = await getPurchasedHistoryByPayment(args);
	return samePaymentPurchaseHistory.length === 0;
};
