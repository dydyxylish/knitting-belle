import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const parseAmplifyOutputs = () => {
	const filePath = resolve(process.cwd(), "amplify_outputs.json");
	return JSON.parse(readFileSync(filePath, { encoding: "utf8" }));
};
