import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";

import { env } from "@/lib/env";
import managedLoginSettings from "../auth/managedLoginBrandingSettings.json";
import type { BackendInstance } from "./types";

export function configureManagedLogin(backend: BackendInstance) {
	const userPool = backend.auth.resources.userPool;
	const userPoolClient = backend.auth.resources.userPoolClient;
	const managedLoginStack = backend.createStack("ManagedLoginStack");

	// SSL証明書を取得
	const certificate = acm.Certificate.fromCertificateArn(
		managedLoginStack,
		"Certificate",
		env.CERTIFICATE_ARN || "",
	);

	// Hosted UI 用カスタムドメイン
	const userPoolDomain = userPool.addDomain("CognitoDomain", {
		customDomain: {
			certificate: certificate,
			domainName: process.env.MANAGED_LOGIN_DOMAIN || "",
		},
		managedLoginVersion: cognito.ManagedLoginVersion.NEWER_MANAGED_LOGIN,
	});

	// Route53でホストゾーンをIDで取得（fromLookupはAmplify環境では使用不可）
	const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
		managedLoginStack,
		"HostedZone",
		{
			hostedZoneId: env.HOSTZONE_ID || "",
			zoneName: env.HOSTZONE_NAME || "",
		},
	);

	// Route53 Aレコード
	new route53.ARecord(managedLoginStack, "CognitoAliasRecord", {
		zone: hostedZone,
		recordName: process.env.MANAGED_LOGIN_SUBDOMAIN || "",
		target: route53.RecordTarget.fromAlias(
			new targets.UserPoolDomainTarget(userPoolDomain),
		),
	});

	new cognito.CfnManagedLoginBranding(
		managedLoginStack,
		"KnittingBelleManagedLoginBranding",
		{
			userPoolId: userPool.userPoolId,
			clientId: userPoolClient.userPoolClientId,
			settings: managedLoginSettings,
		},
	);

	// outputsにmanagedLoginDomainを追加
	backend.addOutput({
		custom: {
			managedLoginDomain: userPoolDomain.domainName,
		},
	});
}
