import { defineBackend } from "@aws-amplify/backend";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Bucket } from "aws-cdk-lib/aws-s3";

import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";
import { storage } from "./storage/resource.js";

const backend = defineBackend({
	auth,
	data,
	storage,
});

const seedBucket = Bucket.fromBucketAttributes(backend.stack, "seedBucket", {
	bucketArn: "arn:aws:s3:::knitting-belle",
	region: "ap-northeast-1",
});

seedBucket.grantRead(backend.auth.resources.groups.admin.role);

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

const cognitoUserPoolListPolicy = new Policy(
	backend.auth.stack,
	"cogintoUserPoolListPolicy",
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

backend.auth.resources.groups.admin.role.attachInlinePolicy(
	cognitoUserPoolListPolicy,
);
