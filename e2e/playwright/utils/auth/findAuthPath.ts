import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const findAuthPath = (filename: string): string => {
	const authDir = join(process.cwd(), "e2e", "playwright", ".auth");

	try {
		const files = readdirSync(authDir);
		const matchingJsonFiles = files.filter(
			(file) =>
				file.startsWith(filename) &&
				file.endsWith(".json") &&
				statSync(join(authDir, file)).isFile(),
		);

		return join(authDir, matchingJsonFiles.pop() ?? "");
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
			return join(authDir, `${filename}.json`);
		}
		throw error;
	}
};
