import dayjs from "dayjs";

import type { Schema } from "@/amplify/data/resource";
import { env } from "@/lib/env";

// 画面表示してからダウンロードボタンを押すまでの時間を考慮して、有効期限より少し前の時間になっているかをチェックする
export function checkExpireAtIsNear(
	purchaseHistory: Schema["PurchaseHistory"]["type"],
) {
	return (
		purchaseHistory.expireAt &&
		dayjs(purchaseHistory.expireAt).isBefore(
			dayjs().add(env.SIGNED_URL_EXPIRE_WARNING_MINUTES, "minutes"),
		)
	);
}
