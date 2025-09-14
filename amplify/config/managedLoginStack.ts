import * as cdk from "aws-cdk-lib";
import type * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";

import managedLoginSettings from "../auth/managedLoginBrandingSettings.json";

interface ManagedLoginStackProps extends cdk.StackProps {
	userPoolId: string;
	userPoolClientId: string;
	certificate: acm.ICertificate;
}

export class ManagedLoginStack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props: ManagedLoginStackProps) {
		super(scope, id, props);

		// 環境変数または引数からUserPoolを参照
		const userPool = cognito.UserPool.fromUserPoolId(
			this,
			"ExistingUserPool",
			props.userPoolId,
		);

		// Hosted UI 用カスタムドメイン
		const userPoolDomain = userPool.addDomain("CognitoDomain", {
			customDomain: {
				certificate: props.certificate,
				domainName: process.env.MANAGED_LOGIN_DOMAIN || "",
			},
			managedLoginVersion: cognito.ManagedLoginVersion.NEWER_MANAGED_LOGIN,
		});

		// Route53 HostedZone 参照
		const hostedZone = route53.HostedZone.fromLookup(this, "HostedZone", {
			domainName: process.env.HOSTED_ZONE_DOMAIN || "",
		});

		// Route53 Aレコード
		new route53.ARecord(this, "CognitoAliasRecord", {
			zone: hostedZone,
			recordName: process.env.MANAGED_LOGIN_SUBDOMAIN || "",
			target: route53.RecordTarget.fromAlias(
				new targets.UserPoolDomainTarget(userPoolDomain),
			),
		});

		new cognito.CfnManagedLoginBranding(
			this,
			"KnittingBelleManagedLoginBranding",
			{
				userPoolId: props.userPoolId,
				clientId: props.userPoolClientId,
				settings: managedLoginSettings,
			},
		);
	}
}
