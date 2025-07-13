import { isNull } from "es-toolkit";

import type { Schema } from "@/amplify/data/resource";
import { getKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getKnittingPattern";
import { DownloadButton } from "../DownloadButton";
import { OrderDetailImage } from "../OrderDetailImage";
import { OrderDetailPresentation } from "./presentation";

export interface OrderDetailContainerProps {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

export const OrderDetailContainer = async ({
	purchaseHistory,
}: OrderDetailContainerProps) => {
	const knittingPattern = await getKnittingPattern(
		purchaseHistory.knittingPatternSlug,
	);
	if (isNull(knittingPattern)) throw new Error("編み図が取得できませんでした");
	return (
		<OrderDetailPresentation
			knittingPattern={knittingPattern}
			purchaseHistory={purchaseHistory}
			downloadButton={<DownloadButton purchaseHistory={purchaseHistory} />}
		>
			<OrderDetailImage knittingPattern={knittingPattern} />
		</OrderDetailPresentation>
	);
};
