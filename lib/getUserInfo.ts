import "server-only";
import { fetchUserAttributes } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

import { getLogger } from "@/lib/logger";
import { runWithAmplifyServerContext } from "../app/_lib/createAmplifyServerRunner";

export const dynamic = "force-dynamic";

const log = getLogger(import.meta.url);

export const getCurrentUserInfo = async () => {
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
};
