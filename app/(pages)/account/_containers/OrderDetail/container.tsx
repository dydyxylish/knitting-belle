import type { Schema } from "@/amplify/data/resource";
import { getCachedKnittingPattern } from "@/app/_lib/fetch/knittingPattern/getCachedKnittingPattern";
import { DownloadButton } from "../DownloadButton.tsx";
import { OrderDetailImage } from "../OrderDetailImage";
import { OrderDetailPresentation } from "./presentation";

export interface OrderDetailContainerProps {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

export const OrderDetailContainer = async ({
	purchaseHistory,
}: OrderDetailContainerProps) => {
	const knittingPattern = await getCachedKnittingPattern(
		purchaseHistory.knittingPatternSlug,
	);
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
