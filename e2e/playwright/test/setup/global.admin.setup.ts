import { test as setup } from "@playwright/test";

import { amplifyConfigure } from "@/e2e/playwright/utils/amplify/amplifyConfigure";
import { generateAdminAuth } from "@/e2e/playwright/utils/auth/generateTestUserAuth";
import {
	signInFlow,
	storeAuthState,
} from "@/e2e/playwright/utils/auth/signInFlow";
import { env } from "@/lib/env";

amplifyConfigure();

setup("create admin test user", async ({ page }) => {
	await signInFlow({
		page,
		username: env.TEST_ADMIN_USERNAME,
		password: env.TEST_ADMIN_PASSWORD,
	});
	await storeAuthState({
		page,
		authFilePath: generateAdminAuth(),
	});
});
