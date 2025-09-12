import {
	mutatePurchaseHistorySignedUrl,
	type mutatePurchaseHistorySignedUrlArgs,
} from "@/db/query/purchaseHistory/mutatePurchaseHistorySignedUrl";

export const updatePurchaseHistorySignedUrl = (
	args: mutatePurchaseHistorySignedUrlArgs,
) => mutatePurchaseHistorySignedUrl(args);
