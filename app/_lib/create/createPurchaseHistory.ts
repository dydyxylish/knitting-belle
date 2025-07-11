// import { getPurchasedHistoryByPayment } from "@/db/repository/purchaseHistory/getPurchaseHIstoryByPayment";

import type { mutationPurchaseHistoryProps } from "@/db/query/purchaseHistory/createPurchaseHistory";
import { createPurchaseHistory as repositoryCreatePurchaseHistory } from "@/db/repository/purchaseHistory/createPurchaseHistory";
import { runWithAmplifyServerContext } from "../createAmplifyServerRunner";

export const createPurchaseHistory = async (
	props: mutationPurchaseHistoryProps,
) => {
	return await runWithAmplifyServerContext({
		nextServerContext: null,
		operation: () => repositoryCreatePurchaseHistory(props),
	});
};
