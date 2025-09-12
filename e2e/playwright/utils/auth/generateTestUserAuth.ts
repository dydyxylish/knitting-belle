import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const authDir = path.join(__dirname, "..", "..", ".auth");

export const generateTestUserAuth = (filename: string, sub: string) => {
	return path.join(authDir, `${filename}.${sub}.json`);
};

export const generateAdminAuth = () => {
	return path.join(authDir, `testAdminUser.json`);
};
