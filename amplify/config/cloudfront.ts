import * as certificatemanager from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import type { Construct } from "constructs";

import { env } from "@/lib/env";
import type { BackendInstance } from "./types";

export function configureCloudFront(backend: BackendInstance) {
	// 本番環境でのみCloudFrontを作成
	if (!env.AMPLIFY_PRODUCTION) {
		return;
	}

	const yarnCraftImageBucket = backend.yarnCraftImageStorage.resources.bucket;

	// CloudFrontとcertificateを同じバケットのスコープ内で作成して循環依存を回避
	const bucketScope = yarnCraftImageBucket.node.scope as Construct;

	// SSL証明書を取得
	const certificate = certificatemanager.Certificate.fromCertificateArn(
		bucketScope,
		"Certificate",
		env.CERTIFICATE_ARN || "",
	);

	// CloudFrontディストリビューションを作成
	const distribution = new cloudfront.Distribution(
		bucketScope,
		"YarnCraftImageDistribution",
		{
			defaultBehavior: {
				origin: origins.S3BucketOrigin.withOriginAccessControl(
					yarnCraftImageBucket,
					{
						originPath: "/",
						originAccessLevels: [cloudfront.AccessLevel.READ],
					},
				),
				viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				compress: true,
				cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
			},
			domainNames: [env.CDN_DOMAIN || ""],
			certificate: certificate,
			comment: "CloudFront distribution for yarn craft images",
		},
	);

	// Route53でホストゾーンをIDで取得（fromLookupはAmplify環境では使用不可）
	const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
		bucketScope,
		"HostedZone",
		{
			hostedZoneId: env.HOSTZONE_ID || "",
			zoneName: env.HOSTZONE_NAME || "",
		},
	);

	new route53.ARecord(bucketScope, "StaticDevAliasRecord", {
		zone: hostedZone,
		recordName: env.CDN_SUBDOMAIN || "",
		target: route53.RecordTarget.fromAlias(
			new targets.CloudFrontTarget(distribution),
		),
	});

	// outputsにcdnDomainを追加
	backend.addOutput({
		custom: {
			cdnDomain: env.CDN_DOMAIN || "",
		},
	});
}
