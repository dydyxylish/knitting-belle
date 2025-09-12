import { parseWithZod } from "@conform-to/zod";

import type { Schema } from "@/amplify/data/resource";
import { runWithServerContext } from "@/app/_lib/createAmplifyServerRunner";
import { hasAlreadyKnittingPattern } from "@/app/_lib/fetch/purchaseHistory/hasAlreadyKnittingPattern";
import { validatePaymentRequest } from "@/app/_lib/serverAction/payment/validatePaymentRequest";
import { getKnittingPatternCookie } from "@/db/repository/knittingPattern/getKnittingPatternCookie";
import { getCurrentUserInfo } from "@/lib/getUserInfo";
import { isAuthenticated } from "@/lib/isAuthenticated";
import { paymentSchema } from "@/lib/schema";

// Mock all dependencies
jest.mock("@conform-to/zod");
jest.mock("@/db/repository/knittingPattern/getKnittingPatternCookie");
jest.mock("@/lib/isAuthenticated");
jest.mock("@/lib/schema");
jest.mock("@/lib/getUserInfo");
jest.mock("@/app/_lib/createAmplifyServerRunner");
jest.mock("@/app/_lib/fetch/purchaseHistory/hasAlreadyKnittingPattern");

const mockParseWithZod = jest.mocked(parseWithZod);
const mockGetKnittingPatternCookie = jest.mocked(getKnittingPatternCookie);
const mockIsAuthenticated = jest.mocked(isAuthenticated);
const mockGetCurrentUserInfo = jest.mocked(getCurrentUserInfo);
const mockRunWithServerContext = jest.mocked(runWithServerContext);
const mockHasAlreadyKnittingPattern = jest.mocked(hasAlreadyKnittingPattern);

describe("validatePaymentRequest", () => {
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
		attention: null,
		downloadCount: 0,
		isPublished: true,
		yarnCraftImages: jest.fn(),
		purchaseHistories: jest.fn(),
		createdAt: "2024-01-01T00:00:00.000Z",
		updatedAt: "2024-01-01T00:00:00.000Z",
	};

	const mockSubmission = {
		reply: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("form validation", () => {
		it("should return FORM_ERROR when form validation fails", async () => {
			mockParseWithZod.mockReturnValue({
				status: "error",
				error: { knittingPatternSlug: ["Required"] },
				payload: {},
			} as any);

			const result = await validatePaymentRequest(mockFormData);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.type).toBe("FORM_ERROR");
				expect(result.error.submission).toBeDefined();
			}
		});

		it("should proceed when form validation succeeds", async () => {
			mockParseWithZod.mockReturnValue({
				status: "success",
				value: { knittingPatternSlug: "test-pattern" },
				payload: {},
			} as any);
			mockIsAuthenticated.mockResolvedValue(false);

			const result = await validatePaymentRequest(mockFormData);

			expect(mockParseWithZod).toHaveBeenCalledWith(mockFormData, {
				schema: paymentSchema,
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.type).toBe("AUTH_ERROR");
			}
		});
	});

	describe("authentication validation", () => {
		beforeEach(() => {
			mockParseWithZod.mockReturnValue({
				status: "success",
				value: { knittingPatternSlug: "test-pattern" },
				reply: mockSubmission.reply,
				payload: {},
			} as any);
		});

		it("should return AUTH_ERROR when user is not authenticated", async () => {
			mockIsAuthenticated.mockResolvedValue(false);

			const result = await validatePaymentRequest(mockFormData);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.type).toBe("AUTH_ERROR");
				expect(result.error.submission).toBeDefined();
			}
		});

		it("should return AUTH_ERROR when user info cannot be retrieved", async () => {
			mockIsAuthenticated.mockResolvedValue(true);
			mockGetCurrentUserInfo.mockResolvedValue(null);

			const result = await validatePaymentRequest(mockFormData);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.type).toBe("AUTH_ERROR");
				expect(result.error.message).toBe("ユーザー情報を取得できませんでした");
			}
		});
	});

	describe("product validation", () => {
		beforeEach(() => {
			mockParseWithZod.mockReturnValue({
				status: "success",
				value: { knittingPatternSlug: "test-pattern" },
				payload: {},
			} as any);
			mockIsAuthenticated.mockResolvedValue(true);
			mockGetCurrentUserInfo.mockResolvedValue(mockUser);
		});

		it("should return PRODUCT_ERROR when knitting pattern is not found", async () => {
			mockRunWithServerContext.mockImplementation(async (callback) => {
				mockGetKnittingPatternCookie.mockResolvedValue(null);
				return await callback({} as any);
			});

			const result = await validatePaymentRequest(mockFormData);

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.type).toBe("PRODUCT_ERROR");
				expect(result.error.message).toBe("指定商品が無効です");
			}
		});
	});

	describe("duplicate purchase validation", () => {
		beforeEach(() => {
			mockParseWithZod.mockReturnValue({
				status: "success",
				value: { knittingPatternSlug: "test-pattern" },
				reply: mockSubmission.reply,
				payload: {},
			} as any);
			mockIsAuthenticated.mockResolvedValue(true);
			mockGetCurrentUserInfo.mockResolvedValue(mockUser);
			mockRunWithServerContext.mockImplementation(async (callback) => {
				mockGetKnittingPatternCookie.mockResolvedValue(
					mockKnittingPattern as any,
				);
				return await callback({} as any);
			});
		});

		it("should return DUPLICATE_ERROR when user already purchased the pattern", async () => {
			mockHasAlreadyKnittingPattern.mockResolvedValue(true);

			const result = await validatePaymentRequest(mockFormData);

			expect(mockHasAlreadyKnittingPattern).toHaveBeenCalledWith({
				user: mockUser.sub,
				knittingPatternSlug: mockKnittingPattern.slug,
			});

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.type).toBe("DUPLICATE_ERROR");
				expect(result.error.submission).toBeDefined();
			}
		});

		it("should skip duplicate check when user has no sub", async () => {
			const userWithoutSub = { email: "test@example.com" };
			mockGetCurrentUserInfo.mockResolvedValue(userWithoutSub);
			mockHasAlreadyKnittingPattern.mockResolvedValue(false);

			const result = await validatePaymentRequest(mockFormData);

			expect(mockHasAlreadyKnittingPattern).not.toHaveBeenCalled();
			expect(result.success).toBe(true);
		});
	});

	describe("successful validation", () => {
		beforeEach(() => {
			mockParseWithZod.mockReturnValue({
				status: "success",
				value: { knittingPatternSlug: "test-pattern" },
				payload: {},
			} as any);
			mockIsAuthenticated.mockResolvedValue(true);
			mockGetCurrentUserInfo.mockResolvedValue(mockUser);
			mockRunWithServerContext.mockImplementation(async (callback) => {
				mockGetKnittingPatternCookie.mockResolvedValue(
					mockKnittingPattern as any,
				);
				return await callback({} as any);
			});
			mockHasAlreadyKnittingPattern.mockResolvedValue(false);
		});

		it("should return success with valid data", async () => {
			const result = await validatePaymentRequest(mockFormData);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.knittingPatternSlug).toBe("test-pattern");
				expect(result.data.knittingPattern).toBe(mockKnittingPattern);
				expect(result.data.user).toBe(mockUser);
			}
		});
	});
});
