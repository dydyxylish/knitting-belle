import {
	type queryPurchaseHistoryByOwnerArgsKp,
	queryPurchaseHistoryByOwnerKp,
} from "@/db/query/purchaseHistory/queryPurchaseHistoryByOwnerKp";

export const getPurchaseHistoryByOwnerKp = async ({
	user,
	knittingPatternSlug,
}: queryPurchaseHistoryByOwnerArgsKp) =>
	await queryPurchaseHistoryByOwnerKp({ user, knittingPatternSlug });
