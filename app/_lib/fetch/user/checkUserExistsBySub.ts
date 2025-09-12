import {
	CognitoIdentityProviderClient,
	ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { fetchAuthSession } from "aws-amplify/auth";

import outputs from "@/amplify_outputs.json";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const checkUserExistsBySub = async (sub: string) => async () => {
	const { credentials } = await fetchAuthSession();

	const client = new CognitoIdentityProviderClient({
		region: outputs.auth.aws_region,
		credentials: credentials,
	});

	const command = new ListUsersCommand({
		UserPoolId: outputs.auth.user_pool_id,
		Filter: `sub = "${sub}"`,
		Limit: 1,
	});

	try {
		const response = await client.send(command);
		const user = response.Users?.[0];
		log.info({ user }, "user");

		if (!user?.Enabled) {
			log.error("有効なユーザではありません");
			throw new Error("有効なユーザではありません");
		}
	} catch (error) {
		log.error({ error }, "Cognitoユーザ取得に失敗しました");
		throw new Error("Cognitoユーザ取得に失敗しました");
	}
};
