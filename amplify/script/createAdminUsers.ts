import {
	AdminAddUserToGroupCommand,
	AdminCreateUserCommand,
	AdminSetUserPasswordCommand,
	CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

import outputs from "@/amplify_outputs.json";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

interface CreateUserParams {
	userPoolId: string;
	username: string;
	password: string;
	groupName?: string;
}

async function createUser({
	userPoolId,
	username,
	password,
	groupName,
}: CreateUserParams) {
	const client = new CognitoIdentityProviderClient({
		region: process.env.AWS_REGION || "ap-northeast-1",
	});

	try {
		// ユーザーを作成
		const createUserResult = await client.send(
			new AdminCreateUserCommand({
				UserPoolId: userPoolId,
				Username: username,
				MessageAction: "SUPPRESS", // メール送信・確認不要
				UserAttributes: [
					{
						Name: "locale",
						Value: "ja",
					},
				],
			}),
		);

		log.info({ username }, "ユーザーが作成されました、パスワードを設定します");

		// パスワードを永続化
		await client.send(
			new AdminSetUserPasswordCommand({
				UserPoolId: userPoolId,
				Username: username,
				Password: password,
				Permanent: true,
			}),
		);

		log.info({ username }, "パスワードが設定されました");

		// グループに追加（指定されている場合）
		if (groupName) {
			try {
				await client.send(
					new AdminAddUserToGroupCommand({
						UserPoolId: userPoolId,
						Username: username,
						GroupName: groupName,
					}),
				);
				log.info({ username, groupName }, "ユーザーをグループに追加しました");
			} catch (groupError) {
				log.warn(
					{ username, groupName, error: groupError },
					"グループへの追加に失敗しました（グループが存在しない可能性があります）",
				);
			}
		}

		return createUserResult;
	} catch (error) {
		if (
			(error as Error).name === "UsernameExistsException" ||
			(error as Error).name === "UsernameExistsError"
		) {
			log.warn({ username }, "ユーザーは既に存在します");
			return null;
		}
		throw error;
	}
}

async function main() {
	try {
		// 環境変数の取得
		const adminUsername = process.env.ADMIN_USERNAME;
		const adminPassword = process.env.ADMIN_PASSWORD;
		const testAdminUsername = process.env.TEST_ADMIN_USERNAME;
		const testAdminPassword = process.env.TEST_ADMIN_PASSWORD;

		if (
			!adminUsername ||
			!adminPassword ||
			!testAdminUsername ||
			!testAdminPassword
		) {
			throw new Error("管理者アカウントの環境変数が設定されていません");
		}

		const userPoolId = outputs.auth?.user_pool_id;

		if (!userPoolId) {
			throw new Error(
				"amplify_outputs.jsonからユーザープールIDが取得できません",
			);
		}

		log.info("管理者ユーザーの作成を開始します...");

		// TEST_ADMINユーザーの作成
		await createUser({
			userPoolId,
			username: testAdminUsername,
			password: testAdminPassword,
			groupName: "testAdmin",
		});

		// ADMINユーザーの作成
		await createUser({
			userPoolId,
			username: adminUsername,
			password: adminPassword,
			groupName: "admin",
		});

		log.info("管理者ユーザーの作成が完了しました");
	} catch (error) {
		log.error({ error }, "管理者ユーザーの作成に失敗しました");
		process.exit(1);
	}
}

await main();
