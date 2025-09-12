import type { Schema } from "@/amplify/data/resource";
import { getSignedUrl } from "@/app/_lib/fetch/purchaseHistory/getSignedUrl";
import { DownloadLinkPresentation } from "./presentation";

export interface DownloadLinkContainerProps {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

export const DownloadLinkContainer = async ({
	purchaseHistory,
}: DownloadLinkContainerProps) => {
	const url = await getSignedUrl({ purchaseHistory });
	return (
		<DownloadLinkPresentation
			url={url}
			filename={`${purchaseHistory.knittingPatternSlug}.pdf`}
		/>
	);
};
