import { fetchAuthSession } from "aws-amplify/auth/server";
import { cookies } from "next/headers";

import { runWithAmplifyServerContext } from "@/app/_lib/amplifyServerUtils";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const isAuthenticated = async () => {
	const authenticated = await runWithAmplifyServerContext({
		nextServerContext: { cookies },
		operation: async (contextSpec) => {
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
	});
	return authenticated;
};
