import "server-only";
import { fetchUserAttributes } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

import { getLogger } from "@/lib/logger";
import { runWithAmplifyServerContext } from "../../amplifyServerUtils";

export const dynamic = "force-dynamic";

const log = getLogger(import.meta.url);

export default async function getUserInfo() {
	try {
		const userInfo = await runWithAmplifyServerContext({
			nextServerContext: { cookies },
			operation: (contextSpec) => fetchUserAttributes(contextSpec),
		});
		return userInfo;
	} catch (error) {
		log.error({ error }, "ユーザ情報の取得に失敗しました");
		return null;
	}
}
