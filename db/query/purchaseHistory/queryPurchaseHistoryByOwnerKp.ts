import { cookieBasedClient } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export interface queryPurchaseHistoryByOwnerArgsKp {
	user: string;
	knittingPatternSlug: string;
}

export const queryPurchaseHistoryByOwnerKp = async ({
	user,
	knittingPatternSlug,
}: queryPurchaseHistoryByOwnerArgsKp) => {
	try {
		const { data: purchaseHistories, errors } =
			await cookieBasedClient.models.PurchaseHistory.list({
				filter: {
					and: [
						{
							user: {
								eq: user,
							},
						},
						{
							knittingPatternSlug: {
								eq: knittingPatternSlug,
							},
						},
					],
				},
			});
		if (errors) log.error({ errors }, "error");
		log.info({ purchaseHistories }, "購入履歴（OwnerKp）を取得しました");

		return purchaseHistories;
	} catch (e) {
		log.error({ e }, "購入履歴（OwnerKp）取得に失敗しました");
		throw new Error(`購入履歴（OwnerKp）取得に失敗しました`);
	}
};
