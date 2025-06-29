import {
	CognitoIdentityProviderClient,
	ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { fetchAuthSession } from "aws-amplify/auth";

import outputs from "@/amplify_outputs.json";
import { runWithAmplifyServerContext } from "@/app/_lib/amplifyServerUtils";
import { loginAdmin } from "@/app/_lib/loginAdmin";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export const checkUserExistsBySub = async (sub: string): Promise<boolean> => {
	return await runWithAmplifyServerContext({
		nextServerContext: null,
		operation: async () => {
			await loginAdmin();
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

				return !!user?.Enabled;
			} catch (error) {
				log.error({ error }, "Cognitoユーザ取得に失敗しました");
				return false;
			}
		},
	});
};
