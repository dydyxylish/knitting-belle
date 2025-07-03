import { redirect } from "next/navigation";

import { validateStripeSession } from "@/app/_lib/validateStripeSession";
import { getLogger } from "@/lib/logger";
import { DownloadLink } from "../DownloadLink";
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
		throw new Error("購入履歴データが作成されていません");
	}
	return (
		<ValidateWrapperPresentation purchaseHistory={purchaseHistory}>
			<DownloadLink purchaseHistory={purchaseHistory} />
			{/* <OrderSummary /> */}
		</ValidateWrapperPresentation>
	);
};
