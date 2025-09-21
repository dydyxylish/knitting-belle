import "server-only";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import type { AmplifyServer } from "aws-amplify/adapter-core";
import { cookies } from "next/headers";

import outputs from "@/amplify_outputs.json";
import { env } from "@/lib/env";

if (env.AMPLIFY_PRODUCTION) {
	outputs.auth.oauth.domain = env.MANAGED_LOGIN_DOMAIN || "";
}

export const { runWithAmplifyServerContext, createAuthRouteHandlers } =
	createServerRunner({
		config: outputs,
		runtimeOptions: {
			cookies: {
				domain: env.COOKIE_DOMAIN, // making cookies available to all subdomains
				sameSite: "lax",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			},
		},
	});

export const runWithServerContext = async <T>(
	operation: (contextSpec: AmplifyServer.ContextSpec) => Promise<T>,
	options: { withCookies: boolean } = { withCookies: false },
): Promise<T> => {
	return await runWithAmplifyServerContext({
		nextServerContext: options.withCookies ? { cookies } : null,
		operation,
	});
};
