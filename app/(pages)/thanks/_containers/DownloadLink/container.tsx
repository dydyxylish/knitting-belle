import type { Schema } from "@/amplify/data/resource";
import { generateSignedUrl } from "@/app/_lib/fetch/purchaseHistory/generateSignedUrl";
import { DownloadLinkPresentation } from "./presentation";

export interface DownloadLinkContainerProps {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

export const DownloadLinkContainer = async ({
	purchaseHistory,
}: DownloadLinkContainerProps) => {
	const url = await generateSignedUrl(
		`knittingPattern/${purchaseHistory.knittingPatternSlug}.pdf`,
	);
	return (
		<DownloadLinkPresentation
			url={url.href}
			filename={`${purchaseHistory.knittingPatternSlug}.pdf`}
		/>
	);
};
