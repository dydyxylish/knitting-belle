import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import outputs from "@/amplify_outputs.json";
/**
 * amplify_outputs.jsonのauth.oauth.domainフィールドを更新する関数
 * @param newDomain - 新しいドメイン名
 */
export async function updateAmplifyOutputsDomain(
	newDomain: string,
): Promise<void> {
	// ES ModulesでのファイルパスとディレクトリPath取得
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	const amplifyOutputsPath = path.resolve(
		__dirname,
		"../../amplify_outputs.json",
	);

	// auth.oauth.domainフィールドを更新
	if (outputs.auth?.oauth) {
		outputs.auth.oauth.domain = newDomain;

		// ファイルに書き戻し（整形付き）
		fs.writeFileSync(
			amplifyOutputsPath,
			JSON.stringify(outputs, null, 2),
			"utf8",
		);
	} else {
		throw new Error("amplify_outputs.jsonにauth.oauth設定が見つかりません");
	}
}
