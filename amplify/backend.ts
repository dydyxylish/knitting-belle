import { defineBackend } from "@aws-amplify/backend";
import * as cognito from "aws-cdk-lib/aws-cognito";
import {
	ArnPrincipal,
	Effect,
	Policy,
	PolicyStatement,
} from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";

import { env } from "@/lib/env.js";
import managedLoginSettings from "./auth/managedLoginBrandingSettings.json";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import {
	knittingPatternStorage,
	yarnCraftImageStorage,
} from "./storage/resource.js";

const backend = defineBackend({
	auth,
	data,
	knittingPatternStorage,
	yarnCraftImageStorage,
});
const adminRole = backend.auth.resources.groups.admin.role;

// 編み図バケットの登録
const seedBucket = Bucket.fromBucketAttributes(backend.stack, "seedBucket", {
	bucketArn: env.SEED_BUCKET_ARN,
	region: env.SEED_BUCKET_REGION,
});

seedBucket.grantRead(adminRole);

backend.addOutput({
	storage: {
		buckets: [
			{
				bucket_name: seedBucket.bucketName,
				aws_region: seedBucket.env.region,
				name: "seedBucket",
			},
		],
	},
});

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

// 編み図作品画像へのpublic　access許可、admin roleにput権限付与
const cfnYarnCraftImageBucket =
	backend.yarnCraftImageStorage.resources.cfnResources.cfnBucket;
cfnYarnCraftImageBucket.addPropertyOverride(
	"PublicAccessBlockConfiguration.BlockPublicPolicy",
	false,
);
cfnYarnCraftImageBucket.addPropertyOverride(
	"PublicAccessBlockConfiguration.RestrictPublicBuckets",
	false,
);

const yarnCraftImageBucket = backend.yarnCraftImageStorage.resources.bucket;
yarnCraftImageBucket.grantPublicAccess("yarnCraftImage/*");
yarnCraftImageBucket.addToResourcePolicy(
	//grantPutだと CloudformationStackCircularDependencyError のため
	new PolicyStatement({
		effect: Effect.ALLOW,
		principals: [new ArnPrincipal(adminRole.roleArn)],
		actions: ["s3:PutObject"],
		resources: [`${yarnCraftImageBucket.bucketArn}/yarnCraftImage/*`],
	}),
);

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
