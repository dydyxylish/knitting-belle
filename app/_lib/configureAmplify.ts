import "server-only";
import { Amplify } from "aws-amplify";

import outputs from "@/amplify_outputs.json";
import { env } from "@/lib/env";
import type { AmplifyOutputsWithCustom } from "@/lib/type";

export const amplifyConfigure = () => {
	const typedOutputs = outputs as AmplifyOutputsWithCustom;

	if (env.AMPLIFY_PRODUCTION && typedOutputs.custom?.managedLoginDomain) {
		typedOutputs.auth.oauth.domain = typedOutputs.custom.managedLoginDomain;
	}
	Amplify.configure(typedOutputs);
};
