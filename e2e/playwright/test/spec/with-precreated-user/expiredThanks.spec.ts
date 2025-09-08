import { faker } from "@faker-js/faker";
import {
	type APIRequestContext,
	expect,
	request,
	test,
} from "@playwright/test";
import dayjs from "dayjs";
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

test.describe("Expired Thanks", () => {
	let sampleKnittingPattern: Schema["KnittingPattern"]["type"];
	const authPath = findAuthPath("expiredThanks.spec.ts");
	const userId = extractSubFromAuthJson(authPath);
	let adminRequest: APIRequestContext;
	let sessionId: string;
	test.use({ storageState: authPath });

	test.beforeAll(async () => {
		const knittingPatternFixtures = await parseKnittingPatternYaml();
		sampleKnittingPattern = sample(knittingPatternFixtures);
		adminRequest = await request.newContext({
			storageState: generateAdminAuth(),
		});
		sessionId = `cs_test_expiredThanks_${faker.string.alphanumeric({ length: 24 })}`;
		await adminRequest.post(CREATE_PURCHASE_HISTORY_ENDPOINT, {
			data: {
				knittingPatternSlug: sampleKnittingPattern.slug,
				user: userId,
				purchasedAt: new Date().toISOString(),
				sessionId: sessionId,
				expireAt: dayjs().subtract(1, "hour").toISOString(),
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

	test("Expired Thanks", async ({ page }) => {
		await page.goto(`/thanks?session_id=${sessionId}`);
		await expect(
			page.locator("p").filter({
				hasText:
					"有効期限を過ぎています。マイページから再度ダウンロードしてください。",
			}),
		).toBeVisible();
	});
});
