import type { Schema } from "@/amplify/data/resource";
import { getKnittingPatternWithAuthClient } from "@/db/repository/knittingPattern/getKnittingPatternWithAuth";
import { getLogger } from "@/lib/logger";
import OrderSummaryPresentation from "./presentation";

interface OrderSummaryContainerProps {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

const log = getLogger(import.meta.url);

export const OrderSummaryContainer = async ({
	purchaseHistory,
}: OrderSummaryContainerProps) => {
	const knittingPattern = await getKnittingPatternWithAuthClient(
		purchaseHistory.knittingPatternSlug,
	);
	if (!knittingPattern) {
		log.error(
			{ purchaseHistory, knittingPattern },
			"購入履歴に対応する編み図が存在しません",
		);
		throw new Error("購入履歴に対応する編み図が存在しません");
	}
	return (
		<OrderSummaryPresentation
			knittingPatternTitle={knittingPattern?.title}
			purchasedAt={purchaseHistory.purchasedAt}
		/>
	);
};
