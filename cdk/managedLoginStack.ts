import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";

import managedLoginSettings from "@/amplify/auth/managedLoginBrandingSettings.json";

interface ManagedLoginStackProps extends cdk.StackProps {
	userPoolId: string;
	userPoolClientId: string;
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

		const certificate = acm.Certificate.fromCertificateArn(
			this,
			"CognitoCertificate",
			process.env.CERTIFICATE_ARN || "",
		);

		// Hosted UI 用カスタムドメイン
		const userPoolDomain = userPool.addDomain("CognitoDomain", {
			customDomain: {
				certificate: certificate,
				domainName: process.env.MANAGED_LOGIN_DOMAIN || "",
			},
			managedLoginVersion: cognito.ManagedLoginVersion.NEWER_MANAGED_LOGIN,
		});

		// Route53 HostedZone 参照
		const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
			this,
			"HostedZone",
			{
				hostedZoneId: process.env.HOSTZONE_ID || "",
				zoneName: process.env.HOSTZONE_NAME || "",
			},
		);

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
