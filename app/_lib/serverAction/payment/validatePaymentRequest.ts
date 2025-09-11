import "server-only";

import { parseWithZod } from "@conform-to/zod";

import { getKnittingPatternCookie } from "@/db/repository/knittingPattern/getKnittingPatternCookie";
import { isAuthenticated } from "@/lib/isAuthenticated";
import { getLogger } from "@/lib/logger";
import { paymentSchema } from "@/lib/schema";
import { getCurrentUserInfo } from "../../../../lib/getUserInfo";
import { runWithServerContext } from "../../createAmplifyServerRunner";
import { hasAlreadyKnittingPattern } from "../../fetch/purchaseHistory/hasAlreadyKnittingPattern";
import type { PaymentValidationResult } from "./types";

const log = getLogger(import.meta.url);

export async function validatePaymentRequest(
	formData: FormData,
): Promise<PaymentValidationResult> {
	// Form validation
	const submission = parseWithZod(formData, {
		schema: paymentSchema,
	});
	log.debug({ submission }, "submission");

	if (submission.status !== "success") {
		log.error({ submission }, "フォーム入力値に不備があります");
		return {
			success: false,
			error: {
				type: "FORM_ERROR",
				submission,
			},
		};
	}

	// Authentication validation
	if (!(await isAuthenticated())) {
		log.error({ isAuthenticated: false }, "セッションがきれています");
		return {
			success: false,
			error: {
				type: "AUTH_ERROR",
				submission,
			},
		};
	}

	// Get user info
	const user = await getCurrentUserInfo();
	if (!user) {
		return {
			success: false,
			error: {
				type: "AUTH_ERROR",
				message: "ユーザー情報を取得できませんでした",
			},
		};
	}

	const knittingPattern = await runWithServerContext(
		async () =>
			await getKnittingPatternCookie(submission.value.knittingPatternSlug),
		{ withCookies: true },
	);
	if (!knittingPattern) {
		log.error({ notFoundKnittingPatter: true }, "指定商品が無効です");
		return {
			success: false,
			error: {
				type: "PRODUCT_ERROR",
				message: "指定商品が無効です",
			},
		};
	}

	// Duplicate purchase validation
	if (
		user.sub &&
		(await hasAlreadyKnittingPattern({
			user: user.sub,
			knittingPatternSlug: knittingPattern.slug,
		}))
	) {
		log.warn(
			{ user, knittingPattern },
			`ユーザ${user.email}は${knittingPattern.slug}を購入済みです`,
		);
		return {
			success: false,
			error: {
				type: "DUPLICATE_ERROR",
				submission,
			},
		};
	}

	return {
		success: true,
		data: {
			knittingPatternSlug: submission.value.knittingPatternSlug,
			knittingPattern,
			user,
		},
	};
}
