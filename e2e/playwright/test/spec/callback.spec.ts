import {
	type APIRequestContext,
	expect,
	request,
	test,
} from "@playwright/test";
import { sample } from "es-toolkit";

import type { Schema } from "@/amplify/data/resource";
import { parseKnittingPatternYaml } from "@/amplify/seed/data/parseFixture";
import { generateAdminAuth } from "@/e2e/playwright/utils/auth/generateTestUserAuth";
import {
	CREATE_TEST_USER_ENDPOINT,
	DELETE_TEST_USER_ENDPOINT,
	HOSTED_UI_DOMAIN_REGEX,
} from "@/e2e/playwright/utils/const";

// /callbackの動作確認
test.describe
	.serial("Sign In Callback", () => {
		let sampleKnittingPattern: Schema["KnittingPattern"]["type"];
		let adminRequest: APIRequestContext;
		let testUsername: string;
		let testPassword: string;
		let testSub: string;
		test.beforeAll(async () => {
			const knittingPatternFixtures = await parseKnittingPatternYaml();
			sampleKnittingPattern = sample(knittingPatternFixtures);
			adminRequest = await request.newContext({
				storageState: generateAdminAuth(),
			});
			const response = await adminRequest.post(CREATE_TEST_USER_ENDPOINT, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			const { data } = await response.json();
			const { username, password, sub } = data;
			testUsername = username;
			testPassword = password;
			testSub = sub;
		});

		test.afterAll(async () => {
			await adminRequest.post(DELETE_TEST_USER_ENDPOINT, {
				data: {
					sub: testSub,
				},
				headers: {
					"Content-Type": "application/json",
				},
			});
		});

		test("sign in at detail page", async ({ page }) => {
			await page.goto(`/${sampleKnittingPattern.slug}`);
			await page.getByRole("button", { name: "ログインして購入する" }).click();
			await page.getByRole("button", { name: "Emailでログイン" }).click();
			await page.waitForURL(HOSTED_UI_DOMAIN_REGEX);
			await page
				.getByRole("textbox", { name: "name@host.com" })
				.fill(testUsername);
			await page.getByRole("textbox", { name: "Password" }).fill(testPassword);
			await page.getByRole("button", { name: "submit" }).click();
			await page.waitForURL(`/${sampleKnittingPattern.slug}`);
		});

		test("sign in and sign out at account page", async ({ page }) => {
			// sign in
			await page.goto(`/account`);
			await page.getByRole("button", { name: "ログイン" }).click();
			await page.getByRole("button", { name: "Emailでログイン" }).click();
			await page.waitForURL(HOSTED_UI_DOMAIN_REGEX);
			await page
				.getByRole("textbox", { name: "name@host.com" })
				.fill(testUsername);
			await page.getByRole("textbox", { name: "Password" }).fill(testPassword);
			await page.getByRole("button", { name: "submit" }).click();
			await page.waitForURL(`/account`);
			await expect(page.locator("svg.lucide-user-round-check")).toBeVisible();

			// sign out
			await page.getByRole("button", { name: "ログアウト" }).click();
			await page.waitForURL("/");
			await expect(page.locator("svg.lucide-circle-user-round")).toBeVisible();
		});
	});
