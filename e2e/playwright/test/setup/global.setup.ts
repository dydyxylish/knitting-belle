import { request, test as setup } from "@playwright/test";
import fg from "fast-glob";

import { amplifyConfigure } from "@/e2e/playwright/utils/amplify/amplifyConfigure";
import {
	generateAdminAuth,
	generateTestUserAuth,
} from "@/e2e/playwright/utils/auth/generateTestUserAuth";
import {
	signInFlow,
	storeAuthState,
} from "@/e2e/playwright/utils/auth/signInFlow";
import {
	CREATE_TEST_USER_ENDPOINT,
	TEST_SPEC_FILES_GLOB,
} from "@/e2e/playwright/utils/const";

amplifyConfigure();

const specFiles = await fg(TEST_SPEC_FILES_GLOB);
specFiles
	.map((filePath) => filePath.split("/").pop() ?? "")
	.forEach((file) => {
		setup(`create ${file} test user`, async ({ page }) => {
			const adminRequest = await request.newContext({
				storageState: generateAdminAuth(),
			});
			const response = await adminRequest.post(CREATE_TEST_USER_ENDPOINT, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			const { success, data } = await response.json();
			if (!success) {
				throw new Error("Failed to create test user");
			}
			const { username, password, sub } = data;
			await signInFlow({
				page,
				username,
				password,
			});
			await storeAuthState({
				page,
				authFilePath: generateTestUserAuth(file, sub),
			});
		});
	});
