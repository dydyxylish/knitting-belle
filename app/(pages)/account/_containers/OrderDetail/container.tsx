import { isNull } from "es-toolkit";

import type { Schema } from "@/amplify/data/resource";
import { runWithServerContext } from "@/app/_lib/createAmplifyServerRunner";
import { getKnittingPatternCookie } from "@/db/repository/knittingPattern/getKnittingPatternCookie";
import { DownloadButton } from "../DownloadButton";
import { OrderDetailImage } from "../OrderDetailImage";
import { OrderDetailPresentation } from "./presentation";

export interface OrderDetailContainerProps {
	purchaseHistory: Schema["PurchaseHistory"]["type"];
}

export const OrderDetailContainer = async ({
	purchaseHistory,
}: OrderDetailContainerProps) => {
	const knittingPattern = await runWithServerContext(
		async () =>
			await getKnittingPatternCookie(purchaseHistory.knittingPatternSlug),
		{ withCookies: true },
	);
	if (isNull(knittingPattern)) throw new Error("編み図が取得できませんでした");
	return (
		<OrderDetailPresentation
			knittingPattern={knittingPattern}
			purchaseHistory={purchaseHistory}
			downloadButton={<DownloadButton purchaseHistory={purchaseHistory} />}
		>
			<OrderDetailImage knittingPattern={knittingPattern} />
		</OrderDetailPresentation>
	);
};
