import { queryPurchaseHistoryByOwner } from "@/db/query/purchaseHistory/queryPurchaseHistoryByOwner";

export const getPurchaseHistoryByOwner = async (user: string) =>
	await queryPurchaseHistoryByOwner({ user });
