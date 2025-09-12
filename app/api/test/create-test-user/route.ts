import {
	AdminCreateUserCommand,
	AdminSetUserPasswordCommand,
	CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { faker } from "@faker-js/faker";
import { fetchAuthSession } from "aws-amplify/auth/server";
import { NextResponse } from "next/server";

import { amplifyConfigure } from "@/e2e/playwright/utils/amplify/amplifyConfigure";
import { parseAmplifyOutputs } from "@/e2e/playwright/utils/amplify/parseAmplifyOutputs";
import { runWithServer } from "@/e2e/playwright/utils/amplify/runWithServer";
import { generatePassword } from "@/e2e/playwright/utils/auth/generatePassword";
import { getLogger } from "@/lib/logger";

amplifyConfigure();

const log = getLogger(import.meta.url);

const outputs = parseAmplifyOutputs();

export async function POST() {
	const { credentials } = await runWithServer(fetchAuthSession);
	const client = new CognitoIdentityProviderClient({
		region: outputs.auth.aws_region,
		credentials,
	});
	const username = faker.internet.exampleEmail();
	const password = generatePassword();
	let sub = "";

	try {
		const { User: createdUser } = await client.send(
			new AdminCreateUserCommand({
				UserPoolId: outputs.auth.user_pool_id,
				Username: username,
				TemporaryPassword: generatePassword(),
				MessageAction: "SUPPRESS", //メール送信・確認不要
			}),
		);
		log.debug(
			{ username },
			"テストユーザーが作成されました、パスワードを設定します",
		);

		await client.send(
			new AdminSetUserPasswordCommand({
				UserPoolId: outputs.auth.user_pool_id,
				Username: username,
				Password: password,
				Permanent: true,
			}),
		);

		log.debug({ username }, "パスワードが設定されました、subを取得します");

		// subを取得
		sub =
			createdUser?.Attributes?.find((attribute) => attribute.Name === "sub")
				?.Value || "";
	} catch (error) {
		log.error({ error }, "Error creating test user");
		return NextResponse.json(
			{ success: false, error: "Failed to create test user" },
			{ status: 500, statusText: "Failed to create test user" },
		);
	}
	return NextResponse.json({
		success: true,
		data: { username, password, sub },
	});
}
