import { redirect } from "next/navigation";

import { checkExpireAtIsNear } from "@/app/_lib/fetch/purchaseHistory/checkExpireAtIsNear";
import { validateStripeSession } from "@/app/_lib/fetch/purchaseHistory/validateStripeSession";
import { getLogger } from "@/lib/logger";
import { DownloadLink } from "../DownloadLink";
import { ErrorDisplay } from "../ErrorDisplay";
import { OrderSummary } from "../OrderSummary";
import { ValidateWrapperPresentation } from "./presentation";

const log = getLogger(import.meta.url);

export interface ValidateWrapperContainerProps {
	sessionId?: string;
}

export const ValidateWrapperContainer = async ({
	sessionId,
}: ValidateWrapperContainerProps) => {
	if (!sessionId) redirect("/");

	// セッションIDからStripeで検証 & DBで購入履歴チェック
	const purchaseHistory = await validateStripeSession(sessionId);
	if (!purchaseHistory) {
		log.error({ purchaseHistory }, "購入履歴データが作成されていません");
		return <ErrorDisplay error="PURCHASE_HISTORY_NOT_FOUND" />;
	}

	if (checkExpireAtIsNear(purchaseHistory)) {
		log.error(
			{ purchaseHistory },
			"有効期限を過ぎた購入履歴の取得を検出しました",
		);
		return <ErrorDisplay error="PURCHASE_EXPIRED" />;
	}

	return (
		<ValidateWrapperPresentation>
			<DownloadLink purchaseHistory={purchaseHistory} />
			<OrderSummary purchaseHistory={purchaseHistory} />
		</ValidateWrapperPresentation>
	);
};
