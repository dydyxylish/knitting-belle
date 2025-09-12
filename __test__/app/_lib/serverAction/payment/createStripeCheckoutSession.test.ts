import type Stripe from "stripe";

import { getImagePathsBySlugWithCookie } from "@/app/_lib/fetch/yarnCraftImage/getImagePathsBySlugWithCookie";
import { createStripeCheckoutSession } from "@/app/_lib/serverAction/payment/createStripeCheckoutSession";
import type { User } from "@/app/_lib/serverAction/payment/types";
import { env } from "@/lib/env";

// Mock dependencies
jest.mock("@/lib/env");
jest.mock("@/app/_lib/fetch/yarnCraftImage/getImagePathsBySlugWithCookie");

// Mock stripe module with proper Stripe instance mock
jest.mock("@/lib/stripe", () => ({
	__esModule: true,
	default: {
		checkout: {
			sessions: {
				create: jest.fn(),
			},
		},
	},
}));

// Get the mocked stripe instance for type-safe usage
import stripe from "@/lib/stripe";

const mockStripeInstance = jest.mocked(stripe);

const mockGetImagePathsBySlugWithCookie = jest.mocked(
	getImagePathsBySlugWithCookie,
);

// Mock environment variables
const mockEnv = {
	STRIPE_SUCCESS_URL: "https://example.com/success",
	STRIPE_CANCEL_URL: "https://example.com/cancel",
};
Object.assign(env, mockEnv);

