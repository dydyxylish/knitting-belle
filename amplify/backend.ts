import { defineBackend } from "@aws-amplify/backend";
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
