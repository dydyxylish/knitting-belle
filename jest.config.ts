/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: "./",
});

const config: Config = {
	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,

	// Reset mock state before each test
	resetMocks: true,

	// Restore mock implementations before each test
	restoreMocks: true,

	// Test environment for server-side code
	testEnvironment: "node",

	// Timeout for async operations (10 seconds)
	testTimeout: 10000,

	// Maximum worker processes (50% of CPU cores)
	maxWorkers: "50%",

	// Setup files for testing environment
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

	// Module path mapping for absolute imports
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},

	// Test file patterns
	testMatch: ["**/__test__/**/*.test.ts"],

	// Ignore patterns for test discovery
	testPathIgnorePatterns: ["/node_modules/", "/e2e/", "/.next/"],

	// Transform patterns to ignore
	transformIgnorePatterns: ["/node_modules/(?!(es-toolkit)/)"],

	// Coverage settings
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",

	// Coverage collection patterns
	collectCoverageFrom: [
		"app/_lib/**/*.{js,jsx,ts,tsx}",
		"!app/_lib/**/*types.ts",
	],

	// Coverage thresholds
	// coverageThreshold: {
	// 	global: {
	// 		branches: 70,
	// 		functions: 70,
	// 		lines: 70,
	// 		statements: 70,
	// 	},
	// },

	// Reporters for test results
	reporters: [
		"default",
		[
			"jest-junit",
			{
				outputDirectory: "./coverage",
				outputName: "junit.xml",
			},
		],
	],
};

export default createJestConfig(config);
