"use server";
import "server-only";

import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";

import type { Schema } from "@/amplify/data/resource";
import { env } from "@/lib/env";
import { isAuthenticated } from "@/lib/isAuthenticated";
import { getLogger } from "@/lib/logger";
import { paymentSchema } from "@/lib/schema";
import stripe from "@/lib/stripe";
import { getCurrentUserInfo } from "../../../lib/getUserInfo";
import { getKnittingPattern } from "../fetch/knittingPattern/getKnittingPattern";
import { hasAlreadyKnittingPattern } from "../fetch/purchaseHistory/hasAlreadyKnittingPattern";
import { getImagePathsBySlugWithCookie } from "../fetch/yarnCraftImage/getImagePathsBySlugWithCookie";

const log = getLogger(import.meta.url);
interface User {
	sub?: string;
	email?: string;
}
interface FormSubmission {
	reply: (options: { fieldErrors: Record<string, string[]> }) => unknown;
}

type PaymentValidationResult =
	| {
			success: false;
			error: {
				type: "FORM_ERROR" | "AUTH_ERROR" | "PRODUCT_ERROR" | "DUPLICATE_ERROR";
				submission?: FormSubmission;
				message?: string;
			};
	  }
	| {
			success: true;
			data: {
				knittingPatternSlug: string;
				knittingPattern: Schema["KnittingPattern"]["type"];
				user: User;
			};
	  };

// Helper function for form validation
async function validatePaymentRequest(
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

	// Product validation
	const knittingPattern = await getKnittingPattern(
		submission.value.knittingPatternSlug,
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

// Helper function for creating Stripe checkout session
async function createStripeCheckoutSession(
	knittingPattern: Schema["KnittingPattern"]["type"],
	user: User,
): Promise<string> {
	const images = await getImagePathsBySlugWithCookie(knittingPattern.slug);

	const lineItems = [
		{
			price_data: {
				currency: "jpy",
				product_data: {
					name: knittingPattern.title,
					images: images.slice(0, 1),
				},
				unit_amount: knittingPattern.price,
			},
			quantity: 1,
		},
	];

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: lineItems,
		mode: "payment",
		success_url: env.STRIPE_SUCCESS_URL,
		cancel_url: env.STRIPE_CANCEL_URL,
		metadata: {
			sub: user.sub || "",
			knittingPatternSlug: knittingPattern.slug,
		},
	});

	if (!session.url) {
		log.error({ session }, "セッションの作成に失敗しました");
		throw new Error("Stripeセッションの作成に失敗しました");
	}

	return session.url;
}

// Helper function for handling payment errors
function handlePaymentError(validationResult: PaymentValidationResult) {
	if (validationResult.success) return;

	const error = validationResult.error;

	switch (error.type) {
		case "FORM_ERROR":
		case "PRODUCT_ERROR":
			redirect("/cancel");
			break;

		case "AUTH_ERROR":
			if (error.submission) {
				return error.submission.reply({
					fieldErrors: {
						sessionError: [
							"セッションがきれています。再度ログインしてください",
						],
					},
				});
			}
			redirect("/cancel");
			break;

		case "DUPLICATE_ERROR":
			if (error.submission) {
				return error.submission.reply({
					fieldErrors: {
						duplicateError: [`お客様は、こちらの編み図を既に購入済みです`],
					},
				});
			}
			redirect("/cancel");
			break;

		default:
			redirect("/cancel");
	}
}

export async function makePayment(formData: FormData) {
	try {
		// Validate payment request
		const validationResult = await validatePaymentRequest(formData);

		if (!validationResult.success) {
			return handlePaymentError(validationResult);
		}

		const { knittingPattern, user } = validationResult.data;

		// Create Stripe checkout session
		const checkoutUrl = await createStripeCheckoutSession(
			knittingPattern,
			user,
		);

		// Redirect to Stripe checkout
		redirect(checkoutUrl);
	} catch (error) {
		log.error({ error }, "決済処理中にエラーが発生しました");
		redirect("/cancel");
	}
}
