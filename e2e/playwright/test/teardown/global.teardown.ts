import { promises as fs } from "node:fs";
import { request, test as setup } from "@playwright/test";
import fg from "fast-glob";

import { extractSubFromAuthJson } from "@/e2e/playwright/utils/auth/extractSubFromAuthJson";
import { findAuthPath } from "@/e2e/playwright/utils/auth/findAuthPath";
import { generateAdminAuth } from "@/e2e/playwright/utils/auth/generateTestUserAuth";
import {
	DELETE_TEST_USER_ENDPOINT,
	TEST_SPEC_FILES_GLOB,
} from "@/e2e/playwright/utils/const";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

const specFiles = await fg(TEST_SPEC_FILES_GLOB);
specFiles
	.map((filePath) => filePath.split("/").pop() ?? "")
	.forEach((file) => {
		setup(`delete ${file} test user`, async () => {
			const authPath = findAuthPath(file);
			const sub = extractSubFromAuthJson(authPath);
			const adminRequest = await request.newContext({
				storageState: generateAdminAuth(),
			});
			await adminRequest.post(DELETE_TEST_USER_ENDPOINT, {
				data: {
					sub,
				},
				headers: {
					"Content-Type": "application/json",
				},
			});
			log.info({ authPath }, "deleting auth file");
			await fs.rm(authPath);
		});
	});
