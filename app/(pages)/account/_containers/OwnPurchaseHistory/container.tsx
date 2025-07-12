import { v4 as uuidV4 } from "uuid";

import { getOwnPurchaseHistory } from "@/app/_lib/fetch/purchaseHistory/getOwnPurchaseHistory";
import { OrderDetail } from "../OrderDetail";
import { OwnPurchaseHistoryPresentation } from "./presentation";

export const OwnPurchaseHistoryContainer = async () => {
	const ownPurchaseHistories = await getOwnPurchaseHistory();
	return (
		<OwnPurchaseHistoryPresentation>
			{ownPurchaseHistories.map((order) => (
				<OrderDetail key={uuidV4()} purchaseHistory={order} />
			))}
		</OwnPurchaseHistoryPresentation>
	);
};
