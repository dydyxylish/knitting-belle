import { expect, test } from "@playwright/test";
import { sample } from "es-toolkit";

import type { Schema } from "@/amplify/data/resource";
import { parseKnittingPatternYaml } from "@/amplify/seed/data/parseFixture";
import { findAuthPath } from "@/e2e/playwright/utils/auth/findAuthPath";
import { getFileName } from "@/e2e/playwright/utils/auth/getFileName";

// 異常系
test.describe("Checkout Negative Test", () => {
	let sampleKnittingPattern: Schema["KnittingPattern"]["type"];
	const authPath = findAuthPath(getFileName(import.meta.url));

	test.use({ storageState: authPath });

	test.beforeAll(async () => {
		const knittingPatternFixtures = await parseKnittingPatternYaml();
		sampleKnittingPattern = sample(knittingPatternFixtures);
	});

	test("Expired session", async ({ page, context }) => {
		await page.goto(`/${sampleKnittingPattern.slug}`);
		await context.clearCookies();
		await page
			.getByRole("button")
			.filter({ hasText: "決済ページへ進む" })
			.click();
		await expect(page.getByText("セッションがきれています")).toBeVisible();
	});

	test("Cancel", async ({ page }) => {
		await page.goto(`/${sampleKnittingPattern.slug}`);
		await page
			.getByRole("button")
			.filter({ hasText: "決済ページへ進む" })
			.click();
		await page.waitForURL(/https:\/\/checkout\.stripe\.com\/.*/);
		await page.getByTestId("business-link").click();
		await page.waitForURL("/cancel");
		await expect(page.locator("h1")).toHaveText("ご注文がキャンセルされました");
	});
});
