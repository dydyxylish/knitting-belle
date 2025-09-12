import * as cognito from "aws-cdk-lib/aws-cognito";

import managedLoginSettings from "../auth/managedLoginBrandingSettings.json";
import type { BackendInstance } from "./types.js";

export function configureManagedLoginBranding(backend: BackendInstance) {
	// TODO: カスタムドメイン追加時に、マネージドログインを有効化
	// TODO: 検証メッセージ(メールテンプレート)を日本語化
	new cognito.CfnManagedLoginBranding(
		backend.auth.stack,
		"KnittingBelleManagedLoginBranding",
		{
			userPoolId: backend.auth.resources.userPool.userPoolId,
			clientId: backend.auth.resources.userPoolClient.userPoolClientId,
			settings: managedLoginSettings,
		},
	);
}
