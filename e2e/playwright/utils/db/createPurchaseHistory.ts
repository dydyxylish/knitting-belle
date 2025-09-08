import { z } from "zod";

import { cookieBasedClient } from "@/e2e/playwright/utils/db/dbclient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const createPurchaseHistorySchema = z.object({
	user: z.string(),
	knittingPatternSlug: z.string(),
	purchasedAt: z.string(),
	sessionId: z.string(),
	expireAt: z.string().optional().nullable(),
});

export const createPurchaseHistory = async (
	props: z.infer<typeof createPurchaseHistorySchema>,
) => {
	const { data: purchaseHistory, errors } =
		await cookieBasedClient.models.PurchaseHistory.create(props);

	if (errors) throw new Error(errors.map((error) => error.message).join(" "));

	log.info({ purchaseHistory }, "TEST: 購入履歴データを作成しました");
	return purchaseHistory;
};
