import path from "node:path";
/**
 * JSONファイルパスからsubを抽出
 * xxx/yyy/${filename}.${sub}.json 形式のパスから sub 部分を取得
 * @param filePath - JSONファイルのパス (例: "xxx/yyy/auth.user123.json")
 * @returns sub部分の文字列 (例: "user123")
 */
export function extractSubFromAuthJson(filePath: string): string {
	const basename = path.parse(filePath).name;
	const parts = basename.split(".");

	if (parts.length < 2) {
		throw new Error(
			`Invalid auth JSON file format: ${filePath}. Expected format: filename.sub.json`,
		);
	}

	return parts[parts.length - 1];
}
