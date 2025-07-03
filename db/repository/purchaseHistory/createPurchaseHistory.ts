import {
	mutationPurchaseHistory,
	type mutationPurchaseHistoryProps,
} from "@/db/query/purchaseHistory/createPurchaseHistory";

export const createPurchaseHistory = async (
	props: mutationPurchaseHistoryProps,
) => {
	return await mutationPurchaseHistory({
		...props,
	});
};
