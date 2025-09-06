import type { Schema } from "@/amplify/data/resource";
import { dbClientWithAuth } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const createPurchaseHistory = async (
	props: Omit<
		Schema["PurchaseHistory"]["type"],
		"knittingPattern" | "createdAt" | "updatedAt"
	>,
) => {
	const { data: purchaseHistory, errors } =
		await dbClientWithAuth.models.PurchaseHistory.create(props);

	if (errors) throw new Error(errors.map((error) => error.message).join(" "));

	log.info({ purchaseHistory }, "TEST: 購入履歴データを作成しました");
	return purchaseHistory;
};
