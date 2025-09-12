import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import type { AmplifyServer } from "aws-amplify/adapter-core";
import { cookies } from "next/headers";

import { parseAmplifyOutputs } from "./parseAmplifyOutputs";

const outputs = parseAmplifyOutputs();

export const { runWithAmplifyServerContext } = createServerRunner({
	config: outputs,
});

export const runWithServer = async <T>(
	operation: (contextSpec: AmplifyServer.ContextSpec) => Promise<T>,
): Promise<T> => {
	return await runWithAmplifyServerContext({
		nextServerContext: { cookies },
		operation,
	});
};
