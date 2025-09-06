import path from "node:path";

export const generateTestUserAuth = (filename: string, sub: string) => {
	return path.join(
		process.cwd(),
		"e2e",
		"playwright",
		".auth",
		`${filename}.${sub}.json`,
	);
};
