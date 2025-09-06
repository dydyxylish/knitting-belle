import { dbClientWithAuth } from "@/e2e/playwright/utils/db/dbclient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export interface DeletePurchaseHistoryProps {
	user: string;
	knittingPatternSlug: string;
}

export const deletePurchaseHistory = async ({
	user,
	knittingPatternSlug,
}: DeletePurchaseHistoryProps) => {
	const result = await dbClientWithAuth.models.PurchaseHistory.delete({
		user,
		knittingPatternSlug,
	});

	log.info({ result }, "購入履歴を削除しました");
};
