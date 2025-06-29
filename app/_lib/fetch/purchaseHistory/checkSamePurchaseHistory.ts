import type { queryPurchaseHistoryByPaymentProps } from "@/db/query/purchaseHistory/queryPurchaseHistoryByPayment";
import { getPurchasedHistoryByPayment } from "@/db/repository/purchaseHistory/getPurchaseHIstoryByPayment";

export const checkSamePurchaseHistory = async (
	args: queryPurchaseHistoryByPaymentProps,
) => {
	const samePaymentPurchaseHistory = await getPurchasedHistoryByPayment(args);
	return samePaymentPurchaseHistory.length === 0;
};
