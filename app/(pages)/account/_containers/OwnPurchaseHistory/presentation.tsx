import { v4 as uuidV4 } from "uuid";

import type { Schema } from "@/amplify/data/resource";

interface OwnPurchaseHistoryPresentationProps {
	purchaseHistories: Schema["PurchaseHistory"]["type"][];
}

export const OwnPurchaseHistoryPresentation = ({
	purchaseHistories,
}: OwnPurchaseHistoryPresentationProps) => {
	return purchaseHistories.map((purchaseHistory) => (
		<p key={uuidV4()}>{purchaseHistory.knittingPatternSlug}</p>
	));
};
