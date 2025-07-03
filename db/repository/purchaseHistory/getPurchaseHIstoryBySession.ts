import {
	queryPurchaseHistoryBySession,
	type queryPurchaseHistoryBySessionProps,
} from "@/db/query/purchaseHistory/queryPurchaseHistoryBySession";

export const getPurchasedHistoryBySession = async (
	args: queryPurchaseHistoryBySessionProps,
) => {
	return await queryPurchaseHistoryBySession(args);
};
