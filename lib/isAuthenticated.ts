import "server-only";
import { fetchAuthSession } from "aws-amplify/auth/server";

import { runWithServerContext } from "@/app/_lib/createAmplifyServerRunner";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const isAuthenticated = async () => {
	const authenticated = await runWithServerContext(
		async (contextSpec) => {
			try {
				const session = await fetchAuthSession(contextSpec);
				log.debug({ session }, "セッションを取得しました");
				return (
					session.tokens?.accessToken !== undefined &&
					session.tokens?.idToken !== undefined
				);
			} catch (error) {
				log.error({ error }, "セッション取得に失敗しました");
				return false;
			}
		},
		{ withCookies: true },
	);
	return authenticated;
};
