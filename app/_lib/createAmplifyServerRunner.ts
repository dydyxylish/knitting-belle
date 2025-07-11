import "server-only";
import { createServerRunner } from "@aws-amplify/adapter-nextjs";

import outputs from "@/amplify_outputs.json";
import { env } from "@/lib/env";

export const { runWithAmplifyServerContext, createAuthRouteHandlers } =
	createServerRunner({
		config: outputs,
		runtimeOptions: {
			cookies: {
				domain: env.COOKIE_DOMAIN, // making cookies available to all subdomains
				sameSite: "strict",
				maxAge: 60 * 60 * 24 * 7, // 7 days
			},
		},
	});
