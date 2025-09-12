import type { Schema } from "@/amplify/data/resource";
import "server-only";

import { generateSignedUrl } from "@/app/_lib/fetch/purchaseHistory/generateSignedUrl";
import { checkExpireAtIsNear } from "./checkExpireAtIsNear";

interface getSignedUrlArgs {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

export const getSignedUrl = async ({ purchaseHistory }: getSignedUrlArgs) => {
	let url: string;
	if (purchaseHistory.signedUrl && checkExpireAtIsNear(purchaseHistory)) {
		url = purchaseHistory.signedUrl;
	} else {
		url = await generateSignedUrl({
			knittingPatternSlug: purchaseHistory.knittingPatternSlug,
			user: purchaseHistory.user,
		});
	}
	return url;
};
