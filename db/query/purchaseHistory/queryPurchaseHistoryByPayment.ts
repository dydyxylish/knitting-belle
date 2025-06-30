import { dbClientWithAuth } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export interface queryPurchaseHistoryByPaymentProps {
	sessionId: string;
	user: string;
	knittingPatternSlug: string;
}

export const queryPurchaseHistoryByPayment = async ({
	sessionId,
	user,
	knittingPatternSlug,
}: queryPurchaseHistoryByPaymentProps) => {
	try {
		const { data: purchaseHistories, errors } =
			await dbClientWithAuth.models.PurchaseHistory.list({
				filter: {
					or: [
						{
							sessionId: {
								eq: sessionId,
							},
						},
						{
							and: [
								{
									user: {
										eq: user,
									},
									knittingPatternSlug: {
										eq: knittingPatternSlug,
									},
								},
							],
						},
					],
				},
			});
		if (errors) log.error({ errors }, "error");
		return purchaseHistories;
	} catch (e) {
		log.error({ e }, "購入履歴取得に失敗しました");
		throw new Error(`購入履歴取得に失敗しました`);
	}
};
