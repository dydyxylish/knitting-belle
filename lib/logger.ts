import { basename } from "node:path";
import { fileURLToPath } from "node:url";
import pino from "pino";

const isBrowser = typeof window !== "undefined";
const isProduction = process.env.NODE_ENV === "production";

const logger = isBrowser
	? pino({
			browser: {
				asObject: true,
			},
			level: "info",
			timestamp: () => `,"time":"${new Date().toISOString()}"`,
		})
	: isProduction
		? pino({
				level: "info",
			})
		: pino({
				level: "debug",
				transport: {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "yyyy-mm-dd HH:MM:ss.l",
						ignore: "pid,hostname",
					},
				},
			});
// 第一引数にimport.meta.urlをわたす
export const getLogger = (moduleUrl: string) => {
	const filePath = fileURLToPath(moduleUrl);
	const moduleName = basename(filePath);
	return logger.child({ module: moduleName });
};
