import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import { generateClient } from "aws-amplify/data";
import { cookies } from "next/headers";

import type { Schema } from "@/amplify/data/resource";
import { parseAmplifyOutputs } from "../amplify/parseAmplifyOutputs";

export const dbClient = generateClient<Schema>({ authMode: "identityPool" });

export const dbClientWithAuth = generateClient<Schema>({
	authMode: "userPool",
});

const outputs = parseAmplifyOutputs();

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
	config: outputs,
	cookies,
});
