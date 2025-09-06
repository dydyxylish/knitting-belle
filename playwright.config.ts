import { config } from "@dotenvx/dotenvx";
import { defineConfig, devices } from "@playwright/test";

if (process.env.CI) {
	config({ path: ".env.ci" });
} else {
	config({ path: ".env" });
}

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
	// tsconfig: ".e2e/tsconfig.json",
	// timeout: 10 * 1000, // 10秒
	testDir: "./e2e/playwright/test",
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: process.env.CI
		? [["dot"], ["html", { outputFolder: "playwright-report" }]]
		: "html",
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: "http://localhost:3000",

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: "global setup",
			testMatch: /global\.setup\.ts/,
			teardown: "clean up",
		},
		{
			name: "clean up",
			testMatch: /global\.teardown\.ts/,
		},
		// {
		// 	name: "chromium",
		// 	use: { ...devices["Desktop Chrome"] },
		// 	dependencies: ["global setup"],
		// },

		// {
		// 	name: "firefox",
		// 	use: { ...devices["Desktop Firefox"] },
		// 	dependencies: ["global setup"],
		// },

		// {
		// 	name: "webkit",
		// 	use: { ...devices["Desktop Safari"] },
		// 	dependencies: ["global setup"],
		// },

		/* Test against mobile viewports. */
		{
			name: "Mobile Chrome",
			use: { ...devices["Pixel 6"] },
			dependencies: ["global setup"],
		},
		// {
		// 	name: "Mobile Safari",
		// 	use: { ...devices["iPhone 14"] },
		// 	dependencies: ["global setup"],
		// },
	],
});
