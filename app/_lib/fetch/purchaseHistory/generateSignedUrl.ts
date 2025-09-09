import { getUrl } from "aws-amplify/storage";
import dayjs from "dayjs";

import { updatePurchaseHistorySignedUrl } from "@/db/repository/purchaseHistory/updatePurchaseHistorySignedUrl";
import { env } from "@/lib/env";
import { loginAdmin } from "../../loginAdmin";

export interface generateSignedUrlArgs {
	knittingPatternSlug: string;
	user: string;
}

export const generateSignedUrl = async ({
	knittingPatternSlug,
	user,
}: generateSignedUrlArgs) => {
	await loginAdmin();
	const knittingPatternPdf = await getUrl({
		path: `knittingPattern/${knittingPatternSlug}.pdf`,
		options: {
			expiresIn: 60 * env.SIGNED_URL_EXPIRE_MINUTES,
			bucket: "knittingPatternBucket",
		},
	});
	await updatePurchaseHistorySignedUrl({
		knittingPatternSlug,
		user,
		expireAt: dayjs(knittingPatternPdf.expiresAt).toISOString(),
		signedUrl: knittingPatternPdf.url.href,
	});
	return knittingPatternPdf.url.href;
};
