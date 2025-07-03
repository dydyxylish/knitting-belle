import { getOwnPurchaseHistory } from "@/app/_lib/fetch/purchaseHistory/getOwnPurchaseHistory";
import { OwnPurchaseHistoryPresentation } from "./presentation";

export const OwnPurchaseHistoryContainer = async () => {
	const ownPurchaseHistories = await getOwnPurchaseHistory();
	return (
		<OwnPurchaseHistoryPresentation purchaseHistories={ownPurchaseHistories} />
	);
};