describe("createStripeCheckoutSession", () => {
	const mockKnittingPattern = {
		slug: "test-pattern",
		title: "Test Pattern Title",
		price: 2500,
		description: "Test description",
		isPublished: true,
		downloadCount: 0,
		yarnCraftImages: jest.fn(),
		purchaseHistories: jest.fn(),
		createdAt: "2024-01-01T00:00:00.000Z",
		updatedAt: "2024-01-01T00:00:00.000Z",
	};

	const mockUser: User = {
		sub: "test-user-sub",
		email: "test@example.com",
	};

	const mockImages = [
		"https://example.com/image1.jpg",
		"https://example.com/image2.jpg",
		"https://example.com/image3.jpg",
	];

	const mockSession = {
		id: "cs_test_session_id",
		url: "https://checkout.stripe.com/pay/session_url",
		lastResponse: {
			headers: {},
			requestId: "req_123",
			statusCode: 200,
		},
	} as Stripe.Response<Stripe.Checkout.Session>;

	beforeEach(() => {
		jest.clearAllMocks();
		mockGetImagePathsBySlugWithCookie.mockResolvedValue(mockImages);
		(
			mockStripeInstance.checkout.sessions.create as jest.MockedFunction<
				Stripe.Checkout.SessionsResource["create"]
			>
		).mockResolvedValue(mockSession);
	});

	describe("successful session creation", () => {
		it("should create Stripe checkout session with correct parameters", async () => {
			const result = await createStripeCheckoutSession(
				mockKnittingPattern,
				mockUser,
			);

			expect(mockGetImagePathsBySlugWithCookie).toHaveBeenCalledWith(
				mockKnittingPattern.slug,
			);

			expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith({
				payment_method_types: ["card"],
				line_items: [
					{
						price_data: {
							currency: "jpy",
							product_data: {
								name: mockKnittingPattern.title,
								images: [mockImages[0]], // Only first image
							},
							unit_amount: mockKnittingPattern.price,
						},
						quantity: 1,
					},
				],
				mode: "payment",
				success_url: env.STRIPE_SUCCESS_URL,
				cancel_url: env.STRIPE_CANCEL_URL,
				metadata: {
					sub: mockUser.sub,
					knittingPatternSlug: mockKnittingPattern.slug,
				},
			});

			expect(result).toBe(mockSession.url);
		});

		it("should handle user without sub", async () => {
			const userWithoutSub: User = {
				email: "test@example.com",
			};

			await createStripeCheckoutSession(mockKnittingPattern, userWithoutSub);

			expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
				expect.objectContaining({
					metadata: {
						sub: "",
						knittingPatternSlug: mockKnittingPattern.slug,
					},
				}),
			);
		});

		it("should handle empty images array", async () => {
			mockGetImagePathsBySlugWithCookie.mockResolvedValue([]);

			await createStripeCheckoutSession(mockKnittingPattern, mockUser);

			expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
				expect.objectContaining({
					line_items: [
						expect.objectContaining({
							price_data: expect.objectContaining({
								product_data: expect.objectContaining({
									images: [], // Empty array when no images
								}),
							}),
						}),
					],
				}),
			);
		});

		it("should use only the first image when multiple images exist", async () => {
			const manyImages = Array.from(
				{ length: 5 },
				(_, i) => `https://example.com/image${i + 1}.jpg`,
			);
			mockGetImagePathsBySlugWithCookie.mockResolvedValue(manyImages);

			await createStripeCheckoutSession(mockKnittingPattern, mockUser);

			expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
				expect.objectContaining({
					line_items: [
						expect.objectContaining({
							price_data: expect.objectContaining({
								product_data: expect.objectContaining({
									images: [manyImages[0]], // Only first image
								}),
							}),
						}),
					],
				}),
			);
		});
	});

	describe("error handling", () => {
		it("should throw error when session creation fails (no URL)", async () => {
			const sessionWithoutUrl = {
				id: "cs_test_session_id",
				url: null,
				lastResponse: {
					headers: {},
					requestId: "req_123",
					statusCode: 200,
				},
			} as Stripe.Response<Stripe.Checkout.Session>;
			(
				mockStripeInstance.checkout.sessions.create as jest.MockedFunction<
					Stripe.Checkout.SessionsResource["create"]
				>
			).mockResolvedValue(sessionWithoutUrl);

			await expect(
				createStripeCheckoutSession(mockKnittingPattern, mockUser),
			).rejects.toThrow("Stripeセッションの作成に失敗しました");
		});

		it("should throw error when session creation fails (undefined URL)", async () => {
			const sessionWithUndefinedUrl = {
				id: "cs_test_session_id",
				lastResponse: {
					headers: {},
					requestId: "req_123",
					statusCode: 200,
				},
			} as Stripe.Response<Stripe.Checkout.Session>;
			(
				mockStripeInstance.checkout.sessions.create as jest.MockedFunction<
					Stripe.Checkout.SessionsResource["create"]
				>
			).mockResolvedValue(sessionWithUndefinedUrl);

			await expect(
				createStripeCheckoutSession(mockKnittingPattern, mockUser),
			).rejects.toThrow("Stripeセッションの作成に失敗しました");
		});

		it("should propagate Stripe API errors", async () => {
			const stripeError = new Error("Stripe API error");
			(
				mockStripeInstance.checkout.sessions.create as jest.MockedFunction<
					Stripe.Checkout.SessionsResource["create"]
				>
			).mockRejectedValue(stripeError);

			await expect(
				createStripeCheckoutSession(mockKnittingPattern, mockUser),
			).rejects.toThrow("Stripe API error");
		});

		it("should propagate image fetching errors", async () => {
			const imageError = new Error("Image fetch error");
			mockGetImagePathsBySlugWithCookie.mockRejectedValue(imageError);

			await expect(
				createStripeCheckoutSession(mockKnittingPattern, mockUser),
			).rejects.toThrow("Image fetch error");
		});
	});

	describe("data types and validation", () => {
		it("should handle different price formats", async () => {
			const expensivePattern = { ...mockKnittingPattern, price: 999999 };

			await createStripeCheckoutSession(expensivePattern, mockUser);

			expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
				expect.objectContaining({
					line_items: [
						expect.objectContaining({
							price_data: expect.objectContaining({
								unit_amount: 999999,
							}),
						}),
					],
				}),
			);
		});

		it("should handle special characters in pattern title", async () => {
			const patternWithSpecialChars = {
				...mockKnittingPattern,
				title: "Test Pattern with 特殊文字 & Symbols!",
			};

			await createStripeCheckoutSession(patternWithSpecialChars, mockUser);

			expect(mockStripeInstance.checkout.sessions.create).toHaveBeenCalledWith(
				expect.objectContaining({
					line_items: [
						expect.objectContaining({
							price_data: expect.objectContaining({
								product_data: expect.objectContaining({
									name: "Test Pattern with 特殊文字 & Symbols!",
								}),
							}),
						}),
					],
				}),
			);
		});
	});
});
