import { expect, test } from "@playwright/test";

import { parseKnittingPatternYaml } from "@/amplify/seed/data/parseFixture.ts";

// ゲストユーザーのテスト
test.describe("Guest User", () => {
	test("Home Page", async ({ page }) => {
		await page.goto("/");
		const knittingPatternObjects = await parseKnittingPatternYaml();
		const knittingPatternTitles = knittingPatternObjects.map(
			(knittingPattern) => knittingPattern.title,
		);
		for (const knittingPatternTitle of knittingPatternTitles) {
			expect(
				page.getByRole("link", { name: knittingPatternTitle }),
			).toBeVisible();
		}
	});

	// 各編み図詳細ページに遷移するテスト
	test("Knitting Pattern Detail Page", async ({ page }) => {
		const knittingPatternObjects = await parseKnittingPatternYaml();
		for (const knittingPattern of knittingPatternObjects) {
			await page.goto(`/${knittingPattern.slug}`);
			expect(page.locator("h1").first()).toHaveText(knittingPattern.title);
			// ログインして購入するボタンが表示されることをテスト
			await expect(
				page.getByRole("button").filter({ hasText: "ログインして購入する" }),
			).toBeVisible();
		}
	});

	// 購入履歴画面に遷移するテスト
	test("Purchase History Page", async ({ page }) => {
		await page.goto("/account");
		expect(
			page.locator("p", { hasText: "購入履歴を見るにはログインが必要です" }),
		).toBeVisible();
	});
});
