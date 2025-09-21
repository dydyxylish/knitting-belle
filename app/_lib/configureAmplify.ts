import "server-only";
import { Amplify } from "aws-amplify";

import outputs from "@/amplify_outputs.json";
import { env } from "@/lib/env";

export const amplifyConfigure = () => {
	if (env.AMPLIFY_PRODUCTION) {
		outputs.auth.oauth.domain = env.MANAGED_LOGIN_DOMAIN || "";
	}
	Amplify.configure(outputs);
};
