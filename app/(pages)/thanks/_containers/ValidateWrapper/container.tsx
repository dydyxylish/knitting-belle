import { redirect } from "next/navigation";

import { validateStripeSession } from "@/app/_lib/validateStripeSession";
import { DownloadLink } from "../DownloadLink";
import { ValidateWrapperPresentation } from "./presentation";

export interface ValidateWrapperContainerProps {
	sessionId?: string;
}

export const ValidateWrapperContainer = async ({
	sessionId,
}: ValidateWrapperContainerProps) => {
	if (!sessionId) redirect("/");
	// セッションIDからStripeで検証 & DBで購入履歴チェック
	const purchaseHistory = await validateStripeSession(sessionId);
	// TODO: エラー画面に遷移
	if (!purchaseHistory) redirect("/");
	return (
		<ValidateWrapperPresentation purchaseHistory={purchaseHistory}>
			<DownloadLink purchaseHistory={purchaseHistory} />
			{/* <OrderSummary /> */}
		</ValidateWrapperPresentation>
	);
};
