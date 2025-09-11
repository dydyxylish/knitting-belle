import { redirect } from "next/navigation";

import type { Schema } from "@/amplify/data/resource";
import { makePayment } from "@/app/_lib/serverAction/payment";
import { createStripeCheckoutSession } from "@/app/_lib/serverAction/payment/createStripeCheckoutSession";
import { handlePaymentError } from "@/app/_lib/serverAction/payment/handlePaymentError";
import { validatePaymentRequest } from "@/app/_lib/serverAction/payment/validatePaymentRequest";

// Mock all dependencies
jest.mock("next/navigation");
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
jest.mock("@/app/_lib/serverAction/payment/validatePaymentRequest");
jest.mock("@/app/_lib/serverAction/payment/createStripeCheckoutSession");
jest.mock("@/app/_lib/serverAction/payment/handlePaymentError");

const mockRedirect = jest.mocked(redirect);
const mockValidatePaymentRequest = jest.mocked(validatePaymentRequest);
const mockCreateStripeCheckoutSession = jest.mocked(
	createStripeCheckoutSession,
);
const mockHandlePaymentError = jest.mocked(handlePaymentError);

describe("makePayment", () => {
	const mockFormData = new FormData();
	mockFormData.append("knittingPatternSlug", "test-pattern");

	const mockUser = {
		sub: "test-user-sub",
		email: "test@example.com",
	};

	const mockKnittingPattern: Schema["KnittingPattern"]["type"] = {
		slug: "test-pattern",
		title: "Test Pattern",
		price: 1000,
		description: "Test description",
		yarnCraftImages: jest.fn(),
		purchaseHistories: jest.fn(),
		createdAt: "2024-01-01T00:00:00.000Z",
		updatedAt: "2024-01-01T00:00:00.000Z",
	};

	const mockCheckoutUrl = "https://checkout.stripe.com/pay/session_url";

	beforeEach(() => {
		jest.clearAllMocks();
		// Mock redirect to throw (simulating actual behavior)
		mockRedirect.mockImplementation((url: string) => {
			throw new Error(`Redirect to ${url}`);
		});
	});

	describe("successful payment flow", () => {
		it("should validate request, create checkout session, and redirect to checkout URL", async () => {
			// Mock successful validation
			mockValidatePaymentRequest.mockResolvedValue({
				success: true,
				data: {
					knittingPatternSlug: "test-pattern",
					knittingPattern: mockKnittingPattern,
					user: mockUser,
				},
			});

			// Mock successful Stripe session creation
			mockCreateStripeCheckoutSession.mockResolvedValue(mockCheckoutUrl);

			// Execute and expect redirect
			await expect(makePayment(mockFormData)).rejects.toThrow(
				`Redirect to ${mockCheckoutUrl}`,
			);

			// Verify function calls
			expect(mockValidatePaymentRequest).toHaveBeenCalledWith(mockFormData);
			expect(mockHandlePaymentError).not.toHaveBeenCalled();
			expect(mockCreateStripeCheckoutSession).toHaveBeenCalledWith(
				mockKnittingPattern,
				mockUser,
			);
			expect(mockRedirect).toHaveBeenCalledWith(mockCheckoutUrl);
		});
	});

	describe("validation failure handling", () => {
		it("should handle validation errors and return error result", async () => {
			const mockSubmission = { reply: jest.fn() };
			const mockValidationError = {
				success: false as const,
				error: {
					type: "AUTH_ERROR" as const,
					submission: mockSubmission,
				},
			};

			const mockErrorResult = {
				error: {
					sessionError: "セッションがきれています。再度ログインしてください",
				},
			};

			mockValidatePaymentRequest.mockResolvedValue(mockValidationError);
			mockHandlePaymentError.mockReturnValue(mockErrorResult);

			const result = await makePayment(mockFormData);

			expect(mockValidatePaymentRequest).toHaveBeenCalledWith(mockFormData);
			expect(mockHandlePaymentError).toHaveBeenCalledWith(mockValidationError);
			expect(mockCreateStripeCheckoutSession).not.toHaveBeenCalled();
			expect(result).toEqual(mockErrorResult);
		});

		it("should handle validation errors that cause redirect", async () => {
			const mockValidationError = {
				success: false as const,
				error: {
					type: "FORM_ERROR" as const,
					message: "Form validation failed",
				},
			};

			mockValidatePaymentRequest.mockResolvedValue(mockValidationError);
			mockHandlePaymentError.mockImplementation(() => {
				mockRedirect("/cancel");
				return undefined;
			});

			await expect(makePayment(mockFormData)).rejects.toThrow(
				"Redirect to /cancel",
			);

			expect(mockValidatePaymentRequest).toHaveBeenCalledWith(mockFormData);
			expect(mockHandlePaymentError).toHaveBeenCalledWith(mockValidationError);
			expect(mockCreateStripeCheckoutSession).not.toHaveBeenCalled();
		});
	});

	describe("Stripe session creation error handling", () => {
		it("should redirect to /cancel when Stripe session creation fails", async () => {
			mockValidatePaymentRequest.mockResolvedValue({
				success: true,
				data: {
					knittingPatternSlug: "test-pattern",
					knittingPattern: mockKnittingPattern,
					user: mockUser,
				},
			});

			const stripeError = new Error("Stripe API error");
			mockCreateStripeCheckoutSession.mockRejectedValue(stripeError);

			await expect(makePayment(mockFormData)).rejects.toThrow(
				"Redirect to /cancel",
			);

			expect(mockValidatePaymentRequest).toHaveBeenCalledWith(mockFormData);
			expect(mockCreateStripeCheckoutSession).toHaveBeenCalledWith(
				mockKnittingPattern,
				mockUser,
			);
			expect(mockRedirect).toHaveBeenCalledWith("/cancel");
		});

		it("should redirect to /cancel for any unexpected error in try block", async () => {
			const unexpectedError = new Error("Unexpected error");
			mockValidatePaymentRequest.mockRejectedValue(unexpectedError);

			await expect(makePayment(mockFormData)).rejects.toThrow(
				"Redirect to /cancel",
			);

			expect(mockValidatePaymentRequest).toHaveBeenCalledWith(mockFormData);
			expect(mockRedirect).toHaveBeenCalledWith("/cancel");
			expect(mockCreateStripeCheckoutSession).not.toHaveBeenCalled();
		});
	});

	describe("integration with error handler", () => {
		it("should handle DUPLICATE_ERROR with submission", async () => {
			const mockSubmission = { reply: jest.fn() };
			const duplicateError = {
				success: false as const,
				error: {
					type: "DUPLICATE_ERROR" as const,
					submission: mockSubmission,
				},
			};

			const mockErrorResult = {
				error: {
					duplicateError: "お客様は、こちらの編み図を既に購入済みです",
				},
			};

			mockValidatePaymentRequest.mockResolvedValue(duplicateError);
			mockHandlePaymentError.mockReturnValue(mockErrorResult);

			const result = await makePayment(mockFormData);

			expect(result).toEqual(mockErrorResult);
			expect(mockHandlePaymentError).toHaveBeenCalledWith(duplicateError);
		});

		it("should handle multiple error types consistently", async () => {
			const errorTypes = [
				"FORM_ERROR",
				"AUTH_ERROR",
				"PRODUCT_ERROR",
				"DUPLICATE_ERROR",
			] as const;

			for (const errorType of errorTypes) {
				jest.clearAllMocks();

				const mockError = {
					success: false as const,
					error: {
						type: errorType,
					},
				};

				mockValidatePaymentRequest.mockResolvedValue(mockError);
				mockHandlePaymentError.mockImplementation(() => {
					mockRedirect("/cancel");
					return undefined;
				});

				await expect(makePayment(mockFormData)).rejects.toThrow(
					"Redirect to /cancel",
				);
				expect(mockHandlePaymentError).toHaveBeenCalledWith(mockError);
			}
		});
	});

	describe("function call order and parameters", () => {
		it("should call functions in correct order with correct parameters", async () => {
			const callOrder: string[] = [];

			mockValidatePaymentRequest.mockImplementation(async (formData) => {
				callOrder.push("validatePaymentRequest");
				expect(formData).toBe(mockFormData);
				return {
					success: true,
					data: {
						knittingPatternSlug: "test-pattern",
						knittingPattern: mockKnittingPattern,
						user: mockUser,
					},
				};
			});

			mockCreateStripeCheckoutSession.mockImplementation(
				async (pattern, user) => {
					callOrder.push("createStripeCheckoutSession");
					expect(pattern).toBe(mockKnittingPattern);
					expect(user).toBe(mockUser);
					return mockCheckoutUrl;
				},
			);

			mockRedirect.mockImplementation((url) => {
				callOrder.push("redirect");
				expect(url).toBe(mockCheckoutUrl);
				throw new Error(`Redirect to ${url}`);
			});

			await expect(makePayment(mockFormData)).rejects.toThrow(
				`Redirect to ${mockCheckoutUrl}`,
			);

			expect(callOrder).toEqual([
				"validatePaymentRequest",
				"createStripeCheckoutSession",
				"redirect",
			]);
		});
	});
});
