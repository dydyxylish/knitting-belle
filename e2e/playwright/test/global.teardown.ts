import fs from "node:fs";
import { test as setup } from "@playwright/test";

import { deleteTestUser } from "../utils/auth/deleteTestUser";
import { extractSubFromAuthJson } from "../utils/auth/extractSubFromAuthJson";
import { findAuthPath } from "../utils/auth/findAuthPath";

setup("delete purchase flow test user", async () => {
	const authPath = findAuthPath("purchase.spec.ts");
	const sub = extractSubFromAuthJson(authPath);
	await deleteTestUser(sub);
	await fs.rm(authPath, (err) => {
		if (err) {
			console.error(err);
		}
	});
});
