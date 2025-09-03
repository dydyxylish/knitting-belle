import dayjs from "dayjs";

import type { Schema } from "@/amplify/data/resource";
import { env } from "@/lib/env";

// expireAtがない場合はfalse（まだ一度も署名付きURLを生成していない。つまりはじめて/thanksページに遷移した状態）
// 有効期限のenv.SIGNED_URL_EXPIRE_WARNING_MINUTES分前までの表示を許可する
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
