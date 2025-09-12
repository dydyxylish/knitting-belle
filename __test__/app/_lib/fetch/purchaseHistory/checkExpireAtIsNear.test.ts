import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";

import type { Schema } from "@/amplify/data/resource";
import { checkExpireAtIsNear } from "@/app/_lib/fetch/purchaseHistory/checkExpireAtIsNear";

dayjs.extend(objectSupport);

// Mock the environment variable
jest.mock("@/lib/env", () => ({
	env: {
		SIGNED_URL_EXPIRE_WARNING_MINUTES: 5,
	},
}));

describe("checkExpireAtIsNear", () => {
	const mockPurchaseHistory = (
		expireAt: string | null,
	): Schema["PurchaseHistory"]["type"] => ({
		user: "test-user-sub",
		knittingPatternSlug: "test-pattern-slug",
		knittingPattern: jest.fn(),
		purchasedAt: dayjs({ year: 2025, month: 9, day: 10 }).toISOString(),
		sessionId: "test-session-id",
		expireAt,
		signedUrl: null,
		createdAt: dayjs({ year: 2025, month: 9, day: 1 }).toISOString(),
		updatedAt: dayjs({ year: 2025, month: 9, day: 1 }).toISOString(),
	});
	beforeEach(() => {
		// Reset time to a known state
		jest.clearAllMocks();

		jest.useFakeTimers();
		jest.setSystemTime(new Date("2025-09-10T12:00:00.000Z")); // 固定
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	describe("when expireAt is null", () => {
		it("should return null (falsy)", () => {
			const purchaseHistory = mockPurchaseHistory(null);
			const result = checkExpireAtIsNear(purchaseHistory);
			expect(result).toBe(null);
		});
	});

	describe("when expireAt is undefined", () => {
		it("should return undefined (falsy)", () => {
			const purchaseHistory = {
				...mockPurchaseHistory(null),
				expireAt: undefined,
			};
			const result = checkExpireAtIsNear(purchaseHistory);
			expect(result).toBe(undefined);
		});
	});

	describe("when expireAt is set", () => {
		it("should return true when expireAt is in the past", () => {
			// Set expireAt to 1 hour ago
			const expireAt = dayjs().subtract(1, "hour").toISOString();
			const purchaseHistory = mockPurchaseHistory(expireAt);

			const result = checkExpireAtIsNear(purchaseHistory);
			expect(result).toBe(true);
		});

		it("should return true when expireAt is before warning threshold", () => {
			// Set expireAt to 3 minutes from now (less than 5 minute warning)
			const expireAt = dayjs().add(3, "minutes").toISOString();
			const purchaseHistory = mockPurchaseHistory(expireAt);

			const result = checkExpireAtIsNear(purchaseHistory);
			expect(result).toBe(true);
		});

		it("should return false when expireAt is after warning threshold", () => {
			// Set expireAt to 10 minutes from now (more than 5 minute warning)
			const expireAt = dayjs().add(10, "minutes").toISOString();
			const purchaseHistory = mockPurchaseHistory(expireAt);

			const result = checkExpireAtIsNear(purchaseHistory);
			expect(result).toBe(false);
		});

		it("should return false when expireAt is exactly at warning threshold", () => {
			// Set expireAt to exactly 5 minutes from now (equal is not "before", so returns false)
			const expireAt = dayjs().add(5, "minutes").toISOString();
			const purchaseHistory = mockPurchaseHistory(expireAt);

			const result = checkExpireAtIsNear(purchaseHistory);
			expect(result).toBe(false);
		});
	});
});
