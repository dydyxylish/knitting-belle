import { cookies } from "next/headers";

import { getPurchaseHistoryByOwnerKp } from "@/db/repository/purchaseHistory/getPurchaseHistoryByOwnerKp";
import { getLogger } from "@/lib/logger";
import { runWithAmplifyServerContext } from "../../amplifyServerUtils";

interface hasAlreadyKnittingPatternArgs {
	user: string;
	knittingPatternSlug: string;
}

const log = getLogger(import.meta.url);

export const hasAlreadyKnittingPattern = async ({
	user,
	knittingPatternSlug,
}: hasAlreadyKnittingPatternArgs) => {
	const purchaseHistory = await runWithAmplifyServerContext({
		nextServerContext: { cookies },
		operation: async () =>
			await getPurchaseHistoryByOwnerKp({ user, knittingPatternSlug }),
	});
	if (purchaseHistory.length > 1) {
		log.error({ purchaseHistory }, "購入履歴が重複しています");
		return true;
	}
	return purchaseHistory.length === 1;
};
