import { test } from "@playwright/test";

import { findAuthPath } from "@/e2e/playwright/utils/auth/findAuthPath";
import { getFileName } from "@/e2e/playwright/utils/auth/getFileName";

test.describe("Thanks Negative Test", () => {
	const authPath = findAuthPath(getFileName(import.meta.url));
	test.use({ storageState: authPath });

	test("Not found", async ({ page }) => {
		await page.goto("/thanks");
		await page.waitForURL("/");
	});
});
