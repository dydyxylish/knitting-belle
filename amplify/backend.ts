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

Bucket.fromBucketAttributes(backend.stack, "SeedBucket", {
	bucketArn: "arn:aws:s3:::knitting-belle",
	region: "ap-northeast-1",
});
