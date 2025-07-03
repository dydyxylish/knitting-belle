import {
	queryPurchaseHistoryByPayment,
	type queryPurchaseHistoryByPaymentProps,
} from "@/db/query/purchaseHistory/queryPurchaseHistoryByPayment";

export const getPurchasedHistoryByPayment = async (
	args: queryPurchaseHistoryByPaymentProps,
) => {
	return await queryPurchaseHistoryByPayment(args);
};
