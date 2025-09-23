import { ArnPrincipal, Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import { env } from "../../lib/env.js";
import type { BackendInstance } from "./types.js";

export function configureYarnCraftImageBucket(backend: BackendInstance) {
	const adminRole = backend.auth.resources.groups.admin.role;
	const yarnCraftImageBucket = backend.yarnCraftImageStorage.resources.bucket;

	// admin roleにput権限付与（開発・本番共通）
	yarnCraftImageBucket.addToResourcePolicy(
		//grantPutだと CloudformationStackCircularDependencyError のため
		new PolicyStatement({
			effect: Effect.ALLOW,
			principals: [new ArnPrincipal(adminRole.roleArn)],
			actions: ["s3:GetObject", "s3:ListBucket", "s3:PutObject"],
			resources: [
				yarnCraftImageBucket.bucketArn,
				`${yarnCraftImageBucket.bucketArn}/yarnCraftImage/*`,
			],
		}),
	);

	// 開発環境でのみパブリックアクセスを許可
	if (!env.AMPLIFY_PRODUCTION) {
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

		yarnCraftImageBucket.grantPublicAccess("yarnCraftImage/*");
	}
}
