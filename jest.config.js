const nextJest = require("next/jest");

const createJestConfig = nextJest({
	// Next.jsアプリのパスを指定
	dir: "./",
});

// Jestのカスタム設定
const customJestConfig = {
	// テスト環境の設定
	testEnvironment: "jest-environment-node",

	// セットアップファイル
	setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],

	// モジュールパスのマッピング
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
		"^stripe$": "<rootDir>/__tests__/__mocks__/stripe.js",
	},

	// テストファイルのパターン
	testMatch: ["<rootDir>/__tests__/**/*.test.{js,jsx,ts,tsx}"],

	// カバレッジの設定
	collectCoverageFrom: [
		"app/**/*.{js,jsx,ts,tsx}",
		"lib/**/*.{js,jsx,ts,tsx}",
		"db/**/*.{js,jsx,ts,tsx}",
		"!**/*.d.ts",
		"!**/node_modules/**",
		"!**/__tests__/**",
		"!**/coverage/**",
		// 除外するファイル
		"!app/layout.tsx",
		"!app/loading.tsx",
		"!app/error.tsx",
		"!app/not-found.tsx",
		"!app/globals.css",
	],

	// カバレッジの閾値
	coverageThreshold: {
		global: {
			branches: 70,
			functions: 70,
			lines: 70,
			statements: 70,
		},
		// 重要なファイルには高い閾値を設定
		"./app/_lib/serverAction/payment.ts": {
			branches: 85,
			functions: 85,
			lines: 85,
			statements: 85,
		},
		"./app/api/webhook/stripe/route.ts": {
			branches: 85,
			functions: 85,
			lines: 85,
			statements: 85,
		},
	},

	// テストのタイムアウト
	testTimeout: 10000,

	// 並列実行の設定
	maxWorkers: "50%",

	// モックの設定
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,

	// 変換の設定
	transform: {
		"^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
	},

	// 変換を無視するパターン
	transformIgnorePatterns: [
		"/node_modules/",
		"^.+\\.module\\.(css|sass|scss)$",
	],

	// グローバル変数の設定
	globals: {
		"ts-jest": {
			tsconfig: "tsconfig.json",
		},
	},

	// レポーターの設定
	reporters: [
		"default",
		[
			"jest-junit",
			{
				outputDirectory: "coverage",
				outputName: "junit.xml",
			},
		],
	],

	// 詳細なテスト結果表示
	verbose: true,
};

// Next.jsの設定とカスタム設定をマージ
module.exports = createJestConfig(customJestConfig);
