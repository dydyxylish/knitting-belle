import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import { sample } from "es-toolkit";

import type { Schema } from "@/amplify/data/resource";
import { parseKnittingPatternYaml } from "@/amplify/seed/data/parseFixture";
import { extractSubFromAuthJson } from "@/e2e/playwright/utils/auth/extractSubFromAuthJson";
import { findAuthPath } from "@/e2e/playwright/utils/auth/findAuthPath";
import { DELETE_PURCHASE_HISTORY_ENDPOINT } from "@/e2e/playwright/utils/const";
import { webhookCheckoutCompleted } from "@/e2e/playwright/utils/stripe/webhookCheckoutCompleted";

test.describe
	.serial("Purchase flow", () => {
		let sampleKnittingPattern: Schema["KnittingPattern"]["type"];
		const authPath = findAuthPath("purchase.spec.ts");
		const userId = extractSubFromAuthJson(authPath);

		test.use({ storageState: authPath });

		test.beforeAll(async () => {
			const knittingPatternFixtures = await parseKnittingPatternYaml();
			sampleKnittingPattern = sample(knittingPatternFixtures);
		});

		test.afterAll(async () => {
			// テスト作成した購入履歴を削除
			await fetch(DELETE_PURCHASE_HISTORY_ENDPOINT, {
				method: "POST",
				body: JSON.stringify({
					knittingPatternSlug: sampleKnittingPattern.slug,
					userId: userId,
				}),
			});
		});

		test("Checkout", async ({ page }) => {
			// 決済フロー → Thanksページ → ダウンロード確認
			await page.goto(`/${sampleKnittingPattern.slug}`);

			await page
				.getByRole("button")
				.filter({ hasText: "決済ページへ進む" })
				.click();
			await expect(page).toHaveURL(/https:\/\/checkout\.stripe\.com\/.*/);
		});
		test("Download PDF", async ({ page }) => {
			const sessionId = `cs_test_${faker.string.alphanumeric({ length: 24 })}`;
			const webhook = async () => {
				await webhookCheckoutCompleted({
					knittingPatternSlug: sampleKnittingPattern.slug,
					sub: userId,
					sessionId,
				});
			};
			const redirectToThanksPage = async () => {
				await page.goto(`/thanks?session_id=${sessionId}`);
				await expect(
					page.locator("td").filter({ hasText: sampleKnittingPattern.title }),
				).toBeVisible();

				const signedUrl = await page
					.getByRole("link", { name: "編み図ダウンロード" })
					.getAttribute("href");
				if (!signedUrl) throw new Error("リンクが取得できませんでした");

				const response = await page.request.get(signedUrl);
				expect(response.status()).toBe(200);
				expect(response.headers()["content-type"]).toContain("application/pdf");
			};

			await Promise.all([webhook(), redirectToThanksPage()]);
		});
	});
