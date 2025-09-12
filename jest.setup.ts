// import "@testing-library/jest-dom";

// // Mock Next.js router
// jest.mock("next/navigation", () => ({
// 	useRouter: () => ({
// 		push: jest.fn(),
// 		replace: jest.fn(),
// 		prefetch: jest.fn(),
// 		back: jest.fn(),
// 		forward: jest.fn(),
// 		refresh: jest.fn(),
// 	}),
// 	usePathname: () => "/",
// 	useSearchParams: () => new URLSearchParams(),
// 	useParams: () => ({}),
// }));

// // Mock AWS Amplify
// jest.mock("aws-amplify", () => ({
// 	Amplify: {
// 		configure: jest.fn(),
// 	},
// }));

// jest.mock("@aws-amplify/adapter-nextjs", () => ({
// 	createServerRunner: jest.fn(() => ({
// 		runWithAmplifyServerContext: jest.fn(),
// 	})),
// 	cookies: jest.fn(),
// }));

// // Mock Stripe
// jest.mock("stripe", () => {
// 	return jest.fn().mockImplementation(() => ({
// 		checkout: {
// 			sessions: {
// 				create: jest.fn(),
// 				retrieve: jest.fn(),
// 			},
// 		},
// 		webhooks: {
// 			constructEvent: jest.fn(),
// 		},
// 	}));
// });

// Mock environment variables
// process.env.NODE_ENV = "test";
// process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";
// process.env.STRIPE_SUCCESS_URL = "https://example.com/success";
// process.env.STRIPE_CANCEL_URL = "https://example.com/cancel";

// // Global test timeout
jest.setTimeout(10000);

// Mock console methods to avoid noise during tests
global.console = {
	...console,
	warn: jest.fn(),
	error: jest.fn(),
};
