import type { Page } from "@playwright/test";

import {
	HOSTED_UI_DOMAIN_REGEX,
	SIGN_IN_PATH,
} from "@/e2e/playwright/utils/const";

export const signInFlow = async ({
	page,
	username,
	password,
	authFilePath,
}: {
	page: Page;
	username: string;
	password: string;
	authFilePath: string;
}) => {
	await page.goto(SIGN_IN_PATH);
	await page.waitForURL(HOSTED_UI_DOMAIN_REGEX);
	await page.getByRole("textbox", { name: "name@host.com" }).fill(username);
	await page.getByRole("textbox", { name: "Password" }).fill(password);
	await page.getByRole("button", { name: "submit" }).click();
	await page.waitForURL("/");
	await page.context().storageState({ path: authFilePath });
};
