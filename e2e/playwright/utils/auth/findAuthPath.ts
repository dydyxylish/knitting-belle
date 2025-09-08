import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authDir = path.join(__dirname, "..", "..", ".auth");

export const findAuthPath = (filename: string): string => {
	try {
		const files = readdirSync(authDir);
		const matchingJsonFiles = files.filter(
			(file) =>
				file.startsWith(filename) &&
				file.endsWith(".json") &&
				statSync(path.join(authDir, file)).isFile(),
		);

		return path.join(authDir, matchingJsonFiles.pop() ?? "");
	} catch (error) {
		if (
			error instanceof Error &&
			(error.message.includes("ENOENT") ||
				error.message.includes("no such file or directory"))
		) {
			console.warn(
				`Auth directory not found: ${authDir}. It will be created during test execution.`,
			);
			// Return a default path that would be created during test execution
			return path.join(authDir, `${filename}.json`);
		}
		throw error;
	}
};
