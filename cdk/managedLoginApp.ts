#!/usr/bin/env tsx

import * as cdk from "aws-cdk-lib";

import outputs from "@/amplify_outputs.json";
import { ManagedLoginStack } from "./managedLoginStack";

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

	// ManagedLoginStackをデプロイ
	new ManagedLoginStack(app, "ManagedLoginStack", {
		userPoolId,
		userPoolClientId,
		env: {
			account: process.env.CDK_DEFAULT_ACCOUNT,
		},
	});

	console.log("🚀 ManagedLoginStackの構成を開始します...");

	// CDKスタックをシンセサイズ（ここでStackが作成される）
	app.synth();
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
