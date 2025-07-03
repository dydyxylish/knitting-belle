import { defineAuth, secret } from "@aws-amplify/backend";

import { env } from "@/lib/env";

export const auth = defineAuth({
	loginWith: {
		email: true,
		externalProviders: {
			google: {
				clientId: secret("GOOGLE_CLIENT_ID"),
				clientSecret: secret("GOOGLE_CLIENT_SECRET"),
				scopes: ["email"],
				attributeMapping: {
					email: "email",
				},
			},
			callbackUrls: env.GOOGLE_CALLBACK_URLS,
			logoutUrls: env.GOOGLE_LOGOUT_URLS,
		},
	},
	groups: ["admin"],
});
