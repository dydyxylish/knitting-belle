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

const ownResourceStack = backend.createStack("own-resource-stack");

const seedBucket = Bucket.fromBucketAttributes(ownResourceStack, "SeedBucket", {
	bucketArn: "arn:aws:s3:::knitting-belle",
	region: "ap-northeast-1",
});

backend.addOutput({
	storage: {
		bucket_name: seedBucket.bucketArn,
	},
});
