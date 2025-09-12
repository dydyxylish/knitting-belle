import { AuthError } from "aws-amplify/auth";
import { fetchUserAttributes } from "aws-amplify/auth/server";

import { getPurchaseHistoryByOwner } from "@/db/repository/purchaseHistory/getPurchaseHistoryByOwner";
import { getLogger } from "@/lib/logger";
import { runWithServerContext } from "../../createAmplifyServerRunner";

const log = getLogger(import.meta.url);

export const getOwnPurchaseHistory = async () =>
	await runWithServerContext(
		async (contextSpec) => {
			try {
				const { sub } = await fetchUserAttributes(contextSpec);
				if (!sub) {
					log.error({ sub }, "認証情報が取得できません");
					throw new Error("認証情報が取得できません");
				}
				return getPurchaseHistoryByOwner(sub);
			} catch (error) {
				if (error instanceof AuthError) {
					log.debug({ error }, "購入履歴の閲覧にはログインが必要です");
					return null;
				}
				log.error({ error }, "AuthError以外のエラーです");
				throw new Error("AuthError以外のエラーです");
			}
		},
		{ withCookies: true },
	);
