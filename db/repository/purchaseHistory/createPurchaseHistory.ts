import {
	mutationPurchaseHistory,
	type mutationPurchaseHistoryProps,
} from "@/db/query/purchaseHistory/mutationPurchaseHistory";

export const createPurchaseHistory = async (
	props: mutationPurchaseHistoryProps,
) => {
	return await mutationPurchaseHistory({
		...props,
	});
};
