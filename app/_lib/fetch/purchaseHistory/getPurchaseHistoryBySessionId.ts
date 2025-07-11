import type { queryPurchaseHistoryBySessionProps } from "@/db/query/purchaseHistory/queryPurchaseHistoryBySession";
import { getPurchasedHistoryBySession } from "@/db/repository/purchaseHistory/getPurchaseHIstoryBySession";
import { runWithAmplifyServerContext } from "../../createAmplifyServerRunner";
import { loginAdmin } from "../../loginAdmin";

export const getPurchaseHistoryBySessionId = async (
	args: queryPurchaseHistoryBySessionProps,
) => {
	const purchaseHistories = await runWithAmplifyServerContext({
		nextServerContext: null,
		async operation() {
			await loginAdmin();
			return await getPurchasedHistoryBySession(args);
		},
	});

	return purchaseHistories.length === 1 ? purchaseHistories[0] : null;
};
