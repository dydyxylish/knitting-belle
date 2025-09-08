import { z } from "zod";

import { cookieBasedClient } from "@/e2e/playwright/utils/db/dbclient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

// zodスキーマに変更
export const deletePurchaseHistorySchema = z.object({
	user: z.string(),
	knittingPatternSlug: z.string(),
});

export const deletePurchaseHistory = async ({
	user,
	knittingPatternSlug,
}: z.infer<typeof deletePurchaseHistorySchema>) => {
	const result = await cookieBasedClient.models.PurchaseHistory.delete({
		user,
		knittingPatternSlug,
	});

	log.info({ result }, "TEST: 購入履歴を削除しました");
};
