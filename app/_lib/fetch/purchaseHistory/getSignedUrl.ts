import type { Schema } from "@/amplify/data/resource";
import "server-only";
import dayjs from "dayjs";

import { generateSignedUrl } from "@/app/_lib/fetch/purchaseHistory/generateSignedUrl";

interface getSignedUrlArgs {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

export const getSignedUrl = async ({ purchaseHistory }: getSignedUrlArgs) => {
	let url: string;
	if (
		purchaseHistory.expireAt &&
		purchaseHistory.signedUrl &&
		dayjs(purchaseHistory.expireAt).isAfter(dayjs())
	) {
		url = purchaseHistory.signedUrl;
	} else {
		url = await generateSignedUrl({
			knittingPatternSlug: purchaseHistory.knittingPatternSlug,
			user: purchaseHistory.user,
		});
	}
	return url;
};
