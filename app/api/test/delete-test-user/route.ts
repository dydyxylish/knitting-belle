import {
	AdminDeleteUserCommand,
	CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { amplifyConfigure } from "@/e2e/playwright/utils/amplify/amplifyConfigure";
import { parseAmplifyOutputs } from "@/e2e/playwright/utils/amplify/parseAmplifyOutputs";
import { runWithServer } from "@/e2e/playwright/utils/amplify/runWithServer";
import { getLogger } from "@/lib/logger";

amplifyConfigure();

const log = getLogger(import.meta.url);

const outputs = parseAmplifyOutputs();

const deleteTestUserSchema = z.object({
	sub: z.string(),
});

export async function POST(req: Request) {
	const { credentials } = await runWithServer(fetchAuthSession);
	const client = new CognitoIdentityProviderClient({
		region: outputs.auth.aws_region,
		credentials,
	});

	const validation = deleteTestUserSchema.safeParse(req.body);
	if (!validation.success) {
		return NextResponse.json(
			{ error: validation.error.message },
			{ status: 400 },
		);
	}

	const { sub } = validation.data;

	try {
		await client.send(
			new AdminDeleteUserCommand({
				UserPoolId: outputs.auth.user_pool_id,
				Username: sub,
			}),
		);
	} catch (error) {
		log.error({ error }, "Error deleting test user");
		return NextResponse.json(
			{ error: "Failed to delete test user" },
			{ status: 500 },
		);
	}
	return NextResponse.json({ success: true });
}
