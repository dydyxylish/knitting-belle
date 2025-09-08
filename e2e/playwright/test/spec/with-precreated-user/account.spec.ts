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
	CREATE_TEST_USER_ENDPOINT,
	DELETE_PURCHASE_HISTORY_ENDPOINT,
	DELETE_TEST_USER_ENDPOINT,
} from "@/e2e/playwright/utils/const";

test.describe("Account", () => {
	let sampleKnittingPattern: Schema["KnittingPattern"]["type"];
	const authPath = findAuthPath("account.spec.ts");
	const userId = extractSubFromAuthJson(authPath);
	let adminRequest: APIRequestContext;
	let anotherUserId: string;
	let anotherKnittingPattern: Schema["KnittingPattern"]["type"];
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
				sessionId: `cs_test_account_${faker.string.alphanumeric({ length: 24 })}`,
			},
			headers: {
				"Content-Type": "application/json",
			},
		});

		anotherKnittingPattern = sample(
			knittingPatternFixtures.filter(
				(knittingPattern) =>
					knittingPattern.slug !== sampleKnittingPattern.slug,
			),
		);
		const response = await adminRequest.post(CREATE_TEST_USER_ENDPOINT, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		const { success, data } = await response.json();
		if (!success) {
			throw new Error("Failed to create test user");
		}
		anotherUserId = data.sub;
		await adminRequest.post(CREATE_PURCHASE_HISTORY_ENDPOINT, {
			data: {
				knittingPatternSlug: anotherKnittingPattern.slug,
				user: anotherUserId,
				purchasedAt: new Date().toISOString(),
				sessionId: `cs_test_account_another_${faker.string.alphanumeric({ length: 24 })}`,
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
		await adminRequest.post(DELETE_PURCHASE_HISTORY_ENDPOINT, {
			data: {
				knittingPatternSlug: anotherKnittingPattern.slug,
				user: anotherUserId,
			},
		});
		await adminRequest.post(DELETE_TEST_USER_ENDPOINT, {
			data: {
				sub: anotherUserId,
			},
			headers: {
				"Content-Type": "application/json",
			},
		});
	});

	test("Check account", async ({ page }) => {
		await page.goto("/account");
		await expect(page.getByText("ご購入履歴")).toBeVisible();
		await expect(page.getByText(sampleKnittingPattern.title)).toHaveCount(1);
		await expect(
			page.getByText(anotherKnittingPattern.title),
		).not.toBeVisible();

		const downloadLink = page.locator("a", {
			has: page.locator("svg.lucide-download"),
		});
		await expect(downloadLink).toHaveCount(1);
		const response = await page.request.get(
			(await downloadLink.getAttribute("href")) ?? "",
		);
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toContain("application/pdf");
	});
});
