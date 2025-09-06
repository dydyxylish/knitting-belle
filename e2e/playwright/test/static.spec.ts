import { expect, test } from "@playwright/test";

import { parseKnittingPatternYaml } from "@/amplify/seed/data/parseFixture";

test.describe("Static Tests", () => {
	test("Home Page", async ({ page }) => {
		await page.goto("/");
		const knittingPatternObjects = await parseKnittingPatternYaml();
		const knittingPatternTitles = knittingPatternObjects.map(
			(knittingPattern) => knittingPattern.title,
		);
		for (const knittingPatternTitle of knittingPatternTitles) {
			await expect(
				page.getByRole("link", { name: knittingPatternTitle }),
			).toBeVisible();
		}
	});

	// 各編み図詳細ページに遷移するテスト
	test("Knitting Pattern Detail Page", async ({ page }) => {
		const knittingPatternObjects = await parseKnittingPatternYaml();
		for (const knittingPattern of knittingPatternObjects) {
			await page.goto(`/${knittingPattern.slug}`);
			await expect(page.locator("h1").first()).toHaveText(
				knittingPattern.title,
			);
			// ログインして購入するボタンが表示されることをテスト
			await expect(
				page.getByRole("button").filter({ hasText: "ログインして購入する" }),
			).toBeVisible();
		}
	});

	// 購入履歴画面に遷移するテスト
	test("Purchase History Page", async ({ page }) => {
		await page.goto("/account");
		await expect(
			page.locator("p", { hasText: "購入履歴を見るにはログインが必要です" }),
		).toBeVisible();
	});

	test("Thanks Page", async ({ page }) => {
		await page.goto("/thanks");
		await expect(page).toHaveURL("/");
	});

	test("Privacy Policy Page", async ({ page }) => {
		await page.goto("/privacy-policy");
		await expect(
			page.locator("div").filter({ hasText: /^プライバシーポリシー$/ }),
		).toBeVisible();
	});

	test("Terms of Use Page", async ({ page }) => {
		await page.goto("/terms-of-use");
		await expect(
			page.locator("div").filter({ hasText: /^利用規約$/ }),
		).toBeVisible();
	});

	// not found
	test("Not Found Page", async ({ page }) => {
		await page.goto("/not-found");
		await expect(page.locator("h2").first()).toHaveText(
			"ページが見つかりません",
		);
	});
});
