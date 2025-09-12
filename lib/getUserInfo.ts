import "server-only";
import { fetchUserAttributes } from "aws-amplify/auth/server";

import { getLogger } from "@/lib/logger";
import { runWithServerContext } from "../app/_lib/createAmplifyServerRunner";

export const dynamic = "force-dynamic";

const log = getLogger(import.meta.url);

export const getCurrentUserInfo = async () => {
	try {
		const userInfo = await runWithServerContext(fetchUserAttributes, {
			withCookies: true,
		});
		return userInfo;
	} catch (error) {
		log.error({ error }, "ユーザ情報の取得に失敗しました");
		return null;
	}
};
