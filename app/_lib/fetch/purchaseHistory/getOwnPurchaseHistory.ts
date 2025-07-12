import { fetchUserAttributes } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

import { getPurchaseHistoryByOwner } from "@/db/repository/purchaseHistory/getPurchaseHistoryByOwner";
import { getLogger } from "@/lib/logger";
import { runWithAmplifyServerContext } from "../../createAmplifyServerRunner";

const log = getLogger(import.meta.url);

export const getOwnPurchaseHistory = async () =>
	await runWithAmplifyServerContext({
		nextServerContext: { cookies },
		operation: async (contextSpec) => {
			const { sub } = await fetchUserAttributes(contextSpec);
			if (!sub) {
				log.error({ sub }, "認証情報が取得できません");
				return [];
			}
			return getPurchaseHistoryByOwner(sub);
		},
	});
