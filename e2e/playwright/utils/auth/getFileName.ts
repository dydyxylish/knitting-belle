import path from "node:path";
import { fileURLToPath } from "node:url";

export const getFileName = (url: string) => {
	const __filename = fileURLToPath(url);
	return path.basename(__filename);
};
