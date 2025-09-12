import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";

import type { BackendInstance } from "./types.js";

export function configureCognitoPolicies(backend: BackendInstance) {
	const adminRole = backend.auth.resources.groups.admin.role;
	const testAdminRole = backend.auth.resources.groups.testAdmin.role;

	// Cognitoユーザープールへのアクセス権付与
	const cognitoUserPoolListPolicy = new Policy(
		backend.auth.stack,
		"cognitoUserPoolListPolicy",
		{
			policyName: "cognitoUserPoolListPolicy",
			statements: [
				new PolicyStatement({
					actions: ["cognito-idp:ListUsers", "cognito-idp:DescribeUserPool"],
					resources: [backend.auth.resources.userPool.userPoolArn],
				}),
			],
		},
	);
	adminRole.attachInlinePolicy(cognitoUserPoolListPolicy);

	// テスト用adminユーザーにCreateUser権限付与
	const cognitoUserPoolCreateUserPolicy = new Policy(
		backend.auth.stack,
		"cognitoUserPoolCreateUserPolicy",
		{
			policyName: "cognitoUserPoolCreateUserPolicy",
			statements: [
				new PolicyStatement({
					actions: [
						"cognito-idp:AdminCreateUser",
						"cognito-idp:AdminSetUserPassword",
						"cognito-idp:AdminDeleteUser",
						"cognito-idp:ListUsers",
					],
					resources: [backend.auth.resources.userPool.userPoolArn],
				}),
			],
		},
	);
	testAdminRole.attachInlinePolicy(cognitoUserPoolCreateUserPolicy);
}
