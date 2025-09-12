import { isNull } from "es-toolkit";
import type { ReactNode } from "react";
import { v4 as uuidV4 } from "uuid";

import { getOwnPurchaseHistory } from "@/app/_lib/fetch/purchaseHistory/getOwnPurchaseHistory";
import { LoginText } from "../../_components/LoginText";
import { LogoutButton } from "../../_components/LogoutButton";
import { ZeroPurchaseHistory } from "../../_components/ZeroPurchaseHistory";
import { OrderDetail } from "../OrderDetail";
import { OwnPurchaseHistoryPresentation } from "./presentation";

export const OwnPurchaseHistoryContainer = async () => {
	const ownPurchaseHistories = await getOwnPurchaseHistory();
	let children: ReactNode;
	if (isNull(ownPurchaseHistories)) {
		children = <LoginText />;
	} else if (ownPurchaseHistories.length === 0) {
		children = [
			<ZeroPurchaseHistory key={uuidV4()} />,
			<LogoutButton key={uuidV4()} />,
		];
	} else {
		children = [
			...ownPurchaseHistories.map((order) => (
				<OrderDetail key={uuidV4()} purchaseHistory={order} />
			)),
			<LogoutButton key={uuidV4()} />,
		];
	}

	return (
		<OwnPurchaseHistoryPresentation>{children}</OwnPurchaseHistoryPresentation>
	);
};
