import { cookieBasedClient } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export interface queryPurchaseHistoryByOwnerProps {
	user: string;
}

export const queryPurchaseHistoryByOwner = async ({
	user,
}: queryPurchaseHistoryByOwnerProps) => {
	try {
		const { data: purchaseHistories, errors } =
			await cookieBasedClient.models.PurchaseHistory.list({
				filter: {
					user: {
						eq: user, // owner取得の場合は、allow.owner().to(["read"])なので、eq: userで指定せずとも自分の購入履歴だけが取得できる
					},
				},
			});
		if (errors) log.error({ errors }, "error");
		log.info({ purchaseHistories }, "購入履歴（Owner）を取得しました");

		return purchaseHistories;
	} catch (e) {
		log.error({ e }, "購入履歴（Owner）取得に失敗しました");
		throw new Error(`購入履歴（Owner）取得に失敗しました`);
	}
};
