import {
	AdminDeleteUserCommand,
	CognitoIdentityProviderClient,
	ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import type { AuthSession } from "aws-amplify/auth";

import { env } from "@/lib/env";
import { getLogger } from "@/lib/logger";
import { parseAmplifyOutputs } from "../amplify/parseAmplifyOutputs";
import { FETCH_AUTH_SESSION_ENDPOINT } from "../const";

const log = getLogger(import.meta.url);

export const deleteTestUser = async (sub: string) => {
	log.info({ sub }, "テストユーザー削除処理を開始");

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

	try {
		// sub でユーザーを検索
		log.debug(
			{ sub, userPoolId: outputs.auth.user_pool_id },
			"ユーザー検索を開始",
		);

		const listRes = await client.send(
			new ListUsersCommand({
				UserPoolId: outputs.auth.user_pool_id,
				Filter: `sub = "${sub}"`,
			}),
		);

		const user = listRes.Users?.[0];
		if (!user || !user.Username) {
			log.warn({ sub }, "削除対象のユーザーが見つかりません");
			throw new Error("User not found");
		}

		// Username 取得
		const username = user.Username;
		log.info({ username, sub }, "ユーザーを削除します");

		await client.send(
			new AdminDeleteUserCommand({
				UserPoolId: outputs.auth.user_pool_id,
				Username: username,
			}),
		);

		log.info({ username, sub }, "テストユーザーの削除が完了しました");
	} catch (error) {
		log.error({ error, sub }, "failed to delete test user");
		throw error;
	}
};
