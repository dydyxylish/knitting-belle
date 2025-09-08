import { faker } from "@faker-js/faker";
import {
	type APIRequestContext,
	expect,
	request,
	test,
} from "@playwright/test";
import { sample } from "es-toolkit";

import type { Schema } from "@/amplify/data/resource";
import { parseKnittingPatternYaml } from "@/amplify/seed/data/parseFixture";
import { extractSubFromAuthJson } from "@/e2e/playwright/utils/auth/extractSubFromAuthJson";
import { findAuthPath } from "@/e2e/playwright/utils/auth/findAuthPath";
import { generateAdminAuth } from "@/e2e/playwright/utils/auth/generateTestUserAuth";
import {
	CREATE_PURCHASE_HISTORY_ENDPOINT,
	DELETE_PURCHASE_HISTORY_ENDPOINT,
} from "@/e2e/playwright/utils/const";

// 異常系
test.describe("Duplicate purchase", () => {
	let sampleKnittingPattern: Schema["KnittingPattern"]["type"];
	const authPath = findAuthPath("alreadyPurchased.spec.ts");
	const userId = extractSubFromAuthJson(authPath);
	let adminRequest: APIRequestContext;

	test.use({ storageState: authPath });

	test.beforeAll(async () => {
		const knittingPatternFixtures = await parseKnittingPatternYaml();
		sampleKnittingPattern = sample(knittingPatternFixtures);
		adminRequest = await request.newContext({
			storageState: generateAdminAuth(),
		});
		await adminRequest.post(CREATE_PURCHASE_HISTORY_ENDPOINT, {
			data: {
				knittingPatternSlug: sampleKnittingPattern.slug,
				user: userId,
				purchasedAt: new Date().toISOString(),
				sessionId: `cs_test_alreadyPurchased_${faker.string.alphanumeric({ length: 24 })}`,
			},
			headers: {
				"Content-Type": "application/json",
			},
		});
	});

	test.afterAll(async () => {
		await adminRequest.post(DELETE_PURCHASE_HISTORY_ENDPOINT, {
			data: {
				knittingPatternSlug: sampleKnittingPattern.slug,
				user: userId,
			},
		});
	});

	test("Already purchased", async ({ page }) => {
		await page.goto(`/${sampleKnittingPattern.slug}`);
		await page
			.getByRole("button")
			.filter({ hasText: "決済ページへ進む" })
			.click();
		await expect(
			page.getByText(`お客様は、こちらの編み図を既に購入済みです`),
		).toBeVisible();
	});
});
