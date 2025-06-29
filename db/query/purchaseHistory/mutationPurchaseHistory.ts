import type { Schema } from "@/amplify/data/resource";
import { dbClientWithAuth } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export type mutationPurchaseHistoryProps = Pick<
	Schema["PurchaseHistory"]["type"],
	"user" | "knittingPatternSlug" | "purchasedAt" | "paymentIntentId"
>;

export const mutationPurchaseHistory = async ({
	user,
	knittingPatternSlug,
	purchasedAt,
	paymentIntentId,
}: mutationPurchaseHistoryProps) => {
	try {
		const { data: purchaseHistory, errors } =
			await dbClientWithAuth.models.PurchaseHistory.create({
				user,
				knittingPatternSlug,
				purchasedAt,
				paymentIntentId,
			});
		if (errors) throw new Error(errors.map((error) => error.message).join(" "));

		log.info({ purchaseHistory }, "購入履歴データを作成しました");
		return purchaseHistory;
	} catch (e) {
		log.error({ e }, "購入履歴データの作成に失敗しました");

		throw new Error(`購入履歴データの作成に失敗しました`);
	}
};
