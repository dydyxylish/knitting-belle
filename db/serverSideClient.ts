import "server-only";

import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import { generateClient } from "aws-amplify/data";
import { cookies } from "next/headers";

import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";

export const dbClient = generateClient<Schema>({ authMode: "identityPool" });

export const dbClientWithAuth = generateClient<Schema>({
	authMode: "userPool",
});

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
	config: outputs,
	cookies,
});
