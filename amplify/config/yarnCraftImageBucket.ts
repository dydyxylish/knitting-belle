import { ArnPrincipal, Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

import type { BackendInstance } from "./types.js";

export function configureYarnCraftImageBucket(backend: BackendInstance) {
	const adminRole = backend.auth.resources.groups.admin.role;

	// 編み図作品画像へのpublic access許可、admin roleにput権限付与
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
}
