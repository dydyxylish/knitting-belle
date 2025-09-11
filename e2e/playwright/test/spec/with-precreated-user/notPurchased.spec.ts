import { expect, test } from "@playwright/test";

import { findAuthPath } from "@/e2e/playwright/utils/auth/findAuthPath";
import { getFileName } from "@/e2e/playwright/utils/auth/getFileName";

test.describe("Not Purchased", () => {
	const authPath = findAuthPath(getFileName(import.meta.url));
	test.use({ storageState: authPath });

	test("Not Purchased", async ({ page }) => {
		await page.goto("/account");
		await expect(
			page.getByText("ご購入済みの編み図はありません"),
		).toBeVisible();
	});
});
