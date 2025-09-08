import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const parseAmplifyOutputs = () => {
	const filePath = path.join(__dirname, "../../../../amplify_outputs.json");
	return JSON.parse(readFileSync(filePath, { encoding: "utf8" }));
};
