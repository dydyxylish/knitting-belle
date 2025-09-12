import type { Schema } from "@/amplify/data/resource";
import { getSignedUrl } from "@/app/_lib/fetch/purchaseHistory/getSignedUrl";
import { DownloadButtonPresentation } from "./presentation";

export interface DownloadButtonContainerProps {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

export const DownloadButtonContainer = async ({
	purchaseHistory,
}: DownloadButtonContainerProps) => {
	const url = await getSignedUrl({ purchaseHistory });
	return (
		<DownloadButtonPresentation
			url={url}
			filename={`${purchaseHistory.knittingPatternSlug}.pdf`}
		/>
	);
};
