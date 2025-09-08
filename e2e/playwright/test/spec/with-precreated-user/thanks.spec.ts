import { test } from "@playwright/test";

import { findAuthPath } from "@/e2e/playwright/utils/auth/findAuthPath";

test.describe("Thanks Negative Test", () => {
	const authPath = findAuthPath("thanks.spec.ts");
	test.use({ storageState: authPath });

	test("Not found", async ({ page }) => {
		await page.goto("/thanks");
		await page.waitForURL("/");
	});
});
