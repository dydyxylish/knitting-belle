import {
	AdminCreateUserCommand,
	AdminSetUserPasswordCommand,
	CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { faker } from "@faker-js/faker";
import type { AuthSession } from "aws-amplify/auth";

import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";
import { parseAmplifyOutputs } from "../amplify/parseAmplifyOutputs";
import { FETCH_AUTH_SESSION_ENDPOINT } from "../const";
import { generatePassword } from "./generatePassword";

const log = getLogger(import.meta.url);

export const createTestUser = async () => {
	log.info("テストユーザー作成処理を開始");

	const response = await fetch(FETCH_AUTH_SESSION_ENDPOINT, {
		method: "POST",
		body: JSON.stringify({
			username: env.TEST_ADMIN_USERNAME,
			password: env.TEST_ADMIN_PASSWORD,
		}),
	});

	log.debug({ status: response.status }, "認証セッション取得レスポンス");

	const authSession = (await response.json()) as AuthSession;

	const outputs = parseAmplifyOutputs();
	const credentials = {
		accessKeyId: authSession.credentials?.accessKeyId || "",
		secretAccessKey: authSession.credentials?.secretAccessKey || "",
		sessionToken: authSession.credentials?.sessionToken,
		expiration: new Date(authSession.credentials?.expiration || 0),
	};

	log.debug({ region: outputs.auth.aws_region }, "Cognitoクライアントを初期化");

	const client = new CognitoIdentityProviderClient({
		region: outputs.auth.aws_region,
		credentials,
	});
	const username = faker.internet.exampleEmail();
	const password = generatePassword();

	log.info({ username }, "テストユーザーを作成します");

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
		const sub =
			createdUser?.Attributes?.find((attribute) => attribute.Name === "sub")
				?.Value || "";

		log.info({ username, sub }, "テストユーザーの作成が完了しました");

		return { username, password, sub };
	} catch (error) {
		log.error({ error, username }, "failed to create test user");
		throw error;
	}
};
