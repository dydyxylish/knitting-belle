import { Bucket } from "aws-cdk-lib/aws-s3";

import { env } from "@/lib/env.js";
import type { BackendInstance } from "./types.js";

export function configureSeedBucket(backend: BackendInstance) {
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
}
