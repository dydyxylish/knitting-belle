import "server-only";

import { getPurchaseHistoryByOwnerKp } from "@/db/repository/purchaseHistory/getPurchaseHistoryByOwnerKp";
import { getLogger } from "@/lib/logger";
import { runWithServerContext } from "../../createAmplifyServerRunner";

interface hasAlreadyKnittingPatternArgs {
	user: string;
	knittingPatternSlug: string;
}

const log = getLogger(import.meta.url);

export const hasAlreadyKnittingPattern = async ({
	user,
	knittingPatternSlug,
}: hasAlreadyKnittingPatternArgs) => {
	const purchaseHistory = await runWithServerContext(
		async () =>
			await getPurchaseHistoryByOwnerKp({ user, knittingPatternSlug }),
		{ withCookies: true },
	);
	log.debug({ purchaseHistory }, "購入履歴を取得しました");
	return purchaseHistory.length !== 0;
};
