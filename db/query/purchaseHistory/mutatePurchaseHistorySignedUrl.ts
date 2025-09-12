import type { Schema } from "@/amplify/data/resource";
import { dbClientWithAuth } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export type mutatePurchaseHistorySignedUrlArgs = Pick<
	Schema["PurchaseHistory"]["type"],
	"user" | "knittingPatternSlug"
> & {
	expireAt: string;
	signedUrl: string;
};

export const mutatePurchaseHistorySignedUrl = async ({
	user,
	knittingPatternSlug,
	expireAt,
	signedUrl,
}: mutatePurchaseHistorySignedUrlArgs) => {
	try {
		const { data: purchaseHistory, errors } =
			await dbClientWithAuth.models.PurchaseHistory.update({
				user,
				knittingPatternSlug,
				expireAt,
				signedUrl,
			});
		if (errors) throw new Error(errors.map((error) => error.message).join(" "));

		log.info({ purchaseHistory }, "購入履歴データを更新しました");
		return purchaseHistory;
	} catch (e) {
		log.error({ e }, "購入履歴データの更新に失敗しました");

		throw new Error(`購入履歴データの更新に失敗しました`);
	}
};
