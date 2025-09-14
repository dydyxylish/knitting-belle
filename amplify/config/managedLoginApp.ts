#!/usr/bin/env tsx

import * as cdk from "aws-cdk-lib";

import outputs from "@/amplify_outputs.json";
import { CognitoCustomDomainAcmStack } from "./cognitoCustomDomainACMStack";
import { ManagedLoginStack } from "./managedLoginStack";
import { updateAmplifyOutputsDomain } from "./updateAmplifyOutputsDomain";

/**
 * ManagedLoginStack用のCDK Appエントリーポイント
 * Amplify backendデプロイ後に実行される
 */
const app = new cdk.App();

try {
	const userPoolId = outputs.auth?.user_pool_id;
	const userPoolClientId = outputs.auth?.user_pool_client_id;

	if (!userPoolId || !userPoolClientId) {
		throw new Error(
			"amplify_outputs.json に必要な認証情報が見つかりません。auth.user_pool_id または auth.user_pool_client_id が不足しています。",
		);
	}
	const cognitoCustomDomainAcmStack = new CognitoCustomDomainAcmStack(
		app,
		"CognitoCustomDomainAcmStack",
		{
			env: {
				account: process.env.CDK_DEFAULT_ACCOUNT,
				region: "us-east-1", // Cognito ManagedLoginのACM証明書はus-east-1で作成される
			},
			crossRegionReferences: true,
		},
	);

	// ManagedLoginStackをデプロイ
	new ManagedLoginStack(app, "ManagedLoginStack", {
		userPoolId,
		userPoolClientId,
		certificate: cognitoCustomDomainAcmStack.certificate,
		env: {
			account: process.env.CDK_DEFAULT_ACCOUNT,
			region: "ap-northeast-1",
		},
		crossRegionReferences: true,
	});

	console.log("🚀 ManagedLoginStackの構成を開始します...");

	// CDKスタックをシンセサイズ（ここでStackが作成される）
	app.synth();

	// ManagedLoginStackが正常にデプロイされた場合、amplify_outputs.jsonを更新
	const managedLoginDomain = process.env.MANAGED_LOGIN_DOMAIN;
	if (managedLoginDomain) {
		try {
			await updateAmplifyOutputsDomain(managedLoginDomain);
			console.log(
				`✅ amplify_outputs.jsonのdomainを更新しました: ${managedLoginDomain}`,
			);
		} catch (updateError) {
			console.error("⚠️ amplify_outputs.json更新エラー:", updateError);
		}
	} else {
		console.log(
			"ℹ️ MANAGED_LOGIN_DOMAINが設定されていないため、domain更新をスキップします",
		);
	}
} catch (error) {
	console.error("❌ ManagedLoginStack構成エラー:", error);
	console.error("");
	console.error("解決方法:");
	console.error("1. Amplify backendが正常にデプロイされていることを確認");
	console.error("2. amplify_outputs.jsonファイルが存在することを確認");
	console.error("3. 'npx ampx generate outputs --format ts' を実行");
	console.error("4. 'pnpm sandbox' でAmplify backendを再デプロイ");
	process.exit(1);
}
