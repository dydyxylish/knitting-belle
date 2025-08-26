import { expect, test } from "@playwright/test";

test("ホームページが正常に表示される", async ({ page }) => {
	await page.goto("/");

	// ヘッダーが表示されることを確認
	await expect(page.locator("header")).toBeVisible();
});
