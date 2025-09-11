import { redirect } from "next/navigation";

import type { Schema } from "@/amplify/data/resource";
import { handlePaymentError } from "@/app/_lib/serverAction/payment/handlePaymentError";
import type { PaymentValidationResult } from "@/app/_lib/serverAction/payment/types";

// Mock Next.js redirect
jest.mock("next/navigation", () => ({
	redirect: jest.fn(),
}));

const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

describe("handlePaymentError", () => {
	const mockSubmission = {
		reply: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		// Make redirect throw to stop execution (simulating actual behavior)
		mockRedirect.mockImplementation((url: string) => {
			throw new Error(`Redirect to ${url}`);
		});
	});

	describe("successful validation result", () => {
		it("should return undefined for successful validation", () => {
			const successResult: PaymentValidationResult = {
				success: true,
				data: {
					knittingPatternSlug: "test-pattern",
					knittingPattern: {} as Schema["KnittingPattern"]["type"],
					user: { sub: "test-user", email: "test@example.com" },
				},
			};

			const result = handlePaymentError(successResult);
			expect(result).toBeUndefined();
			expect(mockRedirect).not.toHaveBeenCalled();
		});
	});

	describe("FORM_ERROR handling", () => {
		it("should redirect to /cancel for form errors", () => {
			const formError: PaymentValidationResult = {
				success: false,
				error: {
					type: "FORM_ERROR",
					submission: mockSubmission,
				},
			};

			expect(() => handlePaymentError(formError)).toThrow(
				"Redirect to /cancel",
			);
			expect(mockRedirect).toHaveBeenCalledWith("/cancel");
		});
	});

	describe("PRODUCT_ERROR handling", () => {
		it("should redirect to /cancel for product errors", () => {
			const productError: PaymentValidationResult = {
				success: false,
				error: {
					type: "PRODUCT_ERROR",
					message: "指定商品が無効です",
				},
			};

			expect(() => handlePaymentError(productError)).toThrow(
				"Redirect to /cancel",
			);
			expect(mockRedirect).toHaveBeenCalledWith("/cancel");
		});
	});

	describe("AUTH_ERROR handling", () => {
		it("should call submission.reply and return error object when submission exists", () => {
			const authError: PaymentValidationResult = {
				success: false,
				error: {
					type: "AUTH_ERROR",
					submission: mockSubmission,
				},
			};

			const result = handlePaymentError(authError);

			expect(mockSubmission.reply).toHaveBeenCalledWith({
				fieldErrors: {
					sessionError: ["セッションがきれています。再度ログインしてください"],
				},
			});

			expect(result).toEqual({
				error: {
					sessionError: "セッションがきれています。再度ログインしてください",
				},
			});
		});

		it("should redirect to /cancel when no submission exists", () => {
			const authError: PaymentValidationResult = {
				success: false,
				error: {
					type: "AUTH_ERROR",
					message: "ユーザー情報を取得できませんでした",
				},
			};

			expect(() => handlePaymentError(authError)).toThrow(
				"Redirect to /cancel",
			);
			expect(mockRedirect).toHaveBeenCalledWith("/cancel");
		});
	});

	describe("DUPLICATE_ERROR handling", () => {
		it("should call submission.reply and return error object when submission exists", () => {
			const duplicateError: PaymentValidationResult = {
				success: false,
				error: {
					type: "DUPLICATE_ERROR",
					submission: mockSubmission,
				},
			};

			const result = handlePaymentError(duplicateError);

			expect(mockSubmission.reply).toHaveBeenCalledWith({
				fieldErrors: {
					duplicateError: ["お客様は、こちらの編み図を既に購入済みです"],
				},
			});

			expect(result).toEqual({
				error: {
					duplicateError: "お客様は、こちらの編み図を既に購入済みです",
				},
			});
		});

		it("should redirect to /cancel when no submission exists", () => {
			const duplicateError: PaymentValidationResult = {
				success: false,
				error: {
					type: "DUPLICATE_ERROR",
					message: "Already purchased",
				},
			};

			expect(() => handlePaymentError(duplicateError)).toThrow(
				"Redirect to /cancel",
			);
			expect(mockRedirect).toHaveBeenCalledWith("/cancel");
		});
	});

	describe("default error handling", () => {
		it("should redirect to /cancel for unknown error types", () => {
			const unknownError = {
				success: false,
				error: {
					type: "UNKNOWN_ERROR" as any,
					message: "Unknown error",
				},
			} as PaymentValidationResult;

			expect(() => handlePaymentError(unknownError)).toThrow(
				"Redirect to /cancel",
			);
			expect(mockRedirect).toHaveBeenCalledWith("/cancel");
		});
	});

	describe("submission behavior", () => {
		it("should not call reply when submission is undefined for AUTH_ERROR", () => {
			const authErrorWithoutSubmission: PaymentValidationResult = {
				success: false,
				error: {
					type: "AUTH_ERROR",
				},
			};

			expect(() => handlePaymentError(authErrorWithoutSubmission)).toThrow(
				"Redirect to /cancel",
			);
			expect(mockSubmission.reply).not.toHaveBeenCalled();
		});

		it("should not call reply when submission is undefined for DUPLICATE_ERROR", () => {
			const duplicateErrorWithoutSubmission: PaymentValidationResult = {
				success: false,
				error: {
					type: "DUPLICATE_ERROR",
				},
			};

			expect(() => handlePaymentError(duplicateErrorWithoutSubmission)).toThrow(
				"Redirect to /cancel",
			);
			expect(mockSubmission.reply).not.toHaveBeenCalled();
		});
	});

	describe("error message consistency", () => {
		it("should use consistent error messages for session errors", () => {
			const authError: PaymentValidationResult = {
				success: false,
				error: {
					type: "AUTH_ERROR",
					submission: mockSubmission,
				},
			};

			const result = handlePaymentError(authError);

			const expectedMessage =
				"セッションがきれています。再度ログインしてください";
			expect(mockSubmission.reply).toHaveBeenCalledWith({
				fieldErrors: {
					sessionError: [expectedMessage],
				},
			});

			if (result) {
				expect(result.error.sessionError).toBe(expectedMessage);
			}
		});

		it("should use consistent error messages for duplicate errors", () => {
			const duplicateError: PaymentValidationResult = {
				success: false,
				error: {
					type: "DUPLICATE_ERROR",
					submission: mockSubmission,
				},
			};

			const result = handlePaymentError(duplicateError);

			const expectedMessage = "お客様は、こちらの編み図を既に購入済みです";
			expect(mockSubmission.reply).toHaveBeenCalledWith({
				fieldErrors: {
					duplicateError: [expectedMessage],
				},
			});

			if (result) {
				expect(result.error.duplicateError).toBe(expectedMessage);
			}
		});
	});
});
