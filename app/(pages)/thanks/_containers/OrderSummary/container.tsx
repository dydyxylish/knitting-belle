import type { Schema } from "@/amplify/data/resource";
import { getKnittingPatternWithAuth } from "@/app/_lib/fetch/knittingPattern/getKnittingPatternWithAuth";
import { getLogger } from "@/lib/logger";
import OrderSummaryPresentation from "./presentation";

interface OrderSummaryContainerProps {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

const log = getLogger(import.meta.url);

export const OrderSummaryContainer = async ({
	purchaseHistory,
}: OrderSummaryContainerProps) => {
	const knittingPattern = await getKnittingPatternWithAuth(
		purchaseHistory.knittingPatternSlug,
	);
	if (!knittingPattern) {
		log.error(
			{ purchaseHistory, knittingPattern },
			"購入履歴に対応する編み図が存在しません",
		);
		throw new Error("購入履歴に対応する編み図が存在しません");
	}
	if (!purchaseHistory.purchasedAt) {
		log.error(
			{ purchaseHistory, knittingPattern },
			"購入日時が登録されていません",
		);
		throw new Error("購入日時が登録されていません");
	}
	return (
		<OrderSummaryPresentation
			knittingPatternTitle={knittingPattern?.title}
			purchasedAt={purchaseHistory.purchasedAt}
		/>
	);
};
