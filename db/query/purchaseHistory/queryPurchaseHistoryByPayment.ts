import { dbClientWithAuth } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export interface queryPurchaseHistoryByPaymentProps {
	paymentIntentId: string;
	user: string;
	knittingPatternSlug: string;
}

export const queryPurchaseHistoryByPayment = async ({
	paymentIntentId,
	user,
	knittingPatternSlug,
}: queryPurchaseHistoryByPaymentProps) => {
	try {
		const { data: purchaseHistories, errors } =
			await dbClientWithAuth.models.PurchaseHistory.list({
				filter: {
					or: [
						{
							paymentIntentId: {
								eq: paymentIntentId,
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
		log.info(
			{ purchaseHistories },
			"購入履歴（PaymentIntentId別）を取得しました",
		);

		return purchaseHistories;
	} catch (e) {
		log.error({ e }, "購入履歴（PaymentIntentId別）取得に失敗しました");
		throw new Error(`購入履歴（PaymentIntentId別）取得に失敗しました`);
	}
};
